import * as Yup from 'yup'

export const RegisterValidation = Yup.object({
    name: Yup.string().min(3).required("Please Enter name"),
    email: Yup.string().email("Please Enter valied email").required("Please Enter Email"),
    password: Yup.string().min(5).required("Please Enter password"),
    cpassword: Yup.string().oneOf([Yup.ref("password")], "Password not matched").required("Please Enter cpassword")
})