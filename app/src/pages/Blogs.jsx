import { ImagePlus, Loader2, ThumbsUp } from "lucide-react";
import React, { useState } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { data, useNavigate } from "react-router-dom";
import { axiosInstance } from "../utils";
import PageLoader from "../components/PageLoader";
import { IoMdHeart } from "react-icons/io";

const Blogs = () => {
  const PAGE_LIMIT = 12;


  const fetchBlogs = async ({ pageParam = 0 }) => {
    const { id } = JSON.parse(sessionStorage.getItem("profile"));

    const response = await axiosInstance.get(`/blog/public/user/${id}`, {
      params: {
        page: pageParam,
        limit: PAGE_LIMIT,
      },
    });
    return {
      ...response.data,
      prevParam: pageParam,
    };
  };

  const {
    data: blogsData,
    isLoading: blogsLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ["blogs"],
    queryFn: fetchBlogs,
    getNextPageParam: (lastPage) => {
      const prevPage = lastPage.prevParam;
      if(lastPage.data.totalPages===0)
      {
        return undefined
      }
      else if (prevPage === lastPage.data.totalPages-1) {
        return undefined;
      }
      return prevPage + 1;
    },
  });

  const naviagate = useNavigate();
  const handlePostBlogClick = () => {
    naviagate("/blog/add");
  };



  const BLOGS_LIST = blogsData?.pages?.reduce((result,page)=>{

    return [ ...result , ...page?.data?.content]

  },[])


  if(blogsLoading)
  {
    return <PageLoader/>
  }


  return (
    <section className="w-full min-h-screen p-2 font-outfit max-w-[1200px] mx-auto">
      <h1 className="text-3xl ">Your Blogs</h1>

      <article className="flex w-full justify-end items-center">
        <button
          className="px-2 py-1 rounded-md bg-orange-600 text-white text-[0.8rem] flex justify-center items-center gap-2 cursor-pointer"
          onClick={handlePostBlogClick}
        >
          Post Blog <ImagePlus size={14} />
        </button>
      </article>


      {
        BLOGS_LIST?.length ===0 &&  <article className="w-full h-[70vh] flex justify-center items-center flex-col">
            <img src="https://img.freepik.com/premium-vector/cute-dog-cartoon-vector-white-background_1026278-4582.jpg" className="w-[200px] h-[200px]" alt="" />
            <span className="text-[0.8rem]">📭 No blogs available. Start writing your first post! ✍️</span>
        </article>
      }

      <article className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {
            BLOGS_LIST?.map((blog,idx)=>{
                return <BlogCard data={blog} key={idx}/>
            })
        }
      </article>

      {
        isFetchingNextPage && <div className="w-full mt-2 flex justify-center items-center py-3">
            <Loader2 className="text-orange-600 animate-spin duration-700 ease-in-out" size={20}/>
        </div>
      } 

      {
        hasNextPage && <div className="w-full mt-2 flex justify-center items-center py-3">
        <span onClick={fetchNextPage} className="bg-orange-600 text-white cursor-pointer p-1 rounded-3xl text-[0.6rem]">Load More</span>
    </div>
      }
    </section>
  );
};

export default Blogs;



const BlogCard = ({data}) =>{

  
    const {img,title,id,content,hashTags ,likes } = data;

    const naviagate = useNavigate();

    const hadleBlogClick = ()=>{
        naviagate("/blog/update",{
            state:{
                data 
            }
        })
    }


    return <article onClick={hadleBlogClick} className="p-2 rounded-2xl shadow-sm hover:shadow-md hover:scale-95 duration-700 cursor-pointer">
        <img src={img} className="w-full h-[200px] rounded-md" alt="" />
        <div className="flex w-full justify-end mt-2">
            <span className="flex justify-center text-[0.8rem] items-center"><IoMdHeart className="text-red-600 " /> {likes}</span>
        </div>
        <h1 className="text-2xl whitespace-nowrap overflow-hidden text-ellipsis mt-4">{title}</h1>
        <p className="text-[0.8rem] text-gray-600 line-clamp-3 text-ellipsis overflow-hidden">{content}</p>
        <div className="flex flex-wrap gap-2 mt-4">
           {
             hashTags.split(",").map((tag,idx)=><span key={idx} className="rounded-3xl text-[0.7rem] bg-orange-600 text-white py-[2px] px-2">{"#"+tag}</span>)
           }
        </div>
    </article>

}
