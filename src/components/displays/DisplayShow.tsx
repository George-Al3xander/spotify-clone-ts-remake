import React, { useEffect, useRef, useState } from "react";
import DisplayEpisode from "./DisplayChildrenEpisode";
import { getShowsEpisodes } from "../../utilityFunctions";
import loadingGif from "../../assets/images/loading.gif"
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { IEpisode, IUnsortedEpisode, playlistOrAlbumProps, sortedPlaylistTrack} from "../../types/types";
const DisplayShow = ({clickPlay, clickTrack}: playlistOrAlbumProps) => {   
    const show = useSelector((state:RootState) => state.currentStates.currentShow)
    const [offset, setOffset] = useState<Number>(show.total-1);
    const [episodes, setEpisodes] = useState(show.episodes); 
    const isLoading = useSelector((state: RootState) => state.statuses.isLoading)
    const token = useSelector((state: RootState) => state.authInfo.token)
    const displayEpisode = clickTrack
    useEffect(() => {
        setEpisodes(show.episodes)
        setOffset(show.total-1);
    },[show])
    const [episodeIsLoading,setEpisodeIsLoading] = useState(false);
   
    const firstItemRef = useRef<HTMLImageElement>(null);       
    const firstItem = firstItemRef.current;    
    const previousEpisodes = async () => {
        setEpisodeIsLoading(true)
        const {data} = await axios.get(episodes.previous, {
            headers: {
                  Authorization: `Bearer ${token}`
          },            
        })        
        let episodesPrev = data.items.map((episode: any) => {
          return {
            name: episode.name,                              
            img: episode.images.length > 1 ?  episode.images[1].url
            : episode.images[0].url,                
            id: episode.id,
            uri: episode.uri,
            data: episode.release_date,
            description: episode.description,
            isExplicit: episode.explicit,
            duration: episode.duration_ms
          }
        })
        
        setEpisodes({
            items: episodesPrev,
            next: data.next,
            previous: data.previous
        })  
        setOffset((prev) => Number(prev) + 20);
        setEpisodeIsLoading(false)         
        firstItem!.focus();  
    }

    const nextEpisodes = async () => {
        setEpisodeIsLoading(true)
        const {data} = await axios.get(episodes.next, {
            headers: {
                  Authorization: `Bearer ${token}`
          },            
        })        
        let episodesNext = data.items.map((episode: IUnsortedEpisode) => {
          return {
            name: episode.name,                              
            img: episode.images.length > 1 ?  episode.images[1].url
            : episode.images[0].url,                
            id: episode.id,
            uri: episode.uri,
            data: episode.release_date,
            description: episode.description,
            isExplicit: episode.explicit,
            duration: episode.duration_ms
          }
        })
        setOffset((prev) => Number(prev) - 20);
        setEpisodes({
            items: episodesNext,
            next: data.next,
            previous: data.previous
        }) 
        setEpisodeIsLoading(false)
        firstItem!.focus();  

    }
    
    
    return(
        isLoading == true ? 

        <div className="spinner"></div>
                : 
        <div className="list">
            <div className="list-top">
                <div className="list-top-img">
                <img src={show.img} alt="" />    
                </div>  
                <div className="list-top-titles">
                    <h2>Show</h2>
                    <h1>{show.name}</h1>                    
                    <div className="list-top-main-info">
                       <h2>{typeof show.owner == "object" ? show.owner : show.owner.display_name}</h2> 
                    </div>
                </div>    
            </div>
            <div className="show-description">
                <h1>About</h1>
                <p>{show.description}</p>
            </div>

            <div>
                {episodes.previous != null ? 
                <button className="btn-episode" onClick={previousEpisodes}>Previous episodes</button>
                :
                null
                }
                {episodeIsLoading ?
                <div className="spinner"></div>
                :
                
                episodes.items.map((episode) => {
                    return <DisplayEpisode 
                          episode={episode}                          
                          firstItemRef={firstItemRef}
                          clickPlay={clickPlay}
                          showUri={show.uri}                          
                          displayEpisode={displayEpisode}
                          offset={offset}
                          index={episodes.items.indexOf(episode)}
                    />
                })
                }
                {episodes.next != null ? 
                <button className="btn-episode" onClick={nextEpisodes}>Next episodes</button>
                :
                null
                }
            </div>
        </div>
    )
}


export default DisplayShow