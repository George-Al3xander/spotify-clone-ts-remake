


export type typeButtonProps = {
    status: number| boolean,
    func: () => void
}



export type listProps = {
    list: IAlbum | IPlaylist,    
    isLoading: boolean,   
    name: string,
}

interface IReturnItem {
    name: string,
    uri: string,
    id: string,
}
export interface ICurrentUser extends IReturnItem{
    link: ""
    img?: string
}

interface list extends IReturnItem {
    date: Date,
    tracks: [] | sortedPlaylistTrack[],
    duration: number | string,
    img: {
        640?: string,
        300?: string,
        64?: string
    },    
}

export interface IAlbum extends list {
    artists: {name: string,external_urls: {spotify: string}}[]   
}

export interface IPlaylist extends list {
    artists: []
}


interface IPlayableItem extends IReturnItem {
    explicit: boolean
    duration_ms: number,
    release_date: Date,

}

export interface unSortedTrack extends IPlayableItem{    
    album: {images: {url: string}[], name: string, uri: string, artists: []}[],
    artists: []    
}

export interface sortedPlaylistTrack extends IReturnItem  {     
    isExplicit: boolean, 
    img: string,
    album: {
        name: string,
        uri: string,
    },
    duration: number,
    artists: [],
    date: Date | string,
    isFollowed?: boolean
}

export interface episode extends IPlayableItem {
    images: {url: string}[],
    description: String,
    podcast: object,    

}

export interface SortedPlaylist extends list { 
    description: string,
    followers: number,
    owner: {
        display_name: string,
        urls: object,
        id: string
    },
    isPublic: boolean,
    isFollowed?: boolean
}

export interface SortedAlbum extends list { 
    artists: []    
}

export interface SortedShow  { 
    name: string,     
    owner: {
        display_name: string,
        urls: object,
        id: string
    },                    
    img: string,                
    id: string,
    uri: string,
    description: string,
    isExplicit:boolean,
    episodes: episodesType,
    total: number
}

export type episodesType = {   
    items: [],
    next: string,
    previous: string  
}

export interface IEpisode extends IReturnItem {
    img: string,
    date: Date,
    description: string
    isExplicit:boolean,
    duration: string | number,
    podcast: {
        name: string,
        uri: string,
        id: string,
        total: number
    }
}

export type sideMenuContentProps = {
    functions: Function[],
    type: string,
    array: {id: string, link: string, img: string, name: string, owner: string, uri: string}[]   
}