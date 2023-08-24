import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import DisplaySideMenuContent from "./DisplaySideMenuContent"
import { getNextArtists, getNextItems, getShowsEpisodes, getSortedPlaylistTracks } from "../../utilityFunctions";

import likedSongsCover from "../../assets/images/likedsongs.jpg"
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";



const SideMenu = ({playlistClick, albumClick, showClick}: {playlistClick: Function, albumClick: Function, showClick: Function}) => {
    
    const token = useSelector((state: RootState) => state.authInfo.token)
    
    const [searchType, setSearchType] = useState("");
    const [searchKey, setSearchKey] = useState("")
    const [fullDisplay, setFullDisplay] = useState([])
    const [searchDisplay, setSearchDisplay] = useState({})
    const [currentDisplay, setCurrentDisplay] = useState([]);
    const [currentDisplayType, setCurrentDisplayType] = useState("");
    const [isClicked, setIsClicked] = useState(false);

    const testFunction = async () => {
        const shows = await getShows();
        let testShow = shows[1];

        // const {data} = await axios.get(`https://api.spotify.com/v1/shows/${testShow.id}/episodes?limit=20`, {
        //     headers: {
        //         Authorization: `Bearer ${token}`
        //     },            
        // })
        // console.log(data);

        console.log(testShow.id)
    }
    
    const getPlaylists = async () => {
        const {data} = await axios.get('https://api.spotify.com/v1/me/playlists?limit=50', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        let playlist = data.items;
       if(data.next != null) {
           playlist =  playlist.concat(await getNextItems(data.next));
       }
       playlist = playlist.filter((list: {tracks: {total: number}}) => list.tracks.total > 0)       
       playlist = playlist.map((list: {name: string, owner:{display_name: string}, images: {url:string}[], uri:string,id:string}) => {
            return  {
                name: list.name,     
                owner: list.owner.display_name,                    
                img: list.images.length > 1 ?  list.images[2].url
                   : list.images[0].url,                
                id: list.id,
                uri: list.uri,
             }
        });
       
        return playlist
    }

    const getAlbums = async () => {
        const {data} = await axios.get('https://api.spotify.com/v1/me/albums?limit=50', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
       let album = data.items;
       if(data.next != null) {
           album =  album.concat(await getNextItems(data.next));
       }
        album = album.filter((item: {album: {name: string}}) => item.album.name != "")
        album = album.map((list: {album: {name: string, owner:{display_name: string}, images: {url:string}[], uri:string,id:string, artists: {name: string}[]}}) => {
            return  {
                name: list.album.name,     
                owner: list.album.artists[0].name,                    
                img: list.album.images.length > 1 ?  list.album.images[2].url
                   : list.album.images[0].url,                
                id: list.album.id,
                uri: list.album.uri,
             }
        });
        
        return album
    }


    const getArtists = async () => {
        const {data} = await axios.get('https://api.spotify.com/v1/me/following?type=artist&limit=50', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        console.log(await data)
        
       let artists = data.artists.items;

       if(data.artists.next != null) {
           artists = artists.concat(await getNextArtists(data.artists.next));
           
        }        
        artists = artists.map((artist: {name: string,uri: string,id: string,images:{url: string}[], external_urls: {spotify: string}}) => {
            return  {
                name: artist.name, 
                img: artist.images.length > 1 ?  artist.images[2].url
                : artist.images[0].url,                
                id: artist.id,
                uri: artist.uri,
                link: artist.external_urls.spotify
            }
        });
        
        return artists        
    }

    const getShows = async () => {
        const {data} = await axios.get("https://api.spotify.com/v1/me/shows?limit=1", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        let shows = data.items;

        shows = shows.concat(await getNextItems(data.next));
        shows = shows.map((data: {show: {name: string,uri: string,id: string,images:{url: string}[], publisher:string, description: string, explicit: boolean}}) => {
            let show = data.show;
            return {
                name: show.name,     
                owner: show.publisher,                    
                img: show.images.length > 1 ?  show.images[2].url
                   : show.images[0].url,                
                id: show.id,
                uri: show.uri,
                description: show.description,
                isExplicit: show.explicit                
            }
        })

        return shows;
    }

    const clickPlaylistNavBtn = async () => {
        let playlists;
        
        if(localStorage.getItem("sidemenu_playlists") == null) {
          playlists = await getPlaylists();
          localStorage.setItem("sidemenu_playlists", JSON.stringify(playlists))
        } else {
          playlists =  JSON.parse(localStorage.getItem("sidemenu_playlists")!)
        }

        setCurrentDisplay(playlists);
        setFullDisplay(playlists);        
        
        setIsClicked(true);
        setCurrentDisplayType("playlist");
        setTimeout(async () => {
            let playlistsApi = await getPlaylists();      
            let playlistsStorage = JSON.parse(localStorage.getItem("sidemenu_playlists")!)
            if(playlistsApi.length != playlistsStorage.length) {
              localStorage.setItem("sidemenu_playlists", JSON.stringify(playlistsApi));
            }
        })
         
    }
    

    const clickAlbumNavBtn = async () => {
        let albums;
        
        if(localStorage.getItem("sidemenu_albums") == null) {
          albums = await getAlbums();
          localStorage.setItem("sidemenu_albums", JSON.stringify(albums))
        } else {
          albums =  JSON.parse(localStorage.getItem("sidemenu_albums")!)
        }

        setCurrentDisplay(albums);
        setFullDisplay(albums);        
        
        setIsClicked(true);
        setCurrentDisplayType("album");
        setTimeout(async () => {
            let albumsApi = await getAlbums();      
            let albumsStorage = JSON.parse(localStorage.getItem("sidemenu_albums")!)
            if(albumsApi.length != albumsStorage.length) {
              localStorage.setItem("sidemenu_albums", JSON.stringify(albumsApi));
            }
        })
    }

    const clickArtistsNavBtn = async () => {
        let artists;
        
        if(localStorage.getItem("sidemenu_artists") == null) {
          artists = await getArtists();
          localStorage.setItem("sidemenu_artists", JSON.stringify(artists))
        } else {
          artists =  JSON.parse(localStorage.getItem("sidemenu_artists")!)
        }

        setCurrentDisplay(artists);
        setFullDisplay(artists);        
        
        setIsClicked(true);
        setCurrentDisplayType("artist");
        setTimeout(async () => {
            let artistsApi = await getArtists();      
            let artistsStorage = JSON.parse(localStorage.getItem("sidemenu_artists")!)
            if(artistsApi.length != artistsStorage.length) {
              localStorage.setItem("sidemenu_artists", JSON.stringify(artistsApi));
            }
        })
    }

    const clickShowsNavBtn = async () => {
        let shows;
        
        if(localStorage.getItem("sidemenu_shows") == null) {
          shows = await getShows();
          localStorage.setItem("sidemenu_shows", JSON.stringify(shows))
        } else {
          shows =  JSON.parse(localStorage.getItem("sidemenu_shows")!)
        }

        setCurrentDisplay(shows);
        setFullDisplay(shows);        
        
        setIsClicked(true);
        setCurrentDisplayType("Podcast & Shows")
        setTimeout(async () => {
            let showsApi = await getShows();      
            let showsStorage = JSON.parse(localStorage.getItem("sidemenu_shows")!)
            if(showsApi.length != showsStorage.length) {
              localStorage.setItem("sidemenu_shows", JSON.stringify(showsApi));
            }
        })
    }

    const cancelClick = () => {
        setIsClicked(false);
        setCurrentDisplayType("")
    }

    useEffect(() => {
        let valid = new RegExp(`${searchKey.toLowerCase()}`)
        if(searchKey == "") {
            setCurrentDisplay(fullDisplay);
        } else { 
            setCurrentDisplay(fullDisplay.filter((item: {name:string, owner: string}) => {
                if(currentDisplayType != "artist") {
                    return (valid.test(item.name.toLowerCase()) == true || valid.test(item.owner.toLowerCase()) == true);
                } else {
                    return valid.test(item.name.toLowerCase()) == true
                }
            }))
        }
    }, [searchKey])


    const getSavedTracks = async () => {
        const {data} = await axios.get("https://api.spotify.com/v1/me/tracks?limit=50", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })   
        let tracks = data.items;
        if(data.next != null) {
            tracks = tracks.concat(await getNextItems(data.next));
        }
        tracks = getSortedPlaylistTracks(tracks);
        console.log(tracks)
        let uri = tracks.map((track: {uri:string}) => {
            return track.uri
        })
        let currUserName = await axios.get("https://api.spotify.com/v1/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        currUserName = currUserName.data.display_name;       
        return  {
            name: "Liked Songs",     
            owner: currUserName,                    
            img: likedSongsCover,                
            id: "savedtracks",  
            uri:  uri     
        }
    }
    
    const artistClick = (smh: string) => {
        console.log(smh)
    }
    
    return(
        <div className="side-menu">
            <div className="side-menu-top-nav">
                <Link to="/">
                    <div><svg style={{fill: "white"}} xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 -960 960 960" width="40"><path d="M226.666-186.666h140.001v-246.667h226.666v246.667h140.001v-380.001L480-756.667l-253.334 190v380.001ZM160-120v-480l320-240 320 240v480H526.667v-246.667h-93.334V-120H160Zm320-352Z"/></svg><h1>Home</h1></div>                
                </Link>
                <Link to="/search">
                    <div><svg style={{fill: "white"}} xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 -960 960 960" width="40"><path d="M792-120.667 532.667-380q-30 25.333-69.64 39.666Q423.388-326 378.667-326q-108.441 0-183.554-75.167Q120-476.333 120-583.333T195.167-765.5q75.166-75.167 182.5-75.167 107.333 0 182.166 75.167 74.834 75.167 74.834 182.267 0 43.233-14 82.9-14 39.666-40.667 73l260 258.667-48 47.999ZM378-392.666q79.167 0 134.583-55.834Q568-504.333 568-583.333q0-79.001-55.417-134.834Q457.167-774 378-774q-79.722 0-135.528 55.833t-55.806 134.834q0 79 55.806 134.833Q298.278-392.666 378-392.666Z"/></svg> <h1>Search</h1></div>                
                </Link>
            </div>            
            <div className="side-menu-content">                
                    <h1>Your Library</h1>    
                    <ul className="side-menu-content-nav">
                        {isClicked == false ? <><li onClick={clickPlaylistNavBtn}>Playlist</li>
                        <li onClick={clickShowsNavBtn}>Podcast & Shows</li>
                        <li onClick={clickAlbumNavBtn}>Albums</li>
                        <li onClick={clickArtistsNavBtn}>Artists</li></> 
                        :
                        <div style={{display: "flex", alignItems: "center", gap: ".5rem"}}>
                        <svg style={{fill: "var(--clr-bg-light)"}} onClick={cancelClick} xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 -960 960 960" width="30"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>
                        <li onClick={cancelClick} 
                            style={{
                                textTransform: "capitalize",
                                backgroundColor: "white",
                                color: "black",
                                opacity: "1"
                                }}>
                                {currentDisplayType}
                        </li>
                        </div> 
                        }
                    </ul>                       
                    {isClicked == false ? null : <div>
                        <input placeholder="Search in your library" type="text" onChange={(e) => {
                            setSearchKey(e.target.value)
                        }}/>                    
                    </div>}

                    {isClicked == false ? 
                    
                    null 
                    
                    :
                    <DisplaySideMenuContent 
                            functions={[playlistClick,albumClick,showClick,artistClick]} 
                            type={currentDisplayType} 
                            array={currentDisplay}
                        />}                    
            </div>           
        </div>
    )
}


export default SideMenu