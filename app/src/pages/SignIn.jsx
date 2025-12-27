import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { signinSchema} from "../formikValidation";
import { API_URL, getErrorMessage } from "../utils";
import Loader from "../components/Loader";

const SignIn = () => {

    const navigate = useNavigate();

  const signin = async (val) => {
    const res = await axios.post(
      `${API_URL}/user/public/signin`,
      val
    );

    return res.data;
  };

  const signinMutation = useMutation({
    mutationFn: signin,
    mutationKey: "user-signin",
    onSuccess: (result) => {
      const {token} = result;
      localStorage.setItem("token",token);  
      toast.success("Logged In Successfully");
      setTimeout(()=>{
           navigate("/");
      },300)
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return (
    <section className="w-full min-h-screen flex justify-center items-center p-2 font-outfit">
      <article className="p-3 w-full max-w-[350px] shadow-xl rounded-2xl">
        <h1 className="text-orange-600 font-semibold text-3xl text-center my-5">
          Sign In
        </h1>

        <Formik
        validationSchema={signinSchema}
        initialValues={{email:"",password:""}}
        onSubmit={(val)=>{
            signinMutation.mutate(val)
        }}
        >
          {({ values ,handleChange ,handleBlur}) => {
            return (
              <Form>
                
                <input
                  type="text"
                  placeholder="Email"
                  name="email"
                  className="w-full border border-slate-100 rounded-2xl p-2 mt-2 placeholder:text-[0.8rem]"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage name="email" component="p" className="text-red-500 text-[0.6rem] ps-2" />
                <input
                  type="text"
                  placeholder="Password"
                  name="password"
                  className="w-full border border-slate-100 rounded-2xl p-2 mt-2 placeholder:text-[0.8rem]"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage name="email" component="p" className="text-red-500 text-[0.6rem] ps-2" />

                <div className="mt-9 flex justify-center items-center">
                  <button type="submit" className="bg-orange-600 text-white p-3 rounded-2xl w-[90%] cursor-pointer flex justify-center items-center">
                    Sign In
                    {
                        signinMutation.isLoading && <Loader/>
                    }
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>

        <div className="mt-9 flex justify-center items-center text-[0.7rem] text-gray-300 gap-2">
          <hr className="flex-1" /> <span>OR</span> <hr className="flex-1" />
        </div>

        <div className="mt-3 flex justify-center items-center text-[0.7rem]">
          Don't have an account?{" "}
          <Link to={"/signup"} className="hover:text-orange-600 ms-3">
            Signup
          </Link>
        </div>
      </article>
    </section>
  );
};

export default SignIn;
