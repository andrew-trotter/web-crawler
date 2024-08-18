import { argv } from 'node:process'
import { crawlPage } from './crawl.js'
import { printReport } from './report.js'

async function main() {
  let arg = argv.slice(2)
  if (arg.length < 1) {
    console.log('Please provide a url like: https://google.com')
    return
  }

  if (arg.length > 1) {
    console.log('Please provide only 1 url like: https://google.com')
    return
  } else {
    let baseURL = arg[0]

    let pages = await crawlPage(baseURL)
    printReport(pages)
    return
  }
}

main()
