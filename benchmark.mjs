import { spawn } from "child_process";
import { appendFileSync, readFileSync, writeFileSync } from "fs";
import { rm } from "fs/promises";
import path from "path";
import playwright from "playwright";

const rootFilePath = path.resolve('src', 'comps', 'triangle.jsx');
const leafFilePath = path.resolve('src', 'comps', 'triangle_1_1_2_1_2_2_1.jsx');

const originalRootFileContent = readFileSync(rootFilePath, 'utf-8');
const originalLeafFileContent = readFileSync(leafFilePath, 'utf-8');

class BuildTool {
  constructor(name, port, script, startedRegex) {
    this.name = name;
    this.port = port;
    this.script = script;
    this.startedRegex = startedRegex;
  }

  async startServer() {
    return new Promise((resolve, reject) => {

      const child = spawn(`npm`, ["run", this.script], { stdio: 'pipe', shell: true, env: { ...process.env, NO_COLOR: '1' } });
      this.child = child;

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
        if (code !== null && code !== 0) {
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
      this.child.kill();
    }
  }
}

const buildTools = [
  new BuildTool("Rspack", 8080, "start:rspack", /build success, time cost (.+) ms/),
  new BuildTool("Turbopack", 3000, "start:turbopack", /initial compilation (.+)ms/),
  new BuildTool("Webpack (babel)", 8081, "start:webpack", /compiled successfully in (.+) ms/),
  new BuildTool("Webpack (swc)", 8082, "start:webpack-swc", /compiled successfully in (.+) ms/),
  new BuildTool("Vite", 5173, "start:vite", /ready in (.+) ms/),
  new BuildTool("Vite (swc)", 5174, "start:vite-swc", /ready in (.+) ms/),
  new BuildTool("Farm", 9000, "start:farm", /Ready on (?:.+) in (.+)ms/),
  new BuildTool("Parcel", 1234, "start:parcel", /Server running/),
]

const hotRun = process.argv.includes('--hot')
const note = hotRun ? '(NOTE: you should run cold run before hot run to populate the cache)' : ''
console.log(`Running ${hotRun ? 'hot' : 'cold'} run${note}`)
console.log()

if (!hotRun) {
  await Promise.all([
    // Turbopack
    rm('./.next', { force: true, recursive: true }),
    // Vite
    rm('./node_modules/.vite', { force: true, recursive: true }),
    // Vite (swc)
    rm('./node_modules/.vite-swc', { force: true, recursive: true }),
    // Parcel
    rm('./.parcel-cache', { force: true, recursive: true }),
    rm('./dist-parcel', { force: true, recursive: true })
  ])
}

const browser = await playwright.chromium.launch();

for (const buildTool of buildTools) {
  const page = await browser.newPage();

  await new Promise((resolve) => setTimeout(resolve, 1000)); // give some rest

  const loadPromise = page.waitForEvent('load');
  const pageLoadStart = Date.now();
  const serverStartTime = await buildTool.startServer();
  page.goto(`http://localhost:${buildTool.port}`);
  await loadPromise;

  if (serverStartTime !== null) {
    console.log(buildTool.name, ` startup time: ${(Date.now() - pageLoadStart)}ms (including server start up time: ${serverStartTime}ms)`);
  } else {
    console.log(buildTool.name, ` startup time: ${(Date.now() - pageLoadStart)}ms (including server start up time)`);
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const rootConsolePromise = page.waitForEvent('console', { predicate: e => e.text().includes('root hmr') });
  appendFileSync(rootFilePath, `
    console.log('root hmr');
  `)
  const hmrRootStart = Date.now();
  await rootConsolePromise;
  console.log(buildTool.name, ` Root HMR time: ${Date.now() - hmrRootStart}ms`);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const leafConsolePromise = page.waitForEvent('console', { predicate: e => e.text().includes('leaf hmr') });
  appendFileSync(leafFilePath, `
    console.log('leaf hmr');
  `)
  const hmrLeafStart = Date.now();
  await leafConsolePromise;
  console.log(buildTool.name, ` Leaf HMR time: ${Date.now() - hmrLeafStart}ms`);

  buildTool.stop();
  await page.close();

  writeFileSync(rootFilePath, originalRootFileContent);
  writeFileSync(leafFilePath, originalLeafFileContent);
}

await browser.close();
