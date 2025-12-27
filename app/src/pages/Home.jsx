import React, { useEffect, useState } from "react";
import { axiosInstance, getErrorMessage } from "../utils";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { Loader2, Search, ThumbsUp } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getLetterImg } from "../data/MenuItem";
import PageLoader from "../components/PageLoader";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { FaRegComment } from "react-icons/fa";
import toast from "react-hot-toast";
import { topSearchBlogs } from "../data/data";

const Home = () => {
  const navigate = useNavigate();

  const [searchParam] = useSearchParams();

  const PAGE_LIMIT = 12;

  const searchQuery = searchParam.get("q") ? searchParam.get("q") : "";

  const [searchText, setSearchText] = useState("");

  const fetchBlogs = async ({ pageParam = 0 }) => {
    const response = await axiosInstance.get(`/blog/public/`, {
      params: {
        q: searchQuery,
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
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["blogs", searchQuery],
    queryFn: fetchBlogs,
    getNextPageParam: (lastPage) => {
      const prevPage = lastPage.prevParam;
      if (lastPage.data.totalPages === 0) {
        return undefined;
      } else if (prevPage === lastPage.data.totalPages - 1) {
        return undefined;
      }
      return prevPage + 1;
    },
  });

  const handleSearchClick = () => {
    navigate(`/?q=${searchText.trim()}`);
  };


  const handleTagClick =(tag)=>{
    navigate(`/?q=${tag.trim()}`);
  }

  const BLOGS_LIST = blogsData?.pages?.reduce((result, page) => {
    return [...result, ...page?.data?.content];
  }, []);



  return (
    <section className="w-full min-h-screen max-w-[1200px] mx-auto p-2 font-outfit">
      <h1 className="text-2xl">📰 Blogs That Inform & Inspire</h1>

      <article className="w-full mt-5 float-end p-2 shadow-md rounded-2xl flex justify-start items-center h-[50px]">
        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          type="text"
          className="flex-1 placeholder:text-[0.8rem] text-[0.9rem] h-full"
          placeholder="Search Blogs eg.#travel ,#tech"
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              handleSearchClick();
            }
          }}
        />
        <span
          onClick={handleSearchClick}
          className="p-1 bg-orange-600 text-white rounded-2xl cursor-pointer"
        >
          <Search size={13} />
        </span>
      </article>

      <article className="flex w-full overflow-x-auto whitespace-nowrap justify-start items-start gap-2 mt-[100px] scrollbar-hide px-4">
        {topSearchBlogs.map((search, idx) => (
          <span
            key={idx}
            className={`text-[0.7rem] cursor-pointer px-3 py-1 border border-orange-500 rounded-2xl ${searchParam.get("q") === search.key ?  "bg-orange-600 text-white" : "bg-white"} hover:bg-orange-600 hover:text-white transition`}
            onClick={()=>handleTagClick(search.key)}
          >
            {search.label}
          </span>
        ))}
      </article>

      {blogsLoading && <PageLoader />}

      {BLOGS_LIST?.length === 0 && (
        <article className="w-full h-[70vh] flex flex-col justify-center items-center">
          <img
            src="https://t3.ftcdn.net/jpg/12/34/98/54/360_F_1234985477_7xMUwpl8ZwXz4HVdyfIKpOYri0Ti3tqw.jpg"
            className="w-[280px] h-[200px]"
            alt=""
          />
          <span className="text-[0.8rem]">No Blogs Found</span>
        </article>
      )}

      <article className="w-full max-w-[600px] mx-auto grid grid-cols-1  gap-4 mt-[10px]">
        {BLOGS_LIST?.map((blog, idx) => {
          return <BlogCard data={blog} key={idx} />;
        })}
      </article>

      {isFetchingNextPage && (
        <div className="w-full mt-2 flex justify-center items-center py-3">
          <Loader2
            className="text-orange-600 animate-spin duration-700 ease-in-out"
            size={20}
          />
        </div>
      )}

      {hasNextPage ? (
        <div className="w-full mt-2 flex justify-center items-center py-3">
          <span
            onClick={fetchNextPage}
            className="bg-orange-600 text-white cursor-pointer p-1 rounded-3xl text-[0.6rem]"
          >
            Load More
          </span>
        </div>
      ) : <div className="w-full mt-2 flex justify-center items-center py-3">
      <span
        className="text-gray-600 bg-white/40 cursor-pointer p-1 rounded-3xl text-[0.6rem]"
      >
       No Result Found
      </span>
    </div>}
    </section>
  );
};

export default Home;

const BlogCard = ({ data }) => {
  const { img, title, id, content, hashTags, likes, author, createdAt, liked  ,comments} =
    data;

  const [like, setLike] = useState(liked);

  const [likesCount, setLikesCount] = useState(likes);

  const { id: userId } = JSON.parse(sessionStorage.getItem("profile")) || {};

  const { name ,profileImgUrl} = author;

  const [readMore, setReadMore] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setLike(liked);
    setLikesCount(likes);
  }, [data]);

  const likeBlog = async () => {
    const response = await axiosInstance.post("/like/secure/create", {
      blogId: id,
      userId: userId,
    });
    return response.data;
  };

  const disLikeBlog = async () => {
    const response = await axiosInstance.post("/like/secure/dislike", {
      blogId: id,
      userId: userId,
    });
    return response.data;
  };

  const likeMutation = useMutation({
    mutationKey: "like-blog",
    mutationFn: likeBlog,
  });

  const disLikeMutation = useMutation({
    mutationKey: "dislike-blog",
    mutationFn: disLikeBlog,
  });

  const handleLikeClick = () => {
    if (!userId) {
      navigate("/signin");
      return;
    }
    likeMutation.mutate(null, {
      onSuccess: () => {
        setLike(true);
        setLikesCount((prev) => prev + 1);
        toast.success("Liked");
      },
      onError: (error) => {
        console.log(error);
        toast.error(getErrorMessage(error));
      },
    });
  };

  const handleDislikeClick = () => {
    if (!userId) {
      navigate("/signin");
      return;
    }
    disLikeMutation.mutate(null, {
      onSuccess: () => {
        setLike(false);
        setLikesCount((prev) => prev - 1);
        toast.success("Disliked");
      },
      onError: (error) => {
        console.log(error);
        toast.error(getErrorMessage(error));
      },
    });
  };

  const handleTagClick = (tag) => {
    navigate(`/?q=${tag.trim()}`);
  };

  return (
    <article className="p-2 rounded-2xl shadow-sm hover:shadow-md  duration-700 font-outfit cursor-pointer"
    onClick={()=>navigate("/blog?blogId="+id)}>
      <article className="w-full my-4">
        <div className="flex justify-start items-center">
          <img
            src={profileImgUrl ? profileImgUrl : getLetterImg(name)}
            className="shadow rounded-full w-5 h-5"
            alt=""
          />
          <span className="ms-1 font-semibold">{name}</span>
        </div>
        <div className="text-[0.65rem] text-gray-500">
          Posted on {formatDateTime(createdAt)}
        </div>
      </article>

      <img
        src={img}
        className="w-full h-[250px] md:h-[350px] rounded-md"
        alt=""
      />
      <div className="flex w-full justify-start items-center gap-3">
        <span className="flex justify-center text-[1rem] items-center ">
          {!like ? (
            <IoMdHeartEmpty
              className="text-red-600 cursor-pointer text-[1.3rem]"
              onClick={(e)=>{
                e.stopPropagation();
                handleLikeClick();
              }}
            />
          ) : (
            <IoMdHeart
              className="text-red-600 cursor-pointer text-[1.5rem]"
              onClick={(e)=>{
                e.stopPropagation();
                handleDislikeClick();
              }}
            />
          )}
          {likesCount}
        </span>
        <span className="flex justify-center text-[1rem] items-center gap-[2px] ">
          <FaRegComment />
          {comments}
        </span>

       
      </div>
      <h1 className="text-2xl whitespace-nowrap overflow-hidden text-ellipsis mt-4">
        {title}
      </h1>
      <p className="text-[0.8rem] text-gray-600 overflow-hidden whitespace-pre-line">
        {!readMore ? content.substring(0, 230) : content}
        {content.length > 230 && (
          <span
            className="text-[0.6rem] bg-gray-300 p-[2px] px-1 rounded-2xl ml-1 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setReadMore(!readMore);
            }}
          >
            {!readMore ? "Read more" : "Read Less"}
          </span>
        )}
      </p>
      <div className="flex flex-wrap gap-2 mt-4">
        {hashTags.split(",").map((tag, idx) => (
          <span
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              handleTagClick(tag);
            }}
            className="rounded-3xl text-[0.7rem] bg-orange-600 text-white cursor-pointer py-[2px] px-2"
          >
            {"# " + tag}
          </span>
        ))}
      </div>
    </article>
  );
};

export function formatDateTime(isoString) {
  const date = new Date(isoString);

  return date
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(",", "");
}
