import * as yup from "yup";

// const passwordRegex = /^[0-9]{5,10}$/;

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Email is invalid")
    .required("Email can not be blank"),
  password: yup
    .string()
    .min(4)
    // .matches(passwordRegex, { message: "Vui lòng nhập mật khẩu mạnh hơn" })
    .required("Password can not be blank"),
});

export const signUpSchema = yup.object().shape({
  name: yup.string().required("Username can not be blank"),
  email: yup
    .string()
    .email("Email is invalid")
    .required("Email can not be blank"),
  password: yup
    .string()
    .min(4)
    // .matches(passwordRegex, { message: "Vui lòng nhập mật khẩu mạnh hơn" })
    .required("Password can not be blank"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Confirm password doesn't match")
    .required("Confirm password can't be blank"),
});
