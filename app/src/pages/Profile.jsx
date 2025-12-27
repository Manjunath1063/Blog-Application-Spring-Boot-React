import React, { useEffect, useRef, useState } from "react";
import { axiosInstance, getErrorMessage } from "../utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MdDelete } from "react-icons/md";
import { ErrorMessage, Form, Formik } from "formik";
import { signupSchema, userUpdateSchema } from "../formikValidation";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";

const Profile = () => {
  const DEFAULT_USER_IMG =
    "https://static.vecteezy.com/system/resources/previews/024/983/914/non_2x/simple-user-default-icon-free-png.png";


    const queryCient = useQueryClient();

  const PROFILE_INPUT_REF = useRef(null);

  const [profileImg, setProfileImg] = useState("");
  const [userImg, setUserImg] = useState(null);

  const { id: USER_ID } = JSON.parse(sessionStorage.getItem("profile")) || {};

  const fetchProfile = async () => {
    const response = await axiosInstance.get(`/user/public/profile/${USER_ID}`);
    return response.data;
  };

  const { data: USER_PROFILE_RESPONSE, isLoading: USER_PROFILE_LOADING } =
    useQuery({
      queryKey: ["user-profile-info"],
      queryFn: fetchProfile,
      enabled: sessionStorage.getItem("profile") ? true : false,
    });

  const updateProfile = async (val) => {
    const formData = new FormData();
    for (const key in val) {
      formData.append(key, val[key]);
    }

    const res = await axiosInstance.put(`/user/secure/update`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", 
      },
    });
    return res.data;
  };

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    mutationKey: "user-update",
    onSuccess: (result) => {
      toast.success("Profile updated Successfully");
      setProfileImg("")
      queryCient.invalidateQueries(["user-profile-info"])
    },
    onError: (error) => {
      console.log(error);
      toast.error(getErrorMessage(error));
    },
  });

  const { data: USER_DATA } = USER_PROFILE_RESPONSE || {};


  useEffect(()=>{
      
       if(USER_DATA?.img)
       {
        setUserImg(USER_DATA?.img)
       }

  },[USER_DATA])

  const handleProfileClick = () => {
    console.log(PROFILE_INPUT_REF.current);

    PROFILE_INPUT_REF.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserImg("")
      setProfileImg(file); // Store the preview URL
    }
  };

  const handleImageRemove = (e) => {
    e.stopPropagation();
    setProfileImg("");
    setUserImg("");
  };



  if(USER_PROFILE_LOADING)
  {

    return <PageLoader/>
  }


  

  return (
    <section className="w-full min-h-[80vh] font-outfit p-2 flex justify-center items-start">
      <article className="w-full max-w-[400px] rounded-2xl shadow p-3">
        <h1 className="text-2xl text-center">Your Profile</h1>

        <div
          className=" w-[150px] h-[150px]  relative cursor-pointer   mx-auto  p-2"
          
        >
          <input
            type="file"
            className="hidden"
            ref={PROFILE_INPUT_REF}
            accept="image/*"
            onChange={handleImageChange}
          />

          <img
            src={
              userImg ? userImg : profileImg ? URL.createObjectURL(profileImg) : DEFAULT_USER_IMG
            }
            alt=""
            className="absolute rounded-full shadow w-[90%] h-[90%] "
            onClick={handleProfileClick}
          />
          {(profileImg || userImg ) && (
            <MdDelete
              className="absolute bottom-3 right-2"
              onClick={handleImageRemove}
            />
          )}
        </div>

        <Formik
          validationSchema={userUpdateSchema}
          initialValues={{ name: USER_DATA?.name, email: USER_DATA?.email }}
          enableReinitialize
          onSubmit={(val) => {
            const updateData = {
              userId: USER_DATA?.id,
              ...val,
              img: profileImg ? profileImg :null,
              isChanged :  userImg ? "false" :"true"
            };
            // console.log(updateData)
            updateMutation.mutate(updateData);
          }}
        >
          {({ values, handleChange, handleBlur }) => {
            return (
              <Form>
                <input
                  type="text"
                  placeholder="Name"
                  name="name"
                  className="w-full border border-slate-100 rounded-2xl p-2 placeholder:text-[0.8rem]"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-500 text-[0.6rem] ps-2"
                />
                <input
                  type="text"
                  placeholder="Email"
                  name="email"
                  className="w-full border border-slate-100 rounded-2xl p-2 mt-2 placeholder:text-[0.8rem]"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  readOnly
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-500 text-[0.6rem] ps-2"
                />

                <div className="mt-9 flex justify-center items-center">
                  <button
                    disabled={updateMutation.isPending}
                    type="submit"
                    className="bg-orange-600  text-white p-3 rounded-2xl w-[90%] cursor-pointer flex justify-center items-center"
                  >
                    Update{" "}
                    {updateMutation.isPending && (
                      <Loader className="text-white" />
                    )}
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </article>
    </section>
  );
};

export default Profile;
