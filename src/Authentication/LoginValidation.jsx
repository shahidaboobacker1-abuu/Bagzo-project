import * as Yup from 'yup'

export const LoginValidation = Yup.object({
    email: Yup.string().email("Please Enter valied email").required("Please Enter Email"),
    password: Yup.string().min(5).required("Please Enter Password"),
})