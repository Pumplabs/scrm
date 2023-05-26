import { useNavigate } from 'react-router-dom'
import { useGetEntry } from 'src/hooks/wxhook'

export default () => {
  const naviagte = useNavigate()
  const { pageEntry } = useGetEntry()
  if (pageEntry === 'single_chat_tools') {
    naviagte('/customerDetail')
  } else if (pageEntry === 'group_chat_tools') {
    naviagte('/groupDetail')
  }
  return null
}