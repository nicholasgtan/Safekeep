import { Form, Formik } from "formik";
import CustomInput from "./Formik/CustomInput";
import axios from "axios";
import { loginSchema } from "./Formik/yup.schema";
import { Dispatch, SetStateAction, useState } from "react";

interface NavStatusProps {
    setStatus: Dispatch<SetStateAction<string>>;
  }

const Login = ({ setStatus }: NavStatusProps) => {

interface SessionData {
    cookie?: unknown;
    authenticated: boolean;
    currentUserName: string;
    currentUserId: string;
    role: string;
    msg: string;
}

interface LoginFormValues {
    email: string;
    password: string;
}

const [loading, setLoading] = useState<boolean>(false);

const handleLogin = async (values : LoginFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
        setLoading(true);
        const { data } = await axios.post<SessionData>("/api/session", 
        values, 
        { headers: { 
            "Content-Type": "application/json", 
            Accept: "application/json", }
        })
        console.log(JSON.stringify(data, null, 4));
        setLoading(false);
        if (data.authenticated === true) {
            const loginStatus = data.msg.toLowerCase();
            if (data.role === "admin") {
                setStatus("Welcome " + data.currentUserName + " (" + data.role + "), you are now " + loginStatus + ".");
                } else {
                setStatus("Welcome " + data.currentUserName + ", you are now " + loginStatus + ".")
                }
            }
            return data;
        } catch (error) {
        setLoading(false);
        if (axios.isAxiosError(error)) {
            console.log('error message: ', error.response?.data.msg);
            setStatus(error.response?.data.msg);
            // 👇️ error: AxiosError<any, any>
            return error.message;
          } else {
            console.log('unexpected error: ', error);
            setStatus('An unexpected error occurred');
            return 'An unexpected error occurred';
          }
        }
    }


const initialValues: LoginFormValues = {
    email: "",
    password: "",
}
    return (
    <div>
        <Formik
          initialValues={initialValues}
          validationSchema={loginSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting }) => (
            <Form autoComplete="off" style={{display: "flex", gap: "0.2rem"}}>
              <CustomInput
                label="Email"
                name="email"
                type="email"
                placeholder="Your Email"
                style={{display: "flex"}}
              />
              <br />
              <CustomInput
                label="Password"
                name="password"
                type="password"
                placeholder="Your Password"
              />
              <br />
              <button
                disabled={isSubmitting}
                type="submit"
                >
                {loading ? <>Loading...</> : <>Log In</>}
              </button>
            </Form>
          )}
        </Formik>
    </div>
    )
}

export default Login;