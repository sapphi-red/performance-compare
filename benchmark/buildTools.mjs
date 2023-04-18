import { rm } from "fs/promises";
import { spawn } from "child_process";
import kill from "tree-kill";
import path from "path";
import url from "url";

const _dirname = path.dirname(url.fileURLToPath(import.meta.url))

class BuildTool {
  constructor(name, port, script, startedRegex, clean) {
    this.name = name;
    this.port = port;
    this.script = script;
    this.startedRegex = startedRegex;
    this.clean = clean
  }

  async startServer() {
    const child = spawn(`npm`, ["run", this.script], { stdio: 'pipe', shell: true, env: { ...process.env, NO_COLOR: '1' } });
    this.child = child;
    return new Promise((resolve, reject) => {
      child.stdout.on('data', (data) => {
        const match = this.startedRegex.exec(data);
        if (match) {
          resolve(match[1] ? Number(match[1]) : null);
        }
      });
      child.on('error', (error) => {
        console.log(`${this.name} error: ${error.message}`);
        reject(error);
      });
      child.on('exit', (code) => {
        if (code !== null && code !== 0 && code !== 1) {
          console.log(`${this.name} exit: ${code}`);
          reject(code);
        }
      });
    });
  }

  stop() {
    if (this.child) {
      this.child.stdin.pause();
      this.child.stdout.destroy();
      this.child.stderr.destroy();
      kill(this.child.pid);
    }
  }
}

export const buildTools = [
  new BuildTool(
    "Rspack",
    8080,
    "start:rspack",
    /Time: (.+)ms/,
  ),
  new BuildTool(
    "Turbopack",
    3000,
    "start:turbopack",
    /initial compilation (.+)ms/,
    () => rm(path.join(_dirname, '../.next'), { force: true, recursive: true, maxRetries: 5 }),
  ),
  new BuildTool(
    "Webpack (babel)",
    8081,
    "start:webpack",
    /compiled successfully in (.+) ms/,
  ),
  new BuildTool(
    "Webpack (swc)",
    8082,
    "start:webpack-swc",
    /compiled successfully in (.+) ms/,
  ),
  new BuildTool(
    "Vite",
    5173,
    "start:vite",
    /ready in (.+) ms/,
    () => rm(path.join(_dirname, '../node_modules/.vite'), { force: true, recursive: true, maxRetries: 5 }),
  ),
  new BuildTool(
    "Vite (swc)",
    5174,
    "start:vite-swc",
    /ready in (.+) ms/,
    () => rm(path.join(_dirname, '../node_modules/.vite-swc'), { force: true, recursive: true, maxRetries: 5 }),
  ),
  new BuildTool(
    "Farm",
    9000,
    "start:farm",
    /Ready on (?:.+) in (.+)ms/,
  ),
  new BuildTool(
    "Parcel",
    1234,
    "start:parcel",
    /Server running/,
    () => Promise.all([
      rm(path.join(_dirname, '../.parcel-cache'), { force: true, recursive: true, maxRetries: 5 }),
      rm(path.join(_dirname, '../dist-parcel'), { force: true, recursive: true, maxRetries: 5 })
    ]),
  ),
]
