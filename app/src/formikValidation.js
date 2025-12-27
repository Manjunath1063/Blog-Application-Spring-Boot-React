import * as Yup from "yup";

export const signupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  email: Yup.string()
    .email("Invalid email")
    .required("Required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Required"),
});

export const signinSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email")
      .required("Required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Required"),
  });


  export const blogSchema = Yup.object().shape({
    title: Yup.string()
      .min(5, "Title must be at least 5 characters")
      .max(100, "Title too long")
      .required("Required"),
    img: Yup.string()
      .url("Invalid URL")
      .required("Required"),
    content: Yup.string()
      .min(20, "Content must be at least 20 characters")
      .required("Required"),
      hashTags: Yup.string()
  .matches(/^([a-zA-Z0-9]+)(,\s?[a-zA-Z0-9]+)*$/, "Invalid format (e.g., tag1, tag2, tag3)")
  .required("At least one hashtag is required"),

    
  });



  export const userUpdateSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),
    email: Yup.string()
      .email("Invalid email")
      .required("Required"),
  });
  