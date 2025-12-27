import React, { useState } from "react";;
import { Link, useLocation, useNavigate } from "react-router-dom";
import { menuData } from "../data/MenuItem";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const MenuItem = ({ className = "" }) => {
  const location = useLocation();
  const menuActiveBg ="bg-orange-600 text-white  ";


   const [openModal , setOpenModal] = useState(false);

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("token") ? true : false;  

  const handleLogoutClick =()=>{
     sessionStorage.removeItem("profile");
     localStorage.removeItem("token");
     queryClient.clear();
     toast.success("Logged Out Successfully");
     setTimeout(()=>{
        navigate("/")
     },300)
     setOpenModal(false)

  }


  return (
    <>
      <article
      className={`flex justify-end items-center gap-3 font-outfit ${className}`}
      
    >
      {menuData.map((menuItem, idx) => {
        
        if(!menuItem.secure)
        {
          return (
            <div
              
              key={idx}
            >
              <Link
                key={menuItem.key}
                className={`px-2 py-1 rounded-xl flex  justify-center items-center gap-1 shadow-md duration-300 transition-all   ${
                  location.pathname === menuItem.path && menuActiveBg
                } `}
                to={menuItem.path}
              >
                <menuItem.icon size={15} />
                {menuItem.label}
              </Link>
            </div>
          );
        }else{

         return isLoggedIn ?  (
            <div
              
              key={idx}
            >
              <Link
                key={menuItem.key}
                className={`px-2 py-1 rounded-xl flex  justify-center items-center gap-1 shadow-md duration-300 transition-all   ${
                  location.pathname === menuItem.path && menuActiveBg
                } `}
                to={menuItem.path}
              >
                <menuItem.icon size={15} />
                {menuItem.label}
              </Link>
            </div>
          ) : <></>
        }
        
      })}
      {
        !isLoggedIn ? <div
            
        key={"signin"}
      >
        <Link
          key={"signin"}
          className={`px-2 py-1 rounded-xl flex  justify-center items-center gap-1 shadow-md duration-300 transition-all   ${
            location.pathname === "/signin" && menuActiveBg
          } `}
          to={"/signin"}
        >
          Signin
        </Link>
      </div> : 
      <div
            
      key={"logout"}
    >
      <button
      onClick={()=>setOpenModal(true)}
        key={"logout"}
        className={`px-2 py-1 rounded-xl flex  justify-center items-center gap-1 shadow-md cursor-pointer `}
      >
        Logout
      </button>
    </div> 

      }
    </article>
    {
      openModal && <section className="w-full fixed top-0 left-0 h-screen bg-black/30 z-[99999] flex justify-center items-center font-outfit"
      onClick={()=>setOpenModal(false)}>
 
        <article className="p-5 w-full max-w-[450px] rounded-2xl bg-white" onClick={(e)=>e.stopPropagation()}>
          <h1 className="text-[0.9rem] font-normal">Are you sure want to Logout ?</h1>
 
          <div className="flex justify-end text-[0.8rem] items-center gap-3 mt-[40px]">
 
             <button 
             className="border border-orange-600 p-1 text-orange-600 rounded-md cursor-pointer" 
             onClick={()=>setOpenModal(false)}>Cancel</button>
 
             <button 
             className="border border-orange-600 cursor-pointer p-1 flex justify-center items-center gap-1 bg-orange-600 text-white rounded-md"
             onClick={handleLogoutClick}>
              Logout  
             </button>
 
          </div>
 
        </article>
 
      </section>
   }
    </>
  );
};

export default MenuItem;
