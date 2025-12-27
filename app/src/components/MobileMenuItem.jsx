import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { menuData } from "../data/MenuItem";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const MobileMenuItem = ({ open, onClose = () => {} }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const menuActiveBg =
    "bg-orange-600 text-white  ";

    const queryClient = useQueryClient();

    const isLoggedIn = localStorage.getItem("token") ? true : false;  

    const [openModal , setOpenModal] = useState(false);

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
    <section
      className={` fixed top-0 w-full h-screen duration-700  bg-slate-50/45 z-[999] font-outfit ${
        open ? "left-0" : "left-[-100%]"
      }`}
      onClick={onClose}
    >
      <article
        className="bg-white w-full max-w-[400px] h-full p-5 flex flex-col justify-start items-start gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end w-full cursor-pointer items-center">
          <X size={24} onClick={onClose} />
        </div>
        {menuData.map((menuItem, idx) => {
          return (
            <div
              key={menuItem.key}
              className={`px-2 py-1 cursor-pointer rounded-xl flex  justify-center items-center gap-1 duration-300 transition-all text-start w-[80%]  ${
                location.pathname === menuItem.path && menuActiveBg
              } `}
              onClick={() => {
                onClose();
                setTimeout(() => {
                  navigate(menuItem.path);
                }, 0);
              }}
            >
              <menuItem.icon size={15} />
              {menuItem.label}
            </div>
          );
        })}
        {
        !isLoggedIn ? <div
            
        key={"signin"}
        className="px-2  py-1 cursor-pointer rounded-xl flex  justify-center items-center gap-1 duration-300 transition-all text-start w-[80%]"
      >
        <Link
          key={"signin"}
          className={`   ${
            location.pathname === "/signin" && menuActiveBg
          } `}
          to={"/signin"}
        >
          Signin
        </Link>
      </div> : 
      <div
            
      key={"logout"}
      className="px-2  py-1 cursor-pointer rounded-xl flex  justify-center items-center gap-1 duration-300 transition-all text-start w-[80%]"
    >
      <button
      onClick={()=>setOpenModal(true)}
        key={"logout"}
        className={`px-2 w-full py-1 cursor-pointer rounded-xl flex  justify-center items-center gap-1 duration-300 transition-all text-start w-[80%] `}
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
    </section>
  );
};

export default MobileMenuItem;
