import { ErrorMessage, Form, Formik } from "formik";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance, getErrorMessage } from "../utils";
import toast from "react-hot-toast";
import { blogSchema } from "../formikValidation";
import Loader from "../components/Loader";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Trash } from "lucide-react";

const UpdateBlog = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const { data } = location.state;

  const BLOG_DATA = data;

  const updateBlog = async (val) => {
    const response = await axiosInstance.put(
      `/blog/secure/update/${BLOG_DATA?.id}`,
      val
    );
    return response.data;
  };

  const deleteBlog = async (val) => {
    const response = await axiosInstance.delete(
      `/blog/secure/delete/${BLOG_DATA?.id}`,
      val
    );
    return response.data;
  };

  const updateBlogMutation = useMutation({
    mutationFn: updateBlog,
    mutationKey: "update-blog",
    onError: (error) => {
      console.log(error);
      toast.error(getErrorMessage(error));
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: deleteBlog,
    mutationKey: "delete-blog",
    onError: (error) => {
      console.log(error);
      toast.error(getErrorMessage(error));
    },
    onSuccess: () => {
      toast.success("Blog Removed Successfully");
      setTimeout(() => {
        navigate("/blogs");
      }, 500);
    },
  });

  const handleDeleteBtnClick = () => {
    deleteBlogMutation.mutate();
  };

  return (
    <>
      <section className="w-full  min-h-screen max-w-[1200px] mx-auto p-2 font-outfit">
        <article className="flex justify-start items-center">
          <Link
            to={-1}
            className="text-[0.6rem] bg-orange-600 text-white p-1 rounded-2xl cursor-pointer"
          >
            Go Back
          </Link>
        </article>

        <article className="w-full flex justify-center  items-center">
          <article className="p-3 w-full max-w-[650px] shadow-xl rounded-2xl">
            <div className="flex justify-end items-center w-full my-5">
              {deleteBlogMutation?.isLoading ? (
                <span className="p-1 text-[0.7rem] text-white bg-orange-600 rounded-2xl flex justify-center items-center gap-1">
                  <Loader />
                </span>
              ) : (
                <span
                  onClick={() => setOpenDeleteModal(true)}
                  className="cursor-pointer p-1 text-[0.7rem] text-white bg-orange-600 rounded-2xl flex justify-center items-center gap-1"
                >
                  Delete <Trash size={13} color="#ffffff" />
                </span>
              )}
            </div>

            <h1 className="text-orange-600 font-semibold text-3xl text-center my-4">
              Update your Post
            </h1>

            <Formik
              validationSchema={blogSchema}
              initialValues={{
                title: BLOG_DATA?.title,
                img: BLOG_DATA?.img,
                content: BLOG_DATA?.content,
                hashTags: BLOG_DATA?.hashTags,
              }}
              onSubmit={(val) => {
                console.log(val);
                updateBlogMutation.mutate(val, {
                  onSuccess: () => {
                    toast.success("Post updated Successfully");
                  },
                });
              }}
            >
              {({ values, handleChange, handleBlur }) => {
                return (
                  <Form>
                    <img
                      src={values.img}
                      className="w-full h-[180px] md:h-[350px] rounded-md"
                      alt=""
                    />

                    <div className="mt-6">
                      <label htmlFor="img" className="text-[0.7rem] ms-2 text-orange-600">
                        Image Url
                      </label>
                      <input
                        id="img"
                        type="text"
                        placeholder="Img Url"
                        name="img"
                        className="w-full border border-slate-100 rounded-2xl p-2 placeholder:text-[0.8rem]"
                        value={values.img}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <ErrorMessage
                        name="img"
                        component="p"
                        className="text-red-500 text-[0.6rem] ps-2"
                      />
                    </div>

                    <div className="mt-6">
                      <label htmlFor="title" className="text-[0.7rem] ms-2 text-orange-600">
                        Title
                      </label>
                      <input
                        type="text"
                        placeholder="Title"
                        name="title"
                        className="w-full border border-slate-100 rounded-2xl p-2 mt-2 placeholder:text-[0.8rem]"
                        value={values.title}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <ErrorMessage
                        name="title"
                        component="p"
                        className="text-red-500 text-[0.6rem] ps-2"
                      />
                    </div>


                    <div className="mt-6">
                      <label htmlFor="content" className="text-[0.7rem] ms-2 text-orange-600">
                        Content/Description
                      </label>
                      <textarea
                      rows={10}
                      type="text"
                      id="content"
                      placeholder="Description"
                      name="content"
                      className="w-full border border-slate-100 rounded-2xl p-2 mt-2 placeholder:text-[0.8rem] scrollbar-thin"
                      value={values.content}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <ErrorMessage
                      name="content"
                      component="p"
                      className="text-red-500 text-[0.6rem] ps-2"
                    />
                    </div>

                    <div className="mt-6">
                      <label htmlFor="tag" className="text-[0.7rem] ms-2 text-orange-600">
                        Tags
                      </label>
                      <input
                      type="text"
                      id="tag"
                      placeholder="HashTags"
                      name="hashTags"
                      className="w-full border border-slate-100 rounded-2xl p-2 mt-2 placeholder:text-[0.8rem]"
                      value={values.hashTags}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <ErrorMessage
                      name="hashTags"
                      component="p"
                      className="text-red-500 text-[0.6rem] ps-2"
                    />
                    </div>
                    
                    

                    <div className="mt-9 flex justify-center items-center">
                      <button
                        type="submit"
                        className="bg-orange-600 text-white p-3 rounded-2xl w-[90%] cursor-pointer flex justify-center items-center"
                      >
                        Update Blog
                        {updateBlogMutation.isLoading && <Loader />}
                      </button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </article>
        </article>
      </section>

      {/* Delete Modal */}

      {openDeleteModal && (
        <section
          className="w-full fixed top-0 left-0 h-screen bg-black/30 z-[99999] flex justify-center items-center font-outfit"
          onClick={() => setOpenDeleteModal(false)}
        >
          <article
            className="p-5 w-full max-w-[450px] rounded-2xl bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="text-[0.9rem] font-normal">
              Are you sure want to delete this blog ?
            </h1>

            <div className="flex justify-end text-[0.8rem] items-center gap-3 mt-[40px]">
              <button
                className="border border-orange-600 p-1 text-orange-600 rounded-md cursor-pointer"
                onClick={() => setOpenDeleteModal(false)}
              >
                Cancel
              </button>

              <button
                className="border border-orange-600 cursor-pointer p-1 flex justify-center items-center gap-1 bg-orange-600 text-white rounded-md"
                onClick={handleDeleteBtnClick}
              >
                Delete
                {deleteBlogMutation?.isLoading && <Loader />}
              </button>
            </div>
          </article>
        </section>
      )}
    </>
  );
};

export default UpdateBlog;
