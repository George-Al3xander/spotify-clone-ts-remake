import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import type {SortedAlbum, SortedPlaylist } from '../../types/types'
interface CurrentStates {    
    currentPlayUri: string,
    currentPlaylist: SortedPlaylist,
    currentAlbum: SortedAlbum,
    currentShow: object,
    currentDisplayEpisode: object,
    currentSearch: object,
    currentEpisode: string,
    currentTrack: string,
    currentDevice: string
}

const setRecentTrack = () : string => {
    localStorage.setItem("recentTrack", "")
    return ""
  }

const initialState: CurrentStates = {
    currentPlayUri: localStorage.getItem("recentTrack") || setRecentTrack(),
    currentPlaylist: {
        name: "",
        description: "",
        followers: 0,
        owner: {
            display_name: "",
            urls: {spotify: ""},
            id: ""
        },
        id:"",
        uri: "",
        isPublic: true, 
        date: new Date().toISOString(),
        tracks: [], 
        duration: 0,
        img: ""
    },
    currentAlbum: {
        name: "",         
        id:"",
        uri: "",
        artists: [],
        date: new Date().toISOString(),
        tracks: [], 
        duration: 0,
        img: ""
    },
    currentShow: {},
    currentDisplayEpisode: {},
    currentSearch: {},    
    currentEpisode: "",
    currentTrack: "",
    currentDevice: ""
}

export const infoSlice = createSlice({
    name: "currentStates",
    initialState,
    reducers: {
        setCurrentPlayUri: (state, action: PayloadAction<{currentPlayUri: string}>) => {
            state.currentPlayUri = action.payload.currentPlayUri
        },

        setCurrentPlaylist: (state, action: PayloadAction<{currentPlaylist: SortedPlaylist}>) => {
            state.currentPlaylist = action.payload.currentPlaylist
        },

        setCurrentAlbum: (state, action: PayloadAction<{currentAlbum: SortedAlbum}>) => {
            state.currentAlbum = action.payload.currentAlbum
        },

        setCurrentShow: (state, action: PayloadAction<{currentShow: object}>) => {
            state.currentShow = action.payload.currentShow
        },

        setCurrentDisplayEpisode: (state, action: PayloadAction<{currentDisplayEpisode: object}>) => {
            state.currentDisplayEpisode = action.payload.currentDisplayEpisode
        },

        setCurrentSearch: (state, action: PayloadAction<{currentSearch: object}>) => {
            state.currentSearch = action.payload.currentSearch
        },
        setCurrentEpisode: (state, action: PayloadAction<{currentEpisode: string}>) => {
            state.currentEpisode = action.payload.currentEpisode
        },
        setCurrentTrack: (state, action: PayloadAction<{currentTrack: string}>) => {
            state.currentTrack = action.payload.currentTrack
        },
        setCurrentDevice: (state, action: PayloadAction<{currentDevice: string}>) => {
            state.currentDevice = action.payload.currentDevice
        }
    }
})

export const {setCurrentPlayUri,
    setCurrentPlaylist,
    setCurrentAlbum,
    setCurrentShow,
    setCurrentDisplayEpisode,
    setCurrentSearch,    
    setCurrentEpisode,
    setCurrentDevice,
    setCurrentTrack} = infoSlice.actions

export const selectInfo = (state: RootState) => state.currentStates

export default infoSlice.reducer

