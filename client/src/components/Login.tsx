import { Form, Formik } from "formik";
import CustomInput from "./Formik/CustomInput";
import axios from "axios";
import { loginSchema } from "./Formik/yup.schema";
import { Dispatch, SetStateAction } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useContext } from "react";
import AuthAPI from "../utils/AuthAPI";
import { useNavigate } from "react-router-dom";

interface NavStatusProps {
  setStatus: Dispatch<SetStateAction<string>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
}

const Login = ({ setStatus, loading, setLoading }: NavStatusProps) => {
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

  const { setSession } = useContext(AuthAPI);
  const navigate = useNavigate();

  const handleLogin = async (values: LoginFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      setLoading(true);
      const { data } = await axios.post<SessionData>("/api/session", values, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      // console.log(JSON.stringify(data, null, 4));
      setLoading(false);
      if (data.authenticated === true) {
        const loginStatus = data.msg.toLowerCase();
        setSession(data);
        if (data.role === "admin") {
          setStatus(
            "Welcome " +
              data.currentUserName +
              " (" +
              data.role +
              "), you are now " +
              loginStatus +
              "."
          );
          navigate("/dashboard");
        } else {
          setStatus(
            "Welcome " +
              data.currentUserName +
              ", you are now " +
              loginStatus +
              "."
          );
          navigate("/dashboard");
        }
      }
      return data;
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        // console.log("error message: ", error.response?.data.msg);
        setStatus(error.response?.data.msg);
        // 👇️ error: AxiosError<any, any>
        return error.message;
      } else {
        // console.log("unexpected error: ", error);
        setStatus("An unexpected error occurred");
        return "An unexpected error occurred";
      }
    }
  };

  const initialValues: LoginFormValues = {
    email: "",
    password: "",
  };
  return (
    <Box color="secondary" sx={{ height: "32px" }}>
      <Formik
        initialValues={initialValues}
        validationSchema={loginSchema}
        onSubmit={handleLogin}
      >
        {({ isSubmitting }) => (
          <Form autoComplete="off" style={{ display: "flex", gap: "0.2rem" }}>
            <CustomInput
              label="Email"
              name="email"
              type="email"
              placeholder="Email"
            />
            <br />
            <CustomInput
              label="Password"
              name="password"
              type="password"
              placeholder="Password"
            />
            <br />
            <Button
              variant="contained"
              disabled={isSubmitting}
              type="submit"
              sx={{ height: "36px" }}
            >
              {loading ? <>Loading...</> : <>Log In</>}
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default Login;
