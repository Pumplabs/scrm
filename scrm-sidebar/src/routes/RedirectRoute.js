import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const RedirectRoute = () => {
  const naviagte = useNavigate()
  useEffect(() => {
  naviagte('/home')
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [])
 
 return null
}
export default RedirectRoute