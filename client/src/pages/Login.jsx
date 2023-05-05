import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../services/api";
import { loginSchema } from "../schema";
import { useFormik } from "formik";
import { ToastContainer, toast } from "react-toastify";
import { AppContext } from "../context/appContext";
import { useSelector } from "react-redux";
// react-toastify
const notifyError = (content) => toast.error(content);
const notifyWarn = (content) => toast.warn(content);
const notifySuccess = (content) => toast.success(content);
const notifyInfo = (content) => toast.info(content);

const Login = () => {
  const navigate = useNavigate();
  const user = useSelector(state=>state.user)
  // sử dụng socket
  const { socket } = useContext(AppContext);
  const [loginUser, { isLoading, error }] = useLoginUserMutation();

  const onSubmit = async (values, actions) => {
    console.log(values);
    console.log(actions);
    let { email, password } = values;
    // clear các ô input sau 1 giây nhấn submit
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    loginUser({ email, password }).then(({ data }) => {
      if (data) {
        socket.emit("new-user");

        !isLoading && navigate("/chat");
      } else {
        notifyError("Password or email is incorrect");
      }
    });
    error && notifyError(error.data);
    actions.resetForm();
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
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit,
  });
  // login rồi thì phải vô chat ko dc quay lại đây
  useEffect(()=>{
    if(user) return navigate('/chat') 
  },[user])
  return (
    <div className="pt-16">
      <div className="w-full max-w-md mx-auto p-8 space-y-3 rounded-xl bg-white shadow-xl">
        <h1 className="text-2xl font-bold text-center">Welcome back!</h1>
        <form
          className="space-y-6 ng-untouched ng-pristine ng-valid"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <div className="space-y-1 text-sm">
            <label htmlFor="username" className="block ">
              Username
            </label>
            <input
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
              type="text"
              placeholder="Email"
            />
            <div className="!m-0 h-1">
              {errors.email && touched.email && (
                <span className="text-red-500 text-xs">{errors.email}</span>
              )}
            </div>
          </div>
          <div className="space-y-1 text-sm">
            <label htmlFor="password" className="block ">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={values.password}
              placeholder="Password"
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="true"
              className={
                errors.password && touched.password
                  ? "w-full px-4 py-3 rounded-md bg-gray-200/70 !border-red-500 !bg-red-100"
                  : "w-full px-4 py-3 rounded-md bg-gray-200/70"
              }
            />
            <div className="mt-0 h-5">
              {errors.password && touched.password && (
                <span className="text-red-500 text-xs">{errors.password}</span>
              )}
            </div>
          </div>
          <button
            disabled={isSubmitting}
            className={`block w-full p-3 text-center rounded-lg bg-primary hover:bg-secondary text-white flex justify-center items-center ${
              isSubmitting && "opacity-30 cursor-not-allowed "
            }`}
          >
            {isSubmitting && (
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
            )}{" "}
            Login
          </button>
        </form>

        <p className="text-sm text-center ">
          <span> Don't have an account? </span>
          <NavLink to="/register" className="underline ">
            Create right now!
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

export default Login;
