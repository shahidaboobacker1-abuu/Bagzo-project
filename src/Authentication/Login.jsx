import { Formik, Field, Form, ErrorMessage } from "formik";
import { LoginValidation } from "./LoginValidation";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthProvider";

const initialValues = {
    email: '',
    password: '',
}

function Login() {
    const navigate = useNavigate();
    const { login, loading, error, clearError } = useAuth();

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        console.log("Login attempt with:", values);
        clearError();
        
        const result = await login(values.email, values.password);
        
        if (result.success) {
            alert("Login successful!");
            resetForm();
            
            // Check user role and redirect accordingly
            const user = result.user;
            if (user.role === 'admin' || user.isAdmin === true) {
                navigate("/adminhome"); // Redirect to admin dashboard
            } else {
                navigate("/"); // Redirect to user homepage
            }
        }
        
        setSubmitting(false);
    };

    const goToRegister = () => {
        navigate("/register");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F4E1] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-[#E0D6C2]">
                <div className="text-center">
                    <h2 className="text-4xl font-light text-[#2C1810] mb-4 tracking-wide">
                        SIGN IN
                    </h2>
                    <div className="w-20 h-0.5 bg-[#AF8F6F] mx-auto mb-6"></div>
                    <p className="text-sm text-[#5A4738] font-light tracking-wide">
                        Use your registered email and password
                    </p>
                </div>
                
                <Formik
                    initialValues={initialValues}
                    validationSchema={LoginValidation}
                    onSubmit={handleSubmit}
                    validateOnMount={false}
                    validateOnChange={true}
                    validateOnBlur={true}
                >
                    {({ errors, touched, isSubmitting, isValid, dirty }) => (
                        <Form className="mt-8 space-y-8">
                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg text-center">
                                    <p className="text-sm font-light">{error}</p>
                                </div>
                            )}

                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-light text-[#5A4738] mb-3 tracking-wide">
                                        EMAIL ADDRESS
                                    </label>
                                    <Field 
                                        id="email"
                                        type="email" 
                                        placeholder="Enter your email" 
                                        name="email"
                                        className={`w-full px-6 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AF8F6F] focus:border-[#AF8F6F] bg-white text-[#2C1810] placeholder-[#AF8F6F]/50 transition-all duration-300 ${
                                            errors.email && touched.email 
                                                ? 'border-red-500' 
                                                : 'border-[#E0D6C2]'
                                        }`}
                                    />
                                    <ErrorMessage 
                                        name="email" 
                                        component="div" 
                                        className="text-red-600 text-sm mt-2 font-light"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-light text-[#5A4738] mb-3 tracking-wide">
                                        PASSWORD
                                    </label>
                                    <Field 
                                        id="password"
                                        type="password" 
                                        placeholder="Enter your password" 
                                        name="password"
                                        className={`w-full px-6 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AF8F6F] focus:border-[#AF8F6F] bg-white text-[#2C1810] placeholder-[#AF8F6F]/50 transition-all duration-300 ${
                                            errors.password && touched.password 
                                                ? 'border-red-500' 
                                                : 'border-[#E0D6C2]'
                                        }`}
                                    />
                                    <ErrorMessage 
                                        name="password" 
                                        component="div" 
                                        className="text-red-600 text-sm mt-2 font-light"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !isValid || !dirty || loading}
                                    className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-lg font-light rounded-xl text-white bg-[#2C1810] hover:bg-[#AF8F6F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#AF8F6F] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl tracking-wide"
                                >
                                    {(isSubmitting || loading) ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            SIGNING IN...
                                        </span>
                                    ) : (
                                        "SIGN IN"
                                    )}
                                </button>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                                <button 
                                    type="button"
                                    className="font-light text-[#AF8F6F] hover:text-[#5A4738] transition-colors duration-300 tracking-wide"
                                >
                                    FORGOT YOUR PASSWORD?
                                </button>
                            </div>

                            <div className="text-center pt-6 border-t border-[#E0D6C2]">
                                <p className="text-sm text-[#5A4738] font-light tracking-wide">
                                    DON'T HAVE AN ACCOUNT?{' '}
                                    <button
                                        type="button"
                                        onClick={goToRegister}
                                        className="font-light text-[#AF8F6F] hover:text-[#5A4738] underline transition-colors duration-300"
                                    >
                                        SIGN UP
                                    </button>
                                </p>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}

export default Login;

