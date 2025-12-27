import { ErrorMessage, Form, Formik } from 'formik';
import React from 'react'
import { useMutation } from '@tanstack/react-query';
import {  axiosInstance, getErrorMessage } from '../utils';
import toast from 'react-hot-toast';
import { blogSchema } from '../formikValidation';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';

const CreateBlog = () => {


    const postBlog = async (val) => {
       const response =  await axiosInstance.post("/blog/secure/create",val)
       return response.data;
      };
    
      const postBlogMutation = useMutation({
        mutationFn: postBlog,
        mutationKey: "post-blog",
        onError: (error) => {
            console.log(error)
          toast.error(getErrorMessage(error));
        },
      });



  return (
    <section className='w-full max-w-[1200px] mx-auto p-2 font-outfit'>

         <article className='flex justify-start items-center'>
             <Link to={-1} className='text-[0.6rem] bg-orange-600 text-white p-1 rounded-2xl cursor-pointer'>Go Back</Link>
         </article>

        <h1 className='text-3xl mt-4'>Post Your Blogs here</h1>

        <article className='w-full flex justify-center h-[60vh] items-center'>
           
        <article className="p-3 w-full max-w-[350px] shadow-xl rounded-2xl">
        <h1 className="text-orange-600 font-semibold text-3xl text-center my-5">
          Post Blog
        </h1>

        <Formik
        validationSchema={blogSchema}
        initialValues={{title:"",img:"",content:"" ,hashTags:""}}
        onSubmit={(val ,{resetForm})=>{
            console.log(val)
            postBlogMutation.mutate(val,{
                onSuccess:()=>{
                    toast.success("Post Added Successfully");
                     resetForm();
                }
            })
        }}
        >
          {({ values ,handleChange,handleBlur }) => {
            return (
              <Form>
                <input
                  type="text"
                  placeholder="Img Url"
                  name="img"
                  className="w-full border border-slate-100 rounded-2xl p-2 placeholder:text-[0.8rem]"
                  value={values.img}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage name="img" component="p" className="text-red-500 text-[0.6rem] ps-2" />
                <input
                  type="text"
                  placeholder="Title"
                  name="title"
                  className="w-full border border-slate-100 rounded-2xl p-2 mt-2 placeholder:text-[0.8rem]"
                  value={values.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage name="title" component="p" className="text-red-500 text-[0.6rem] ps-2" />
                <textarea
                  type="text"
                  placeholder="Description"
                  name="content"
                  className="w-full border border-slate-100 rounded-2xl p-2 mt-2 placeholder:text-[0.8rem]"
                  value={values.content}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage name="content" component="p" className="text-red-500 text-[0.6rem] ps-2" />
                <input
                  type="text"
                  placeholder="HashTags"
                  name="hashTags"
                  className="w-full border border-slate-100 rounded-2xl p-2 mt-2 placeholder:text-[0.8rem]"
                  value={values.hashTags}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage name="hashTags" component="p" className="text-red-500 text-[0.6rem] ps-2" />

                <div className="mt-9 flex justify-center items-center">
                  <button type="submit" className="bg-orange-600 text-white p-3 rounded-2xl w-[90%] cursor-pointer flex justify-center items-center">
                    Post Blog

                    {
                        postBlogMutation.isLoading && <Loader/>
                    }

                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>

      </article>

        </article>
      
    </section>
  )
}

export default CreateBlog
