import { useRef } from "react";
let redirect_uri = "http://192.168.0.111:3000"
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=a104992a9a514f2cb04a886f8570f16e&response_type=code&redirect_uri=${redirect_uri}&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20playlist-read-private%20playlist-read-collaborative%20playlist-modify-private%20playlist-modify-public%20user-follow-read`


 const Login = () => {
    const item = useRef<HTMLAnchorElement>(null);
    return (
        <div className="login">
            <div>
                <h1>Welcome to <span>Clonify</span></h1>
                <a ref={item} onMouseEnter={() => {
                    if(item.current) {
                        item.current.innerHTML = "Functionality is restricted to premium users only"
                    }
                }} 
                onMouseLeave={() => {
                    if(item.current) {
                        item.current.innerHTML = "Click to login to your Spotify accout!"
                    }
                }}
                 href={AUTH_URL}>Click to login to your Spotify accout!</a>
            </div>  
        </div>
    )
}


export default Login