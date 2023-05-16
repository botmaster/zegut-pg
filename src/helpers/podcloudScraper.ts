/**
 * Scraper for podcloud
 */

/**
 * Fetch podCloud page with axios
 * Parse the page with cheerio and return the episodes.
 */
import axios from 'axios'
import * as cheerio from 'cheerio'
import { type Episode } from '@/types/types'

export const fetchAndParsePodcastPage = async (url: string): Promise<Episode> => {
  const response = await axios.get(url)
  const $ = cheerio.load(response.data)
  const selectorPlaylist = '.col-md-12.post-content p'
  const selectorEpisode = '.episode'
  const selectorImage = 'img.cover-256'
  const $episode = $(selectorEpisode)

  const title = $($episode).find('.panel-heading h3').text()
  const description = $($episode).find('.panel-heading h4').text().split('\n').join(' ').trim()
  const duration = $($episode)
    .find('.panel-heading h4.font-thin:not(.published_at_by)')
    .text()
    .split(' : ')[1]
    .trim()

  const $playlist = $($episode).find(selectorPlaylist)
  const playlistArray = Array.from($playlist)
  const playlistData: Array<string> = []
  playlistArray.forEach((item) => {
    const content = $(item).text()
    content.split('\n').forEach((track) => {
      // console.log('track -->', track)

      // Exclude "reprise" word. Zégut name some tracks as "La Reprise, L'original" but it's not a real track
      if (track.toLowerCase().includes('reprise')) {
        //console.log('reprise')
        return
      }
      playlistData.push(track)
    })
  })

  const $image = $(selectorImage)
  const image = {
    height: 256,
    width: 256,
    url: $($image).attr('src') || '',
    alt: $($image).attr('alt') || ''
  }

  return {
    title,
    description,
    duration,
    playlist: playlistData || [],
    image
  }
}
