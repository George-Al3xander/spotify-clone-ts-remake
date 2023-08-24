import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'


interface StatusesState {
    clickStatus: boolean,
    shuffleStatus: boolean,
    repeatStatus: number,
    offset: number,
    isLoading: boolean,
      
}

const initialState: StatusesState = {
    clickStatus: false,
    shuffleStatus: false,
    repeatStatus: 0,
    offset: 0,
    isLoading: false,
  
}

export const statSlice = createSlice({
    name: "statuses",
    initialState,
    reducers: {
        changeClickStatus: (state, action: PayloadAction<{clickStatus: boolean}>) => {
            state.clickStatus = action.payload.clickStatus
        },
        changeShuffleStatus: (state) => {
            state.shuffleStatus = !state.shuffleStatus
        },
        changeLoadingStatus: (state) => {
            state.isLoading = !state.isLoading
        },
        setRepeatStatus: (state, action: PayloadAction<{repeatStatus: number}>) => {
            state.repeatStatus = action.payload.repeatStatus
        },
        setOffset: (state, action: PayloadAction<{offset: number}>) => {
            state.offset = action.payload.offset
        }
    }
})

export const {
        changeClickStatus,
        changeShuffleStatus,
        changeLoadingStatus,
        setRepeatStatus,
        setOffset   
    } = statSlice.actions

export const selectInfo = (state: RootState) => state.statuses

export default statSlice.reducer

