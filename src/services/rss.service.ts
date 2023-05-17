/**
 * Service to fetch RSS feed
 */

/**
 * Fetch RSS feed via "RSS feed to JSON API"
 * @see https://rss-to-json-serverless-api.vercel.app/
 * @param rssUrl
 * @returns RSS feed as JSON
 */

export async function fetchRss(rssUrl: string) {
  const response = await fetch(
    `https://rss-to-json-serverless-api.vercel.app/api?feedURL=${rssUrl}`
  )
  return await response.json()
}
