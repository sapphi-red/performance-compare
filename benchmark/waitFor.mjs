/**
 * @param {import('puppeteer').Page} page
 * @param {string} eventName
 * @param {{ predicate: (event: any) => boolean }?} options
 */
export const waitForEvent = (page, eventName, options = {}) =>
  new Promise((resolve) => {
    const handler = (event) => {
      if (options.predicate === undefined || options.predicate(event)) {
        page.off(eventName, handler)
        resolve()
      }
    }
    page.on(eventName, handler)
  })
