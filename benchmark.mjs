import { appendFileSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import puppeteer from "puppeteer";
import { buildTools } from "./benchmark/buildTools.mjs"
import { waitForEvent } from "./benchmark/waitFor.mjs";

const rootFilePath = path.resolve('src', 'comps', 'triangle.jsx');
const leafFilePath = path.resolve('src', 'comps', 'triangle_1_1_2_1_2_2_1.jsx');

const originalRootFileContent = readFileSync(rootFilePath, 'utf-8');
const originalLeafFileContent = readFileSync(leafFilePath, 'utf-8');

const countArg = process.argv.find(arg => arg.startsWith('-n='))
let count = 3
if (countArg) {
  const countArgValue = +countArg.slice('-n='.length)
  if (countArgValue === NaN) {
    throw new Error('countArgValue is NaN')
  }
  if (countArgValue < 1) {
    throw new Error('countArgValue < 1')
  }
  count = countArgValue
}

const hotRun = process.argv.includes('--hot')
console.log(`Running ${hotRun ? 'hot' : 'cold'} run ${count} times`)
console.log()

const browser = await puppeteer.launch();
const results = []

for (const buildTool of buildTools) {
  const totalResult = {}

  if (hotRun) {
    console.log(`Populate cache: ${buildTool.name}`);
    const page = await browser.newPage();
    await buildTool.startServer();
    await page.goto(`http://localhost:${buildTool.port}`, { waitUntil: 'load' });
    buildTool.stop();
    await page.close();
  }

  for (let i = 0; i < count; i++) {
    console.log(`Running: ${buildTool.name} (${i+1})`);

    if (!hotRun) {
      await buildTool.clean?.()
    }

    const page = await browser.newPage();
    await new Promise((resolve) => setTimeout(resolve, 300)); // give some rest

    const loadPromise = waitForEvent(page, 'load');
    const pageLoadStart = Date.now();
    const serverStartTime = await buildTool.startServer();
    page.goto(`http://localhost:${buildTool.port}`);
    await loadPromise;
    totalResult.startup ??= 0;
    totalResult.startup += (Date.now() - pageLoadStart);
    if (serverStartTime !== null) {
      totalResult.serverStart ??= 0;
      totalResult.serverStart += serverStartTime;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    const rootConsolePromise = waitForEvent(page, 'console', { predicate: e => e.text().includes('root hmr') });
    appendFileSync(rootFilePath, `
      console.log('root hmr');
    `)
    const hmrRootStart = Date.now();
    await rootConsolePromise;
    totalResult.rootHmr ??= 0;
    totalResult.rootHmr += (Date.now() - hmrRootStart);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const leafConsolePromise = waitForEvent(page, 'console', { predicate: e => e.text().includes('leaf hmr') });
    appendFileSync(leafFilePath, `
      console.log('leaf hmr');
    `)
    const hmrLeafStart = Date.now();
    await leafConsolePromise;
    totalResult.leafHmr ??= 0;
    totalResult.leafHmr += (Date.now() - hmrLeafStart);

    buildTool.stop();
    await page.close();

    writeFileSync(rootFilePath, originalRootFileContent);
    writeFileSync(leafFilePath, originalLeafFileContent);
  }

  const result = Object.fromEntries(Object.entries(totalResult).map(([k, v]) => [k, v ? v / count : v]))
  results.push({ name: buildTool.name, result })
}

await browser.close();

console.log('-----')
console.log('Results')

const out = results.map(({ name, result }) => ({
  name,
  'startup time': result.serverStart ? `${result.startup.toFixed(1)}ms (including server start up time: ${result.serverStart.toFixed(1)}ms)` : `${result.startup.toFixed(1)}ms`,
  'Root HMR time': `${result.rootHmr.toFixed(1)}ms`,
  'Leaf HMR time': `${result.leafHmr.toFixed(1)}ms`
}))

console.table(out)
