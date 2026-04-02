import { useContext } from 'react'
import { GroupContext } from '../context/GroupContext'

const useGroup = () => {
  const context = useContext(GroupContext)
  if (!context) {
    throw new Error('useGroup must be used within a GroupProvider')
  }
  return context
}

export default useGroup