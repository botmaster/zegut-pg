/**
 * Get episode author image
 */
import { PodcastItunesAuthor } from '@/types/podcast'

export const getEpisodeAuthorImage = (author: PodcastItunesAuthor) => {
  switch (author) {
    case PodcastItunesAuthor.FrancisZegut:
      return 'https://images.rtl.fr/~c/600v600/rtl2/www/1532352-francis-zegut.jpg'
    case PodcastItunesAuthor.MarjorieHache:
      return 'https://images.rtl.fr/~c/600v600/rtl2/www/1532345-marjorie-ache.jpg'
    case PodcastItunesAuthor.Alexis:
      return 'https://images.rtl.fr/~c/600v600/rtl2/www/293805-alexis.jpg'
    default:
      return 'https://images.rtl.fr/~c/600v600/rtl2/www/1569653-rtl2-pop-rock-station.jpg'
  }
}
