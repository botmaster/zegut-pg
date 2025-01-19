/**
 * Service to fetch RSS feed
 */

import { parse } from 'rss-to-json'

//const CORS_PROXY = 'https://corsproxy.io/?'

export async function fetchRss(rssUrl: string) {
  /*const uri = encodeURIComponent(rssUrl)
  const url = CORS_PROXY + uri*/

  return await parse(rssUrl)
}
