import React, { useEffect, useRef, useState } from "react";
import axios from 'axios';
import { Route, Routes , useNavigate} from "react-router-dom";
import useAuth from "../auth/useAuth";
import SideMenu from "../sideMenu/SideMenu";
import Home from "./Home";
// import  Search  from "../search/Search";
import Player from "./Player";
import {getPlaylistTracks, msToTime, getAlbumTracks, getShowsEpisodes } from "../../utilityFunctions";
import Search from "../search/Search";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import DisplayPlaylist from "../displays/DisplayPlaylist";
 import { spotifyApi } from "react-spotify-web-playback";
import DisplayAlbum from "../displays/DisplayAlbum";
import DisplayShow from "../displays/DisplayShow";
import DisplayParentEpisode from "../displays/DisplayParentEpisode";
import Header from "./Header";
import { setToken, setCurrentUser } from "../../redux/slices/authInfo";
import { changeClickStatus, changeLoadingStatus, changeShuffleStatus, setOffset, setRepeatStatus } from "../../redux/slices/statuses";
import { setCurrentAlbum, setCurrentDisplayEpisode, setCurrentEpisode, setCurrentPlayUri, setCurrentPlaylist, setCurrentShow } from "../../redux/slices/currentStates";
import { IEpisode, SortedAlbum, SortedPlaylist, SortedShow, episodesType } from "../../types/types";


const Dashboard = ({code, setCode}: {code: string, setCode: React.Dispatch<React.SetStateAction<string |  null>>}) => { 
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.authInfo.token);
  const currentUser = useSelector((state: RootState) => state.authInfo.currentUser); 
  const {currentAlbum, currentDisplayEpisode, currentEpisode, currentPlayUri, currentPlaylist, currentSearch, currentShow, currentTrack, currentDevice} = useSelector((state: RootState) => state.currentStates)
  const {clickStatus, repeatStatus} = useSelector((state: RootState) => state.statuses)
  const repeatTypes = ['off', 'context', 'track' ]
  const navigate = useNavigate();
  dispatch(setToken({token: useAuth(code)}));

 // const[currentTrack, setCurrentTrack] = useState("");
  // const [currentPlayUri, setCurrentPlayUri] = useState(
  //   localStorage.getItem("recentTrack") != null ? localStorage.getItem("recentTrack") : setRecentTrack());   
  // const [currentPlaylist, setCurrentPlaylist] = useState({});  
  // const [currentAlbum, setCurrentAlbum] = useState({});  
  // const [currentShow, setCurrentShow] = useState({});  
  // const [currentDisplayEpisode, setCurrentDisplayEpisode] = useState({});  
  // const [currentSearch, setCurrentSearch] = useState({});  
  // const [currentEpisode, setCurrentEpisode] = useState("");
  // const [currentDevice, setCurrentDevice] = useState("");
  

  // const [clickStatus, setClickStatus] = useState(false); 
  // const [shuffleStatus, setShuffleStatus] = useState(false);
  // const [repeatStatus, setRepeatStatus] = useState(0);
  // const [offset, setOffset] = useState(0);
  // const [isLoading, setIsLoading] = useState(false);
  const setUser = async () => {
    const {data} = await axios.get(`https://api.spotify.com/v1/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      },        
    }); 
    dispatch(setCurrentUser({currentUser: {
      name: data.display_name,
      link: data.external_urls.spotify,
      img: data.images[0].url,
      id: data.id,
      uri: data.uri
    }}))       
  }
  useEffect(() => {     
    if(currentUser.id.length == 0 && token.length > 0) {
      setUser();    
    } 
  }, [token])


  
 

  // const testFunction = async () => { 
  //   const {data} = await axios.get(`https://api.spotify.com/v1/me`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         },        
  //       });

  //     console.log(data)
  // } 
  
  const displayAlbum = async (id:string) : Promise<void> => {
    dispatch(changeLoadingStatus())
    navigate("/album");    
    let album;
      if(localStorage.getItem(id) == null) {
        album = await getAlbum(id);
          localStorage.setItem(id, JSON.stringify(album))
      } else {
        album = JSON.parse(localStorage.getItem(id)!)
      }
      dispatch(setCurrentAlbum({currentAlbum: album}))
      dispatch(changeLoadingStatus())
  }

  const displayPlaylist = async (id:string) : Promise<void> => {  
    dispatch(changeLoadingStatus())
    navigate("/playlist"); 
    let playlist: SortedPlaylist; 
    if(localStorage.getItem(id) == null) {
      playlist = await getPlaylist(id);
      localStorage.setItem(id, JSON.stringify(playlist))
    } else {
      playlist =  JSON.parse(localStorage.getItem(id)!)
    }    
   
    dispatch(setCurrentPlaylist({currentPlaylist: playlist}))
    dispatch(changeLoadingStatus())
    setTimeout(async () => {
      let playlistApi = await getPlaylist(id);      
      let playlistStorage = JSON.parse(localStorage.getItem(id)!);
      if(playlistApi.tracks.length != playlistStorage.tracks.length) {
        localStorage.setItem(id, JSON.stringify(playlistApi)); 
        dispatch(setCurrentPlaylist({currentPlaylist: playlistApi}))      
      }
    })
  }

  const displayShow =async (id:string) : Promise<void> => {
    dispatch(changeLoadingStatus())
    navigate("/show");

    let show;
    if(localStorage.getItem(id) == null) {
      show = await getShow(id);
      localStorage.setItem(id, JSON.stringify(show))
    } else {
      show =  JSON.parse(localStorage.getItem(id)!)
    }
    dispatch(setCurrentShow({currentShow: show}))

    setTimeout(async () => {
      let showApi = await getShow(id);      
      let showStorage = JSON.parse(localStorage.getItem(id)!);
     
      if(showApi.total != showStorage.total) {
        localStorage.setItem(id, JSON.stringify(showApi)); 
        dispatch(setCurrentShow({currentShow: showApi}))   
      }
    },1)
    dispatch(changeLoadingStatus())    
  }

  const displayEpisode = async (id:string) : Promise<void> => {
    dispatch(changeLoadingStatus());
    navigate("/episode");
    let episode;

    if(localStorage.getItem(id) == null) {
      episode = await getEpisode(id);
      localStorage.setItem(id, JSON.stringify(episode))
    } else {
      episode =  JSON.parse(localStorage.getItem(id)!)
    }
    console.log(episode)
    dispatch(setCurrentDisplayEpisode({currentDisplayEpisode: episode}))
    dispatch(changeLoadingStatus());   
  }
 
    const getPlaylist =async (id:string) : Promise<SortedPlaylist> => {       
      let verySmall = "0J0osxjpvQiNkRxiF9CWI4"      
      let small  = "16rriBgSVvBmlMFw9gwYP0"      
      let big = "0xtweFcEO3q0LtNyahzkZN"                       
      const {data} = await axios.get(`https://api.spotify.com/v1/playlists/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },        
      }); 
      let tracks = await  getPlaylistTracks(token,data.tracks);      
      let duration = msToTime(tracks);   
      let isFollowedRes = await axios.get(`https://api.spotify.com/v1/playlists/${data.id}/followers/contains?ids=${currentUser.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },        
      });
      let isFollowed = isFollowedRes.data[0]
      return {
        tracks,
        name: data.name,
        description: data.description,
        followers: data.followers.total,
        owner: {
            display_name: data.owner.display_name,
            urls: data.owner.external_urls,
            id: data.owner.id
        },
        id: data.id,
        uri: data.uri,
        img: data.images.length > 1 ? data.images[1].url : data.images[0].url,        
        duration: duration,
        isPublic: data.public,
        date: data.realease_date,
        isFollowed
      }
    }
   
    const getAlbum =async (id:string) : Promise<SortedAlbum> => { 
      const {data} = await axios.get(`https://api.spotify.com/v1/albums/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },        
      });      
      let tracks = await getAlbumTracks(token, data.tracks.items);
      let duration = msToTime(tracks);     

      return {
        artists: data.artists,
        id: data.id,
        uri: data.uri,
        img:  data.images[1].url,
        duration,
        tracks,
        name: data.name,
        date: data.release_date
      }
    }

    const getShow =async (id:string) : Promise<SortedShow> => {
        const {data} = await axios.get(`https://api.spotify.com/v1/shows/${id}` , {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })   
        
        let episodes = await getShowsEpisodes(token, data.id)        
        let show = {
                name: data.name,     
                owner: data.publisher,                    
                img: data.images.length > 1 ?  data.images[1].url
                   : data.images[0].url,                
                id: data.id,
                uri: data.uri,
                description: data.description,
                isExplicit: data.explicit,
                episodes,
                total: data.total_episodes
        }        
        return show
    }

    const getEpisode =async (id:string) : Promise<IEpisode> => {
      const {data} = await axios.get(`https://api.spotify.com/v1/episodes/${id}` , {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      
      return {
        name: data.name,                              
        img: data.images.length > 1 ?  data.images[1].url
        : data.images[0].url,                
        id: data.id,
        uri: data.uri,
        date: data.release_date,
        description: data.description,
        isExplicit: data.explicit,
        duration: data.duration_ms,  
        podcast: {
          name: data.show.name,
          id: data.show.id,
          uri: data.show.uri,
          total: data.show.total_episodes
        }      
      }
    }
   
    const clickTrack = async  (trackUri: string, thisListUri: string,num: number) : Promise<void> => { 
      if(currentTrack == trackUri && currentPlayUri == thisListUri) {
        if(clickStatus == false) {
            dispatch(changeClickStatus({clickStatus: true}))
        } else {
          dispatch(changeClickStatus({clickStatus: false}))
        }
      }
      else if (currentTrack != trackUri && currentPlayUri == thisListUri) {           
          await spotifyApi.play(token, {
              context_uri: currentPlayUri,
              deviceId: currentDevice,
              offset: num,
              uris: currentPlayUri
              })           
      }
      else {
          dispatch(setCurrentPlayUri({currentPlayUri: thisListUri}))
          dispatch(setOffset({offset: num}))
          dispatch(changeClickStatus({clickStatus: true}))
      }
    }

    const clickListPlay = (uri: string) => {
      if(currentPlaylist.uri != uri) {
        dispatch(setCurrentPlayUri({currentPlayUri: uri}))
        dispatch(setOffset({offset: 0}))
      }
      dispatch(changeClickStatus({clickStatus: true}))
    }

    const clickEpisodePlay = async (episodeUri: string,showUri: string, num:number) => {
      if(currentEpisode == episodeUri) {
            if(clickStatus == false) {
              dispatch(changeClickStatus({clickStatus: true}))

            } else {
              dispatch(changeClickStatus({clickStatus: false}))
            }
      } else {
          spotifyApi.play(token, {
            context_uri: showUri,
            deviceId: currentDevice,
            offset: num,
            uris: showUri
          })      
      }
      dispatch(setCurrentPlayUri({currentPlayUri: showUri}));
      dispatch(setCurrentEpisode({currentEpisode: episodeUri}));
    } 

    const shuffle = () => {
        dispatch(changeShuffleStatus())
        spotifyApi.shuffle(token,true, currentDevice);
    }
  
    const repeat = () => {
      if(repeatStatus + 1 > 2) {
        dispatch(setRepeatStatus({repeatStatus: 0}));        
      } else {
        dispatch(setRepeatStatus({repeatStatus: repeatStatus + 1}));       
      }
    }
    useEffect(()=> {
      const doThis = async() => {
        await spotifyApi.repeat(token,repeatTypes[repeatStatus],currentDevice);
      }
      doThis();
    },[repeatStatus]);

    const getEpisodeOffset = async (episodeId: string, data: {items:{id:string}[],next: string}, total: number) : Promise<number> => {      
      for(let i = 0; i < data.items.length; i++) {
        if(episodeId != data.items[i].id) {
          total = total - 1;
        }
        else {          
          return total         
        }
      }
      if(data.next != null) {        
        let nextRes = await axios.get(data.next, {
        headers: {
            Authorization: `Bearer ${token}`
        },            
        });
        let next = nextRes.data;
        return await getEpisodeOffset(episodeId, next, total);
      } 
      return total
    }


    const clickParentEpisodePlay = async (episode: IEpisode) => {
      if(currentEpisode == episode.uri) {
            if(clickStatus == false) {
              dispatch(changeClickStatus({clickStatus: true}))
            } else {
              dispatch(changeClickStatus({clickStatus: false}))
            }
      }
      else {
        let podcast = episode.podcast;
        let total =  episode.podcast.total-1;
        dispatch(changeLoadingStatus())

        let id = podcast.id;
        const {data} = await axios.get(`https://api.spotify.com/v1/shows/${id}/episodes?limit=50`, {
          headers: {
              Authorization: `Bearer ${token}`
          },            
        });
        let num = await getEpisodeOffset(episode.id, data, total);
        spotifyApi.play(token, {
          context_uri: podcast.uri,
          deviceId: currentDevice,
          offset: num,
          uris: podcast.uri
        });    
        dispatch(setCurrentPlayUri({currentPlayUri: podcast.uri}));
        dispatch(setOffset({offset: num}));
        dispatch(changeClickStatus({clickStatus: true}))
        dispatch(changeLoadingStatus())

      
      }
      dispatch(setCurrentEpisode({currentEpisode: episode.uri}))      
    }

    const logout = async() => {
      const url = 'https://www.spotify.com/logout'
      const spotifyLogoutWindow = window.open(url, 'Spotify Logout', 'width=700,height=500,top=40,left=40')                
      setTimeout(() => spotifyLogoutWindow!.close(), 2000)
      setCode(null)
    }
    
    return (
      <> 
      <main className="container">
        {currentUser.id.length > 0 ?
        <>
          <SideMenu             
            playlistClick={displayPlaylist} 
            albumClick={displayAlbum}
            showClick={displayShow}            
          />          
        </>
        :
        null
        }
        <div className="content">
          {currentUser.id.length > 0 ?
          <Header logout={logout}/>         
          :
          null
          } 
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/playlist"  
            element={<DisplayPlaylist 
                         clickPlay={clickListPlay} 
                         clickTrack={clickTrack} 
             />}/>
             <Route path="/album" 
             element={<DisplayAlbum 
              clickPlay={clickListPlay}
              clickTrack={clickTrack} 
              />}/>
            <Route path="/show" 
            element={<DisplayShow 
              clickTrack={displayEpisode}               
              clickPlay={clickEpisodePlay}     
              />}/>
            <Route path="/episode" 
            element={<DisplayParentEpisode 
             
              
              clickPlay = {clickParentEpisodePlay}
              displayShow={displayShow}
            
              />}            
            />
             
            <Route path="/search"  
            element={<Search 
                         
                          displayAlbum={displayAlbum}
                          displayPlaylist={displayPlaylist}
                          displayShow={displayShow}
                          displayEpisode={displayEpisode}
                          clickTrack={(trackUri: string) => {
                            if(currentTrack == trackUri) {
                              if(clickStatus == false) {
                                dispatch(changeClickStatus({clickStatus: true}));
                              } else {
                                dispatch(changeClickStatus({clickStatus : false}));
                              }
                            } else {
                              dispatch(setCurrentPlayUri({currentPlayUri: trackUri}))
                              dispatch(setOffset({offset: 0}))
                              dispatch(changeClickStatus({clickStatus:true}));
                            }
                          }}
            />}/>
        
          </Routes>          
        </div>
      </main>
        
        <div className="player">
          <Player 
              shuffle={shuffle}               
              repeat={repeat}
              token={token}    
            />
        </div>
      </>
    )
}

export default Dashboard;