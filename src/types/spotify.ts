export interface UserProfile {
    country: string
    display_name: string
    email: string
    explicit_content: {
        filter_enabled: boolean
        filter_locked: boolean
    }
    external_urls: { spotify: string }
    followers: { href: string; total: number }
    href: string
    id: string
    images: Image[]
    product: string
    type: string
    uri: string
}

export interface Image {
    url: string
    height: number
    width: number
}

export interface UserAuth {
    access_token: string
    token_type: string
    expires_in: number
    scope: string
    refresh_token: string
}

export interface Playlist {
    collaborative: boolean
    description: string
    external_urls: { spotify: string }
    href: string
    id: string
    images: Image[]
    name: string
    owner: {
        display_name: string
        external_urls: { spotify: string }
        href: string
        id: string
        type: string
        uri: string
    }
    primary_color: string
    public: boolean
    snapshot_id: string
    tracks: {
        href: string
        total: number
    }
    type: string
    uri: string
}
