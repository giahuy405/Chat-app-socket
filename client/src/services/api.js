import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5001" }),
  reducerPath: "adminApi",
  tagTypes: ["Login", "Register"],
  endpoints: (build) => ({
    registerUser: build.mutation({
      query: (payload) => ({
        url: "/user/register",
        method: "POST",
        body: payload,
      }),
      providesTags: ["Register"],
    }),
    loginUser: build.mutation({
      query: (payload) => ({
        url: "/user/login",
        method: "POST",
        body: payload,
      }),
      providesTags: ["Login"],
    }),
    logoutUser: build.mutation({
      query: (payload) => ({
        url: "/user/logout",
        method: "DELETE",
        body: payload,
      }),
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useLogoutUserMutation,
} = api;
