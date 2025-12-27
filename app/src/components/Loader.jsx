import { Loader2 } from 'lucide-react'
import React from 'react'

const Loader = ({className=""}) => {
  return (
    <Loader2 size={16} className={'animate-spin duration-1000 ease-in-out ms-2 '+className}/>
  )
}

export default Loader
