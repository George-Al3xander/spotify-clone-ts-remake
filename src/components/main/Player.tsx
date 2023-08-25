import React, { useRef, useState } from "react";
import  SpotifyPlayer from "react-spotify-web-playback"
import ShuffleBtn from "../btns/ShuffleBtn";
import RepeatBtn from "../btns/RepeatBtn";
import { RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentDevice, setCurrentTrack } from "../../redux/slices/currentStates";
import { changeClickStatus, setRepeatStatus } from "../../redux/slices/statuses";
const Player = ({token,  shuffle, repeat}:{token: string, shuffle: Function,repeat:Function}) => {
  const repeatTypes = ['off', 'context' , 'track' ] 
  const item = useRef<SpotifyPlayer>();  
  const {currentPlayUri} = useSelector((state: RootState) => state.currentStates)
  const {clickStatus, shuffleStatus, repeatStatus, offset} = useSelector((state: RootState) => state.statuses)
  const dispatch = useDispatch();
    return <SpotifyPlayer 
    showSaveIcon={true}
    ref={item} 
    play={clickStatus}     
    hideAttribution={true}
    token={token} 
    name="Clonify Player" 
    offset={offset}
    locale={{
        next: "Damn"
    }}
    callback={(state: any) => {
        let currentDeviceId = state.currentDeviceId;
        let repeatState = state.repeat;
        dispatch(setCurrentDevice({currentDevice: currentDeviceId}))
        if(repeatStatus != repeatTypes.indexOf(repeatState)) { 
            dispatch(setRepeatStatus({repeatStatus: repeatTypes.indexOf(repeatState)})) 
        } 
        dispatch(changeClickStatus({clickStatus: state.isPlaying}))   
        dispatch(setCurrentTrack({currentTrack: state.track.uri}))   
        if(state.track.artists.length > 0) {
            localStorage.setItem("recentTrack", state.track.uri) 
        }           
        document.body.style.paddingBottom = `${item.current.ref.current.offsetHeight} px`;   
    }}  
    uris={currentPlayUri} 
    components={{
        leftButton:<ShuffleBtn status={shuffleStatus} func={shuffle} />, 
        rightButton: <RepeatBtn status={repeatStatus} func={repeat} />
    }}
    styles={{
        activeColor: "var(--clr-primary)",
        trackNameColor: "white",
        trackArtistColor: "grey",
        color: "white",
        sliderColor: "white",
        bgColor: "black",
        sliderHandleColor: "white"
    }}
    />
}


export default Player