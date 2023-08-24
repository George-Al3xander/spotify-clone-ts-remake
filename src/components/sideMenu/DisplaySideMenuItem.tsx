import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";


const DisplaySideMenuItem = ({type, item,func}: {type: string, item: {id: string, link: string, img: string, name: string, owner: string, uri: string}, func: Function}) => {    
    const {currentPlayUri} = useSelector((state: RootState) => state.currentStates)
    const clickStatus = useSelector((state: RootState) => state.statuses.clickStatus)

    const itemLi = useRef<HTMLLIElement>(null);    
    return <li  key={item.id} 
                ref={itemLi}
                onDoubleClick={async () => {
                    await func(item.id);
                }} 
                onClick={async () => {
                    if(type != "artist") {
                        await func(item.id);
                    }
                    else {
                        window.open(item.link)
                    }
                }} 
                id={item.id}>
                {type == "artist" ? <img  style={{borderRadius: "50%", aspectRatio: "1 / 1"}}  src={item.img} alt="" /> : <img  src={item.img} alt="" />}
                <div>
                    {(item.uri == currentPlayUri && clickStatus == true) ? 

                    <h2 style={{color: "green"}}>{item.name}</h2>
                    : 
                    
                    <h2>{item.name}</h2>
                    }
                    {type == "artist" ? null : <h3>{item.owner}</h3>}
                </div>
            </li>
}

export default DisplaySideMenuItem