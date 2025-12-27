import React, { useState } from "react";
import MenuItem from "./MenuItem";
import { Menu } from "lucide-react";
import MobileMenuItem from "./MobileMenuItem";

const Navbar = () => {

   const brandImage ="https://cdn.pixabay.com/photo/2022/01/16/16/44/blogger-logo-6942640_1280.png";

 const [openMenuSideBar,setMenuSideBarOpen] = useState(false);
 
 
 

  return (
    <section className="w-full flex justify-between items-center p-2 lg:p-4 overflow-hidden h-[80px] bg-white">
      {/* Brand Section */}
      <article
        className="flex justify-center items-center gap-2 cursor-pointer"
      >
        <img
          src={brandImage}
          alt="vsquare"
          className="w-8 h-8 md:h-10 md:w-10 rounded-2xl"
        />

        <span className="font-outfit text-2xl">
          <span className="text-3xl font-semibold text-orange-600">BlogSphere</span>
        </span>
      </article>
     
       <Menu  
       size={26} 
       className="block lg:hidden cursor-pointer"
       onClick={()=>setMenuSideBarOpen(true)}/>


       {/* Desktop Navbar */}
       <MenuItem className="hidden lg:flex" />

       <MobileMenuItem
       key={"mobile-menu"}
       open={openMenuSideBar}
       onClose={()=>setMenuSideBarOpen(false)}/>
    </section>
  );
};

export default Navbar;
