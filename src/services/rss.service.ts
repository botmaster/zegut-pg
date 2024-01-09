/**
 * Service to fetch RSS feed
 */

import { parse } from 'rss-to-json'

const CORS_PROXY = 'https://corsproxy.io/?'

export async function fetchRss(rssUrl: string) {
  const url = CORS_PROXY + encodeURIComponent(rssUrl)
  return parse(url).then((rss) => {
    return rss
  })
}
