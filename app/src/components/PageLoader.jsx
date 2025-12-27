import { Loader2 } from 'lucide-react'
import React from 'react'

const PageLoader = () => {
  return (
    <section className='w-full flex justify-center items-center h-[60vh]'>
      
       <Loader2 size={25} className='animate-spin duration-1000 ease-in-out text-orange-600'/>

    </section>
  )
}

export default PageLoader
