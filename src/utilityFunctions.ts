import moment from "moment"
import axios from "axios";
import { unSortedTrack, sortedPlaylistTrack, episode, episodesType } from "./types/types";




export function msToTime(tracks: {duration: number}[]) {
    let duration = tracks.reduce((prev,curr) => {                 
        return  prev + curr.duration            
      }, 0);        
              
      let seconds = Math.floor((duration / 1000) % 60);
      let minutes = Math.floor((duration / (1000 * 60)) % 60);
      let hours;
      //Check if length greater than 24, because results might be different
      let tempHours = Math.floor(duration * .27777777777778 * 0.000001);
      tempHours <= 24 ? hours = Math.floor((duration / (1000 * 60 * 60)) % 24) : hours =  Math.floor(duration * .27777777777778 * 0.000001);
      
      if(hours == 0) {
          return `${minutes} min ${seconds} sec`          
      } else {
          return `${hours} hr ${minutes} min`          
      } 
}

export function getSortedPlaylistTracks(tracks: any[]
  //{track: unSortedTrack, added_at: Date}[]
  ) : sortedPlaylistTrack[] {
    let sortedTracks = tracks.filter((obj) => obj.track != null && obj.track.name != "");

    const result = sortedTracks.map((song) => {                  
        return  {
            name: song.track.name,
            uri: song.track.uri, 
            id: song.track.id, 
            isExplicit: song.track.explicit, 
            img: song.track.album.images.length > 1 ? 
                song.track.album.images[2].url 
                : 
                song.track.album.images[0].url,
            album: {
                name: song.track.album.name,
                uri: song.track.album.uri,
            },
            duration: song.track.duration_ms,
            artists: song.track.album.artists,
            date: song.added_at,
        }
    })
    //console.log(result)
    return result
}

export async function getNextItems(token:string, apiId: string) :  Promise<[]>{ 
  const {data} = await axios.get(apiId, {
    headers: {
      Authorization: `Bearer ${token}`
    },        
  })
       
  if(data.next != null) {         
      return  data.items.concat(await getNextItems(token, data.next));         
  }  else {
      return  data.items
  }      
}

export async function getNextArtists(token: string,apiId: string) : Promise<[]> {
  const {data} = await axios.get(apiId, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })              
       if(data.artists.next != null) {
            return data.artists.items.concat(await  getNextArtists(token, data.artists.next));
        } else {
            return data.artists.items;
        }
}

export async function getFollowedStatus(token: string, tracks: sortedPlaylistTrack[]) { 
  let res: sortedPlaylistTrack[] = [];
  let result: boolean[] | sortedPlaylistTrack[] = []
  let allTracksId = tracks.map((track) => {
    return track.id
  });       
 
  if(tracks.length > 50) {

    let fullCycles = Math.floor(tracks.length / 50);
    let howMuchLeft = Math.floor(tracks.length % 50);
    
    
    let arrMaxStart: number = 0;
    let arrMaxEnd: number = 0;
    for(let i = 0; i < fullCycles; i++) {
      let arrEnd = 50 * (i + 1);
      let arrStart = Math.abs(arrEnd - 50);
      let arr = allTracksId.slice(arrStart, arrEnd); 
      const {data} = await axios.get("https://api.spotify.com/v1/me/tracks/contains", {
        headers: {
          Authorization: `Bearer ${token}`
        },   
        params: {
          ids: arr.toString()
        }             
        });
        
      if(i == fullCycles-1) {
        arrMaxStart = arrEnd;
      }     
      result = res.concat(data);
      
    }

    if(tracks.length % 50 != 0) {
      arrMaxEnd = arrMaxStart + howMuchLeft;
      let arr = allTracksId.slice(arrMaxStart, arrMaxEnd);      
      let isFollowed = await axios.get("https://api.spotify.com/v1/me/tracks/contains", {
      headers: {
      Authorization: `Bearer ${token}`
      },   
      params: {
      ids: arr.toString()
      }             
      });
      const data = isFollowed.data;

      result = res.concat(data);
      }  
  } 
  
  else {
    //console.log(tracks)

    //console.log(allTracksId)
    let isFollowed = await axios.get("https://api.spotify.com/v1/me/tracks/contains", {
    headers: {
      Authorization: `Bearer ${token}`
    },   
    params: {
      ids: allTracksId.toString()
    }             
    });
    result = isFollowed.data;
    
  }  
  return result
}

export async function getPlaylistTracks(token:string, dataTracks: {items: [],next: string | null}) {
  //dataTracks = data.tracks
  let tracks: sortedPlaylistTrack[] =  dataTracks.items; 
  let result = []; 
  let next:  string | null = dataTracks.next;
    if(next != null) {        
      result = [...tracks].concat(await getNextItems(token, next));
    }  
    result = await getSortedPlaylistTracks(tracks);
    console.log(result)
      
    let isFollowedList = await getFollowedStatus(token, result);    
        
    let y = 0;
    let finRes:{ isFollowed: boolean | sortedPlaylistTrack; isExplicit: boolean; img: string; album: { name: string; uri: string; }; duration: number; artists: []; date: Date | string; name: string; uri: string; id: string; }[] = [];
    for(let x = 0; x < result.length; x++) {
        finRes.push({...result[x], isFollowed: isFollowedList[y]}) 
        y++;
    }
    return result
}

export async function getAlbumTracks(token:string,tracks: unSortedTrack[]) {  
    let finRes : any[] = [];
    let sortedTracks =  tracks.map((track) => {
      return {
        name: track.name,
        artists: track.artists,
        duration: track.duration_ms,
        isExplicit: track.explicit,
        id: track.id,
        uri: track.uri
        }
    });
    let allTracksId = sortedTracks.map((track) => {
      return track.id
    }); 

    if(sortedTracks.length > 50) {
      let fullCycles = Math.floor(sortedTracks.length / 50);
      let howMuchLeft = Math.floor(sortedTracks.length % 50);
      let arrMaxStart = 0;
      let arrMaxEnd = 0;
      for(let i = 0; i < fullCycles; i++) {
        let arrEnd = 50 * (i + 1);
        let arrStart = Math.abs(arrEnd - 50);
        let arr = allTracksId.slice(arrStart, arrEnd);
        const {data} = await axios.get("https://api.spotify.com/v1/me/tracks/contains", {
        headers: {
          Authorization: `Bearer ${token}`
        },   
        params: {
          ids: arr.toString()
        }             
        });    
        let y = 0;      
        for(let x = arrStart; x < arrEnd; x++) {           
            finRes.push({...sortedTracks[x], isFollowed: data[y]}) 
            y++;
        }   
        if(i == fullCycles-1) {
          arrMaxStart = arrEnd;
        }     
      }
      arrMaxEnd = arrMaxStart + howMuchLeft;
      let arr = allTracksId.slice(arrMaxStart, arrMaxEnd);
      
      let isFollowed = await axios.get("https://api.spotify.com/v1/me/tracks/contains", {
      headers: {
        Authorization: `Bearer ${token}`
      },   
      params: {
        ids: arr.toString()
      }             
      });
      let data = isFollowed.data;

      let y = 0;        
      for(let x = arrMaxStart; x < arrMaxEnd; x++) {
          finRes.push({...sortedTracks[x], isFollowed: data[y]}) 
          y++;
      }   
    } else {
      let isFollowed = await axios.get("https://api.spotify.com/v1/me/tracks/contains", {
      headers: {
        Authorization: `Bearer ${token}`
      },   
      params: {
        ids: allTracksId.toString()
      }             
      });
      let data = isFollowed.data;
      let y = 0;        
      for(let x = 0; x < sortedTracks.length; x++) {
          finRes.push({...sortedTracks[x], isFollowed: data[y]}) 

          y++;
      }
    }  

    return finRes
}



export async function getShowsEpisodes(token:string, id: string) : Promise<episodesType> {
  const {data} = await axios.get(`https://api.spotify.com/v1/shows/${id}/episodes?limit=20`, {
      headers: {
            Authorization: `Bearer ${token}`
    },            
  });
  let podcast = await axios.get(`https://api.spotify.com/v1/shows/${id}`, {
    headers: {
          Authorization: `Bearer ${token}`
  },            
  });  
  let total = podcast.data.total_episodes;
  podcast = podcast.data.name  
  let episodes = data.items.map((episode: episode) => {       
    return {
      name: episode.name,                              
      img: episode.images.length > 1 ?  episode.images[1].url
      : episode.images[0].url,                
      id: episode.id,
      uri: episode.uri,
      date: episode.release_date,
      description: episode.description,
      isExplicit: episode.explicit,
      duration: episode.duration_ms, 
      podcast: podcast,
      podcast_total: total
    }
  })
  
  return {
    items: episodes,
    next: data.next,
    previous: data.previous
  }
  
}

export function getDateSorted(time: Date | string) {   
    let today = new Date();
    let trackDate = new Date(time);
    let todayDay = today.getDate();
    let trackDateDay = trackDate.getDate();
    let todayYear = today.getFullYear()
    let trackDateYear = trackDate.getFullYear();
    let differ = Math.abs(trackDateDay - todayDay);
    let res;
    if(trackDateYear == todayYear && differ  <= 31) {
        if(differ <= 7) {
          res = "1 week ago"
        }            
        else if(differ <= 14 && differ > 7) {
           res = "2 week ago"
        } 
        else if(differ <= 21 && differ > 14) {
          res = "3 week ago"
        } 

        else if(differ <= 31 && differ > 21) {
          res = "4 week ago"
        }
        else {
          res = moment(time).fromNow()
        }
    }

    else {
        res = moment(time).format("MMM D, YYYY");
    }  

    return res
}

export function displayTrackDuration(millis: number): string {
  let minutes: number = Math.floor(millis / 60000);
  let seconds: number = +((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function padTo2Digits(num: number) : string {
  return num.toString().padStart(2, '0');
}

export function displayEpisodeDuration(millis: number): string {
  let seconds = Math.floor(millis / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = minutes % 60;

  hours = hours % 24;

  return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(
    seconds,
  )}`;
}

export function displayEpisodeDate (date: Date) {
    let today = new Date();
    let episodeDate = new Date(date);    
    if(episodeDate.getFullYear() != today.getFullYear()) {
        return moment(date).format("MMM, YYYY")
    }
    else {
        return moment(date).format("MMM, D")
    }

}

function editDistance(s1: string, s2: string): number {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

export function similarity(s1: string, s2: string) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength:  number = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength.toString());
}





