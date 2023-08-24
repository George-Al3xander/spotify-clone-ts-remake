import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import useAuth from '../../components/auth/useAuth'
import { ICurrentUser } from '../../types/types'
interface InfoState {
    token: string,
    currentUser: ICurrentUser,
    // {
    //     name: string,
    //     link: string,
    //     img:string,
    //     id: string,
    //     uri: string
    //   },   
}

const initialState: InfoState = {
    token: "",
    currentUser: {id: "", name: "",uri: "",link: ""},
  
}

export const infoSlice = createSlice({
    name: "authInfo",
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<{token: string}>) => {
            state.token = action.payload.token
        },
        setCurrentUser: (state, action: PayloadAction<{currentUser: ICurrentUser}>) => {
            state.currentUser = action.payload.currentUser
        },
    }
})

export const {setToken, setCurrentUser} = infoSlice.actions

export const selectInfo = (state: RootState) => state.authInfo

export default infoSlice.reducer

