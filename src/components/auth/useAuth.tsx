import { useState, useEffect } from "react"
import axios from "axios"


export default function useAuth(code: string) {
  const [accessToken, setAccessToken] = useState("")
  const [refreshToken, setRefreshToken] = useState("")
  const [expiresIn, setExpiresIn] = useState(0)
  const apiLink = "http://192.168.0.111:5000"
  useEffect(() => {
    axios
      .post(`${apiLink}/login`, {
        code,
      })
      .then(res => {
        setAccessToken(res.data.accessToken)
        setRefreshToken(res.data.refreshToken)
        setExpiresIn(res.data.expiresIn)
        window.history.pushState({}, "", "/")
      })
      .catch((err) => {
        window.location.href = "/"
        //console.log(err)
      })
  }, [code])

  useEffect(() => {
    if (!refreshToken || !expiresIn) return
    const interval = setInterval(() => {
      axios
        .post(`${apiLink}/refresh`, {
          refreshToken,
        })
        .then(res => {
          setAccessToken(res.data.accessToken)
          setExpiresIn(res.data.expiresIn)
        })
        .catch((err) => {
          window.location.href = "/"
          //console.log(err)
        })
    }, (expiresIn - 60) * 1000)

    return () => clearInterval(interval)
  }, [refreshToken, expiresIn])

  return accessToken
}