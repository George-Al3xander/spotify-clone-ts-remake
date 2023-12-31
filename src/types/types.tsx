import { Dispatch } from "@reduxjs/toolkit"

export type typeButtonProps = {
    status: number| boolean,
    func: Function
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
    link: string,
    img?: string
}

interface list extends IReturnItem {
    date: Date | string,
    tracks: [] | sortedPlaylistTrack[],
    duration: number | string,
    img:  string,    
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
    artists: {name: string, external_urls: {spotify: string}}[] & [],
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
        urls: {spotify: string},
        id: string
    },
    isPublic: boolean,
    isFollowed?: boolean
}

export interface IArtists {
    name: string, 
    external_urls: {spotify: string}
}

export interface SortedAlbum extends list { 
    artists: IArtists[] | [],
}

export interface SortedShow  { 
    name: string,     
    owner: {
        display_name: string,
        urls: object,
        id: string
    } | string,
    img: string,                
    id: string,
    uri: string,
    description: string,
    isExplicit:boolean,
    episodes: episodesType,
    total: number
}

export type episodesType = {   
    items: IEpisode[],
    next: string,
    previous: string  
}

export interface IEpisode extends IReturnItem {
    img: string,
    date: Date | string,
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


export interface IUnsortedEpisode extends IReturnItem {
    images: {url: string}[],
    release_date: Date,
    description: string,
    duration_ms: number,
    explicit: boolean
}

export type sideMenuContentProps = {
    functions: Function[],
    type: string,
    array: {id: string, link: string, img: string, name: string, owner: string, uri: string}[]   
}

export type playlistOrAlbumProps = {
    clickPlay: Function,
    clickTrack: Function
}

interface trackRelatedDisplayProps {
    type: string,
    clickTrack: Function
}

export interface displayTracksProps extends trackRelatedDisplayProps {
    listUri: string,
    array: sortedPlaylistTrack[],
    setResultsTracks?:React.Dispatch<React.SetStateAction<sortedPlaylistTrack[]>>,
    resultsTracks?: sortedPlaylistTrack[]
}

export interface displayTrackProps extends trackRelatedDisplayProps {
    followTrack: Function, 
    unfollowTrack: Function,
    track: sortedPlaylistTrack,
    num: number
}


export type DisplayEpisodeChildrenProps = {
    episode: IEpisode,
    showUri: string,    
    firstItemRef: React.RefObject<HTMLImageElement>,
    index: number,
    offset: number | Number,    
    displayEpisode: Function,
    clickPlay: Function,
}

export type searchPageProps = {
    displayAlbum: Function, 
    displayPlaylist: Function,
    displayShow: Function,
    displayEpisode: Function, 
    clickTrack: Function
}


export interface searchResUnsorted extends IReturnItem {

}

// song: {name: string,uri: string,id: string,explicit: boolean, duration_ms: number, artists: [], 
//     album: {images: {url:string}[], name: string, uri: string}}


//     (list: {name: string,uri:string,id: string,owner: {
//         display_name: string,
//         urls: object,
//         id: string
//     },images: {url: string}[]})