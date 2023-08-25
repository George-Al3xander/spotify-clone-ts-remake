import React from "react";
import DisplaySideMenuItem from "./DisplaySideMenuItem";
import { sideMenuContentProps } from "../../types/types";


const DisplaySideMenuContent = ({type, array,  functions}: sideMenuContentProps) => {    
    let func: Function;
    if(type == "playlist") {
        func = functions[0]
    }
    else if(type == "album") {
        func = functions[1]
    }
    else if(type == "Podcast & Shows") {
        func = functions[2]
    }
   
    return(
    <ul className="side-menu-content-results">
        {array.map((item) => {
            return <DisplaySideMenuItem 
                func={func}
                type={type} 
                item={item}                        
            />
        })}
        
    </ul>
    )
}


export default DisplaySideMenuContent