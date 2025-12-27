import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { Outlet, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../utils';

const AppWrapper = () => {

  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const location = useLocation();

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    // Check if scrolled down or up
    if (currentScrollY > lastScrollY) {
      setVisible(false); // Hide on scroll down
    } else {
      setVisible(true); // Show on scroll up
    }

    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    setTimeout(()=>{
        window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
    },0)
  }, [location.pathname]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const fetchUsetData  = async()=>{
    const response = await axiosInstance.get("/user/secure/profile");
    if(response.data)
    {
      const {user} = response.data;
      sessionStorage.setItem("profile",JSON.stringify(user));
    }
    return response.data;
  }


  const {data} = useQuery({
     queryKey:["profile"],
     queryFn:fetchUsetData,
     enabled: !sessionStorage.getItem("profile") ? true : false
  })


  console.log(data)





  return (
    <section className='w-full max-w-[1800px] mx-auto'>
     <header
      className={`fixed top-0 left-0 w-full z-[9999]  bg-white transition-transform duration-300 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <Navbar/>
    </header>
     <section className='mt-[100px] w-full'>
     <Outlet/> 
     </section>
    </section>
  )
}

export default AppWrapper
