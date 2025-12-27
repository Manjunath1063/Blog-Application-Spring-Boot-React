import { BookOpenText, House, Info } from "lucide-react";
import { FaRegUser } from "react-icons/fa";

export const menuData = [
    {
      key: "home",
      label: "Home",
      path : "/",
      icon : House,
      secure:false
    },
    {
      key: "blogs",
      label: "Blogs",
      path : "/blogs",
      icon : BookOpenText,
      secure:true
    },
    {
      key: "profile",
      label: "Profile",
      path : "/profile",
      icon : FaRegUser,
      secure:true
    }
  ];


  export const getLetterImg = (name) => {
    if (!name || typeof name !== "string") return null;

    const firstLetter = name.charAt(0).toUpperCase(); // Get the first letter in uppercase

    const letterImages = {
        A: "https://i.pinimg.com/736x/2b/b5/da/2bb5dafc4e395f1fc21d298bcc555d80.jpg",
        B: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtQVbcgGuaTwiLP7bGsXLo0TjJoym-XGdzwA&s",
        C: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPApNvzWprbliB2VEWHobT3t40Y9s9yHt97w&s",
        D: "https://st4.depositphotos.com/1028436/21386/i/450/depositphotos_213861284-stock-photo-black-icon-white-background.jpg",
        E: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRY9b9t1faplkEzyZ15sLSDOhZQo7xSrG2RyQ&s",
        F: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwbpxB9R3vUkJegd05Tp6PYuo1__DEMF3b8Q&s",
        G: "https://thumbs.dreamstime.com/b/volumetric-construction-foam-uppercase-letter-g-isolated-white-background-d-rendered-alphabet-modern-font-banner-poster-146310478.jpg",
        H: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKr7gEBwLNUZE6St4H41pXBNZl9TkAYyQh2A&s",
        I: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ70l449bSZJlZzRwiqjNtdkStzk7Btv9kgDQ&s",
        J: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjYOI_hMeHTgPpOsQuMX7lzndCSJFfBhIwEQ&s",
        K: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzgTOnSSTOjHC00Uh9OAywhSLhkA2TNtFEkA&s",
        L: "https://c8.alamy.com/comp/2RH9136/l-letter-college-sports-jersey-font-on-white-background-isolated-illustration-2RH9136.jpg",
        M: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-K3Ww9FeXgMkDC32YvrnF_zv9ilf6lxgfTQ&s",
        N: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6r3Zo39QWw-sw2yGsYwFoMZ-IfEpxSLJZLw&s",
        O: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR26MBe_U9tx20eLFmq8Ki1v-H-P6MTd_zYQ&s",
        P: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRW-vbpKxU6DTfs9CHhCznjXjnvE33DeFAExg&s",
        Q: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDKz5flnLPTFhLQDz2fSmrrqZn2l_GhLRl0A&s",
        R: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX8qqRpsVPZr75Rue9Ug5zotiJp_tuoqR24g&s",
        S: "https://thumbs.dreamstime.com/b/letter-s-sign-yellow-color-realistic-d-design-cartoon-balloon-style-isolated-white-background-vector-illustration-348586583.jpg",
        T: "https://thumbs.dreamstime.com/b/alphabet-symbol-stylish-letter-t-abstract-font-symbol-letter-letters-white-background-alphabet-symbol-grunge-hand-draw-paint-187226579.jpg",
        U: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLWBWIpXuBfL3fshRxrZpVUgSh-sJKxFat_w&s",
        V: "https://c8.alamy.com/comp/H8YNRR/white-letter-v-3d-rendering-graphic-isolated-on-white-background-H8YNRR.jpg",
        W: "https://st2.depositphotos.com/4441075/6544/i/950/depositphotos_65441799-stock-photo-single-w-alphabet-letter.jpg",
        X: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvtnhBFIcEzkn7WKkZa_8gIzCFObuyO0dHjg&s",
        Y: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThFexh5UTkjHwukixorKaWonTDBuR7vBhirQ&s",
        Z: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9aV3vxhaLDy5xlAhhEHX_G1BXZw7_hq0MOw&s",
    };

    return letterImages[firstLetter] || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9zDcfuhkyr5Ek9YTfeuna7OCS3rrLqtc2cQ&s"; 
};



