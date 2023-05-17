/**
 * Pasrse RSS feed
 */

const rssUrl = 'https://www.rtl2.fr/podcast/pop-rock-station.xml'

/**
 * Fetch rss feed via CORS proxy and parse it to JSON
 */
export async function fetchRss() {
  const response = await fetch(
    `https://rss-to-json-serverless-api.vercel.app/api?feedURL=${rssUrl}`
  )
  const data = await response.json()
  return data
}
