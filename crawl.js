import { JSDOM } from 'jsdom'

async function crawlPage(baseURL, currentURL = baseURL, pages = {}) {
  // check if the currentURL is a subpage of the baseURL
  if (!currentURL.includes(baseURL)) {
    return pages
  } else if (currentURL.includes(baseURL)) {
    const normalisedCurrentURL = normaliseURL(currentURL)

    if (Object.keys(pages).includes(normalisedCurrentURL)) {
      pages[normalisedCurrentURL] += 1

      return pages
    } else {
      pages[normalisedCurrentURL] = 1
      let html = await fetchHTML(currentURL)
      const urlList = getURLsFromHTML(html, baseURL)
      urlList.forEach((url) => {
        crawlPage(baseURL, url, pages)
      })
    }
    return pages
  }
  return pages
}

async function fetchHTML(url) {
  const res = await fetch(url)
  const html = await res.text()

  if (!res.ok) {
    console.log(res)
    throw new Error('Something went wrong')
  }

  if (!res.headers.get('Content-Type') === 'text/html') {
    console.error('Content-Type not text/html')
    return
  } else {
    return html
  }
}
// getURLsFromHTML(htmlBody, baseURL) takes 2 arguments. The first is an HTML string as we discussed earlier, while the second is the root URL of the website we're crawling. This will allow us to rewrite relative URLs into absolute URLs.
// It returns an un-normalized array of all the URLs found within the HTML.
function getURLsFromHTML(htmlBody, baseURL) {
  const dom = new JSDOM(htmlBody)
  let urlList = []
  let aTagList = dom.window.document.querySelectorAll('a')

  aTagList.forEach((aTag) => {
    let href = aTag.href
    if (!aTag.href.includes('http')) {
      href = baseURL + aTag.href
    }
    urlList.push(removeTrailingSlash(href))
  })

  return urlList
}
function normaliseURL(url) {
  const inputUrl = new URL(url)

  inputUrl.pathname = removeTrailingSlash(inputUrl.pathname)

  let normalisedUrl = inputUrl.hostname + inputUrl.pathname
  return normalisedUrl
}

function removeTrailingSlash(str) {
  if (str.endsWith('/')) {
    str = str.slice(0, -1)
  }

  return str
}

export { crawlPage, normaliseURL, getURLsFromHTML }
