import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRegisterUserMutation } from "../services/api";
import { useFormik } from "formik";
import { signUpSchema } from "../schema";

// react-toastify - navigate sang trang khác nó sẽ biến mất khỏi khung hình, ko như sweet alert
const notifyError = (content) => toast.error(content);
const notifyWarn = (content) => toast.warn(content);
const notifySuccess = (content) => toast.success(content);
const notifyInfo = (content) => toast.info(content);

const SignUp = () => {
  const navigate = useNavigate();
  const [registerUser, { isLoading, error,isError }] = useRegisterUserMutation();
  console.log(isError,error,'new finf')

  // state image
  const [image, setImage] = useState(null);
  const [uploadImgLoading, setUploadImgLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // validate Image
  const checkImage = (e) => {
    const file = e.target.files[0];
    if (file && file.size >= 1048576) {
      return notifyError("Max file size is 1MB");
    } else {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const upLoadImage = async (image) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "d0ue6twg");
    try {
      setUploadImgLoading(true);
      let res = await fetch(
        "https://api.cloudinary.com/v1_1/driba3vfy/image/upload",
        {
          method: "post",
          body: data,
        }
      );
      const urlData = await res.json();
      setUploadImgLoading(false);
      return urlData.url;
    } catch (err) {
      setUploadImgLoading(false);
      console.log(err);
    }
  };

  // formik - validation
  const onSubmit = async (values, actions) => {
    console.log(values);
    console.log(actions);
    let { email, password, name } = values;
    // clear các ô input sau 1 giây nhấn submit

    if (!image) return notifyWarn("Please upload your avatar");
    const url = await upLoadImage(image);
    // lấy được cái url từ tk cloudinary chỗ này
    // console.log(url);

    //
    registerUser({ name, email, password, avatar: url })
      .then(({ data }) => {
        if (data) {
          navigate("/login");
        }
      })
      .catch((error) => {
        // Handle the error here
        console.error(error);
      });
      error && notifyError(error.data)
    // actions.resetForm();
  };

  const {
    values,
    errors,
    handleChange,
    touched,
    handleBlur,
    handleSubmit,
    isSubmitting,
  } = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: signUpSchema,
    onSubmit,
  });
  return (
    <div className="pt-6">
      <div className="w-full max-w-lg mx-auto p-8 space-y-3 rounded-xl bg-white shadow-xl">
        <h1 className="text-2xl font-bold text-center">Create new account</h1>
        <form
          className="space-y-6 ng-untouched ng-pristine ng-valid"
          onSubmit={handleSubmit}
        >
          <div className=" flex justify-center">
            <div className="relative">
              <div className="rounded-full">
                <img
                  className="rounded-full border-2 border-primary object-cover overflow-hidden w-20 h-20"
                  src={imagePreview || "./img/avatar.jpg"}
                  alt="1"
                />
              </div>
              <label
                htmlFor="image_upload"
                className="bg-green-500 hover:bg-green-600 p-1 rounded-full absolute leading-4 -bottom-2 right-1 border border-black cursor-pointer "
              >
                ➕
              </label>
              {/* input file -> accept file image/png image/jpeg */}
              <input
                type="file"
                id="image_upload"
                className="hidden"
                accept="image/png , image/jpeg"
                onChange={(event) => checkImage(event)}
              />
            </div>
          </div>
          <div className="flex justify-between gap-3 flex-col md:flex-row">
            <div className="space-y-1 text-sm w-full ">
              <label htmlFor="username" className="block ">
                Username
              </label>
              <input
                className={
                  errors.name && touched.name
                    ? "w-full px-4 py-3 rounded-md bg-gray-200/70 !border-red-500 !bg-red-100"
                    : "w-full px-4 py-3 rounded-md bg-gray-200/70"
                }
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                type="text"
                name="name"
                id="name"
                placeholder="Username"
              />
              <div className="!m-0 h-1">
                {errors.name && touched.name && (
                  <span className="text-red-500 text-xs">{errors.name}</span>
                )}
              </div>
            </div>

            <div className="space-y-1 text-sm w-full">
              <label htmlFor="username" className="block ">
                Email
              </label>
              <input
                type="text"
                placeholder="Email"
                className={
                  errors.email && touched.email
                    ? "w-full px-4 py-3 rounded-md bg-gray-200/70 !border-red-500 !bg-red-100"
                    : "w-full px-4 py-3 rounded-md bg-gray-200/70"
                }
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                name="email"
                id="email"
              />
              <div className="!m-0 h-1">
                {errors.email && touched.email && (
                  <span className="text-red-500 text-xs">{errors.email}</span>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-1 text-sm">
            <label htmlFor="password" className="block ">
              Password
            </label>
            <input
              type="password"
              placeholder="Password"
              className={
                errors.password && touched.password
                  ? "w-full px-4 py-3 rounded-md bg-gray-200/70 !border-red-500 !bg-red-100"
                  : "w-full px-4 py-3 rounded-md bg-gray-200/70"
              }
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              name="password"
              autoComplete="off"
              id="password"
            />
            <div className="!m-0 h-1">
              {errors.password && touched.password && (
                <span className="text-red-500 text-xs">{errors.password}</span>
              )}
            </div>
          </div>
          <div className="space-y-1 text-sm !mb-8">
            <label htmlFor="confirmPassword" className="block ">
              Confirm password
            </label>
            <input
              type="password"
              placeholder="Confirm password"
              className={
                errors.confirmPassword && touched.confirmPassword
                  ? "w-full px-4 py-3 rounded-md bg-gray-200/70 !border-red-500 !bg-red-100"
                  : "w-full px-4 py-3 rounded-md bg-gray-200/70"
              }
              value={values.confirmPassword}
              autoComplete="off"
              onChange={handleChange}
              onBlur={handleBlur}
              name="confirmPassword"
              id="confirmPassword"
            />
            <div className="!m-0 h-1">
              {errors.confirmPassword && touched.confirmPassword && (
                <span className="text-red-500 text-xs">
                  {errors.confirmPassword}
                </span>
              )}
            </div>
          </div>
          {!uploadImgLoading ? (
            <button className="block w-full p-3 text-center rounded-lg bg-primary hover:bg-secondary text-white ">
              Sign up
            </button>
          ) : (
            <button
              type="button"
              className="bg-primary flex gap-1 justify-center text-white w-full p-3 text-center rounded-lg cursor-not-allowed opacity-30"
              disabled
            >
              <svg
                className="animate-spin h-5 w-5 mr-3 ..."
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-10"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </button>
          )}
        </form>

        <p className="text-sm text-center ">
          <span>You have an account? </span>
          <NavLink to="/login" className="underline ">
            Login here
          </NavLink>
        </p>
      </div>

      {/* Toast of  react-toastify */}
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default SignUp;
