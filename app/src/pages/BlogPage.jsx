import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { axiosInstance, getErrorMessage } from "../utils";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import PageLoader from "../components/PageLoader";
import { FaRegCommentDots } from "react-icons/fa";
import toast from "react-hot-toast";
import { IoMdClose, IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { AnimatePresence, motion } from "motion/react";
import { IoSend } from "react-icons/io5";
import { getLetterImg } from "../data/MenuItem";
import Loader from "../components/Loader";
import { formatDateTime } from "./Home";
import { FaShareNodes } from "react-icons/fa6";
import SocialShare from "../components/SocialShare";

const BlogPage = () => {
  const [searchParam] = useSearchParams();
  const navigate = useNavigate();
  const [like, setLike] = useState(null);
  const [likesCount, setLikesCount] = useState(null);

  const [showComment, setShowComment] = useState(false);

  const [showShareModal, setShowShareModal] = useState(false);



  const [commentText, setCommentText] = useState("");

  const queryClient = useQueryClient();

  //Remove overflow from body when comment section is opened
  useEffect(() => {
    if (showComment) {
      window.document.body.style.overflow = "hidden";
    } else {
      window.document.body.style.overflow = "auto";
    }
  }, [showComment]);

  const { id: userId } = JSON.parse(sessionStorage.getItem("profile")) || {};

  const BLOG_ID = searchParam.get("blogId");
  const SIMILAR_BLOG_LIMIT = 9;
  const BLOG_COMMENT_LIMIT = 4;

  const [blogCategory, setBlogCategory] = useState(null);

  const makeComment = async () => {
    const requestData = {
      userId,
      blogId: BLOG_ID,
      comment: commentText,
    };
    const response = await axiosInstance.post(
      `/comment/secure/create`,
      requestData
    );
    return response.data;
  };

  const fetchBlogComments = async ({ pageParam = 0 }) => {
    const response = await axiosInstance.get(`/comment/public/blog`, {
      params: {
        page: pageParam,
        limit: BLOG_COMMENT_LIMIT,
        id: BLOG_ID,
      },
    });
    return {
      ...response.data,
      prevParam: pageParam,
    };
  };

  const fetchBlog = async () => {
    const response = await axiosInstance.get(`/blog/public/${BLOG_ID}`);
    return response.data;
  };

  const fetchBlogs = async ({ pageParam = 0 }) => {
    const response = await axiosInstance.get(`/blog/public/`, {
      params: {
        q: blogCategory,
        page: pageParam,
        limit: SIMILAR_BLOG_LIMIT,
      },
    });
    return {
      ...response.data,
      prevParam: pageParam,
    };
  };

  const {
    data: SIMILAR_BLOG_RESPONSE,
    isLoading: SIMILAR_BLOG_LOADING,
    isError: SIMILAR_BLOG_ERROR,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["blogs-similar", blogCategory],
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

  const {
    data: BLOG_COMMENT_RESPONSE,
    isLoading: BLOG_COMMENTS_LOADING,
    isError: BLOG_COMMENT_ERROR,
    fetchNextPage: BLOG_COMMENT_FETCHNEXTPAGE,
    hasNextPage: BLOG_COMMENT_HASNEXTPAGE,
    isFetchingNextPage: BLOG_COMMENT_FETCHINGNEXTPAGE,
  } = useInfiniteQuery({
    queryKey: ["blog-commnets", BLOG_ID],
    queryFn: fetchBlogComments,
    getNextPageParam: (lastPage) => {
      const prevPage = lastPage.prevParam;
      if (lastPage.data.last) {
        return undefined;
      }
      return prevPage + 1;
    },
  });

  const {
    data: blogResponse,
    isLoading: blogLoading,
    isError: blogError,
  } = useQuery({
    queryKey: ["blog", BLOG_ID],
    queryFn: fetchBlog,
  });

  const likeBlog = async () => {
    const response = await axiosInstance.post("/like/secure/create", {
      blogId: BLOG_ID,
      userId: userId,
    });
    return response.data;
  };

  const disLikeBlog = async () => {
    const response = await axiosInstance.post("/like/secure/dislike", {
      blogId: BLOG_ID,
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

  const commentMutation = useMutation({
    mutationKey: "send-comment",
    mutationFn: makeComment,
    onSuccess: (result) => {
      setCommentText("");
      toast.success("Thank you for your comment !");
      queryClient.invalidateQueries(["blog-commnets", BLOG_ID]);
    },
    onError: (error) => {
      console.log(error);
      toast.error(getErrorMessage(error));
    },
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

  const handleCommentSendClick = () => {
    if (!userId) {
      toast.error("Please Login");
      navigate("/signin");
      return;
    }

    if (commentText.trim() === "") {
      toast.error("Comment Required!");
      return;
    }
    commentMutation.mutate();
  };

  useEffect(() => {
    if (blogResponse) {
      const { hashTags, likes, liked } = blogResponse?.data;
      setBlogCategory(hashTags?.trim());
      setLike(liked);
      setLikesCount(likes);
    }
  }, [blogResponse]);

  if (blogLoading) {
    return <PageLoader />;
  }

  const { data: BLOG_DATA } = blogResponse;

  const SIMILAR_BLOGS = SIMILAR_BLOG_RESPONSE?.pages
    ?.reduce((result, page) => {
      return [...result, ...page?.data?.content];
    }, [])
    .filter((blog, idx) => blog.id != BLOG_ID);

  const {
    img: BLOG_IMG,
    title: BLOG_TITLE,
    content: BLOG_CONTENT,
    hashTags: BLOG_TAGS,
    author: BLOG_AUTHOR,
    comments: BLOG_TOTAL_COMMENTS,
  } = BLOG_DATA;

  const BLOG_COMMENTS = BLOG_COMMENT_RESPONSE?.pages?.reduce((result, page) => {
    return [...result, ...page?.data?.content];
  }, []);

  const { name: AUTHOR_NAME } = BLOG_AUTHOR;

  return (
    <>
      <section
        className="mx-auto w-full max-w-[1200px] p-2 font-outfit min-h-[80vh] pb-[50px]"
        onClick={() => setShowShareModal(false)}
      >
        <article className="flex justify-start items-center py-2">
          <Link
            to={-1}
            className="text-[0.8rem] px-1 py-[2px] bg-orange-600 text-white rounded-3xl cursor-pointer"
          >
            Go Back
          </Link>
        </article>

        <section className="flex justify-start items-start flex-col lg:flex-row gap-1">
          {/* Display Blog Details */}

          <article className="w-full lg:w-[65%] lg:sticky top-[100px] ">
            <img
              src={BLOG_IMG}
              className="rounded-xl w-full h-[250px] lg:h-[450px] shadow"
              alt=""
            />

            <h1 className="text-[1.3rem] font-semibold mt-[20px] whitespace-nowrap overflow-hidden text-ellipsis">
              {BLOG_TITLE}
            </h1>

            <div className="w-full flex justify-start items-center gap-2">
              <span className="flex justify-center text-[1rem] items-center ">
                {!like ? (
                  <IoMdHeartEmpty
                    className="text-red-600 cursor-pointer text-[1.3rem]"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLikeClick();
                    }}
                  />
                ) : (
                  <IoMdHeart
                    className="text-red-600 cursor-pointer text-[1.5rem]"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDislikeClick();
                    }}
                  />
                )}
                {likesCount}
              </span>

              <span className="flex justify-center text-[1rem] items-center ">
                <FaRegCommentDots
                  className="me-1 cursor-pointer"
                  onClick={() => setShowComment(true)}
                />{" "}
                {BLOG_TOTAL_COMMENTS}
              </span>

              <span className="flex justify-center text-[1rem] items-center relative">
                <FaShareNodes
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowShareModal(true);
                  }}
                />

                {showShareModal && (
                  <article
                    className="p-2 bg-white shadow-lg absolute top-full left-full rounded-md border border-gray-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h1 className="text-[0.7rem]">Share</h1>

                    <SocialShare
                      url={window.location.href}
                      onSelect={() => setShowShareModal(false)}
                    />
                  </article>
                )}
              </span>
            </div>

            <div className="p-2 shadow whitespace-break-spaces text-[0.8rem] rounded-md">
              {BLOG_CONTENT}
            </div>

            <article className="mt-3">
              <h1>Tags</h1>
              <div className="mt-1 flex justify-start items-start gap-2 flex-wrap">
                {BLOG_TAGS?.split(",")?.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[0.8rem] rounded-2xl px-1 py-[2px] bg-orange-600 text-white"
                  >
                    {"# " + tag}
                  </span>
                ))}
              </div>
            </article>
          </article>

          <article className="w-full lg:w-[35%]   ">
            <h1 className="ms-[50px] text-2xl font-semibold">
              You May Also Like
            </h1>

            {
                SIMILAR_BLOG_LOADING && <div className="w-full h-[150px] flex justify-center items-center text-[0.8rem]">
               <Loader className="text-[1.3rem] text-orange-600"/>
            </div>
            }

            {
                SIMILAR_BLOGS?.length === 0 ? <div className="w-full h-[150px] flex justify-center items-center text-[0.8rem]">
                    No similar blogs found 
                </div>    : <div className="flex flex-col justify-start items-center w-full">
                {SIMILAR_BLOGS?.map((blog, idx) => {
                  return <SimilarBlogCard data={blog} key={idx} />;
                })}
              </div>
            }
          </article>
        </section>
      </section>

      <AnimatePresence mode="wait">
        {showComment ? (
          <motion.section
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
            exit={{ y: "100%" }}
            className="fixed top-[100px] left-0 w-full h-[calc(100%-100px)] bg-black/40 flex  justify-center items-center p-1 lg:p-3 font-outfit"
            key={"comment-section"}
            onClick={() => setShowComment(false)}
          >
            <section
              className="bg-white w-full h-full max-w-[500px] p-1 lg:p-4 rounded-2xl flex flex-col justify-start items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="w-full flex justify-end items-center">
                <IoMdClose
                  className="text-[1.4rem] cursor-pointer"
                  onClick={() => setShowComment(false)}
                />
              </span>

              <article className="w-full flex-1 overflow-auto scrollbar-hide rounded-2xl  p-3">
                <h1>Comments</h1>

                {BLOG_COMMENTS_LOADING && (
                  <article className="w-full h-[200px] flex justify-center items-center">
                    <Loader className="text-[1.5rem] text-orange-600" />
                  </article>
                )}

                {BLOG_COMMENTS?.length === 0 ? (
                  <div className="w-full mt-[40px] h-full flex justify-center items-center   rounded-2xl shadow">
                    <span className="text-[0.9rem]">No Comments 👻💬</span>
                  </div>
                ) : (
                  <div className="w-full flex-1  mt-[40px]">
                    {BLOG_COMMENTS?.map((commentData, idx) => (
                      <BLOG_COMMENT_CARD data={commentData} key={idx} />
                    ))}

                    {BLOG_COMMENT_FETCHINGNEXTPAGE && (
                      <span className="w-full flex justify-center items-center">
                        <Loader className="text-[1rem] text-orange-600" />
                      </span>
                    )}

                    {BLOG_COMMENT_HASNEXTPAGE && (
                      <span className="w-full flex justify-center items-center">
                        {" "}
                        <span
                          onClick={BLOG_COMMENT_FETCHNEXTPAGE}
                          className="text-[0.6rem] cursor-pointer px-2 py-[1px] rounded-2xl bg-slate-100"
                        >
                          Load More
                        </span>{" "}
                      </span>
                    )}
                  </div>
                )}
              </article>
              <article className="bg-white w-full h-[60px] mt-5">
                <div className="flex gap-1 justify-center items-center p-2 rounded-md shadow">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1 text-[0.98rem] resize-none h-[50px] p-1 scrollbar-hide"
                    placeholder="Type your Comment...."
                  ></textarea>

                  {commentMutation.isPending ? (
                    <Loader className="text-orange-600 text-[1.1rem]" />
                  ) : (
                    <IoSend
                      className="text-[1.4rem] text-orange-600 cursor-pointer "
                      onClick={handleCommentSendClick}
                    />
                  )}
                </div>
              </article>
            </section>
          </motion.section>
        ) : (
          <></>
        )}
      </AnimatePresence>
    </>
  );
};

export default BlogPage;

const SimilarBlogCard = ({ data }) => {
  const { img, title, content, id } = data;

  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate("/blog?blogId=" + id);
  };

  return (
    <article
      className="p-2 shadow rounded-lg w-[95%] lg:w-[80%] cursor-pointer transition duration-700 hover:shadow-lg hover:scale-95"
      onClick={handleCardClick}
    >
      <img src={img} className="w-full h-[200px] rounded-md" alt="" />
      <h1 className="mt-2 text-[1.1rem]  font-semibold">{title}</h1>
      <div className="text-[0.8rem] text-gray-700 line-clamp-3 overflow-hidden text-ellipsis mt-2">
        {content}
      </div>
    </article>
  );
};

const BLOG_COMMENT_CARD = ({ data }) => {
  const { userName, comment, createdAt } = data || {};

  console.log(data);

  return (
    <article className="p-2 my-4 w-full shadow rounded-lg">
      <span className="w-full flex justify-start items-center text-[0.9rem]">
        <img
          src={getLetterImg(userName)}
          className="w-4 h-4 rounded-full"
          alt=""
        />
        {userName}
      </span>
      <span className="text-[0.5rem] mt-0 w-full flex justify-end items-center">
        {formatDateTime(createdAt)}
      </span>

      <div className="w-full mt-5 whitespace-pre-line text-[0.75rem] text-gray-600">
        {comment}
      </div>
    </article>
  );
};
