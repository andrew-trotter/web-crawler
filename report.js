function printReport(pages) {
  console.log('Starting report')
  const sorted = Object.fromEntries(
    Object.entries(pages).sort(([, a], [, b]) => b - a)
  )
  console.log(sorted)
}

export { printReport }
