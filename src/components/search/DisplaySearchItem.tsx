import React from "react";
import { displayEpisodeDate } from "../../utilityFunctions";
import moment from "moment";
import { IArtists } from "../../types/types";

const DisplaySearchItem = ({item, type, func}: {item: any, type: string, func: Function}) => {    
    return(
        <div onClick={() => {
            if(type != "artists") {
                func(item.id);
            } else {
                func(item.link);                
            }
        }} className={"search-item"}
            id={item.id}
        >
            <div>
            {type == "artists" ? <img  style={{borderRadius: "50%", aspectRatio: "1 / 1"}}  src={item.img} alt="" /> : <img  src={item.img} alt="" />}
            </div> 
            <h1>{item.name}</h1>

            <h2>
            {type == "albums" ? 
            
            item.owner.map((artist: IArtists) => {
                return <>
                    <a href={artist.external_urls.spotify}>{artist.name}</a> {item.owner.indexOf(artist) != item.owner.length-1 ? ", " : null}
                    </>
                })             
                
            :

            <div>{item.owner}</div>
            
            }
            </h2>  
            {type == "episodes" ? 
            <h3>{displayEpisodeDate(item.date)} · {Math.floor(moment.duration(item.duration).asMinutes()) + " min"}</h3>
            :
            null
            }         
        </div>
    )
}

export default DisplaySearchItem