export const parseArgs = () => {
  const typeArg = process.argv.find((arg) => arg.startsWith('-t='))
  let type = 'all'
  if (typeArg) {
    const typeArgValue = typeArg.slice('-t='.length)
    if (
      typeArgValue !== 'dev' &&
      typeArgValue !== 'build' &&
      typeArgValue !== 'all'
    ) {
      throw new Error('type should be "dev" or "build" or "all"')
    }
    type = typeArgValue
  }

  const countArg = process.argv.find((arg) => arg.startsWith('-n='))
  let count = type === 'dev' ? 3 : 1
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

  const outputMd = process.argv.includes('--markdown')

  return {
    type,
    count,
    hotRun,
    outputMd
  }
}
