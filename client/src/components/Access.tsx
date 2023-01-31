import { Box, Typography, Button, MenuItem } from "@mui/material";
import { Form, Formik, FormikHelpers, FormikValues } from "formik";
import CustomSelect from "./Formik/CustomSelect";
import CustomInput from "./Formik/CustomInput";
import { useContext, useEffect, useState } from "react";
import AuthAPI from "../utils/AuthAPI";
import axios from "axios";
import { clientSchema, userSchema } from "./Formik/yup.schema";
import { Client } from "./Clients";

interface newClient extends FormikValues {
  name: string;
  type: string;
  accountRepId: string;
}

interface newUser extends FormikValues {
  userClientId: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

const Access = () => {
  const { session } = useContext(AuthAPI);
  const [clientStatus, setClientStatus] = useState("");
  const [userStatus, setUserStatus] = useState("");
  const [clientList, setClientList] = useState<Client[]>([]);
  const [loadClientList, setLoadClientList] = useState<boolean>(false);
  const [render, setRender] = useState(0);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoadClientList(true);
        const { data } = await axios.get<Client[]>(
          `/api/clients/all/${session.currentUserId}`
        );
        if (!data) {
          setLoadClientList(false);
          throw new Error("Network Error");
        }
        if (data !== null) {
          setClientList(data);
          setLoadClientList(false);
        }
        return data;
      } catch (error) {
        setLoadClientList(false);
        if (axios.isAxiosError(error)) {
          console.log("error message: ", error.response?.data.msg);
          // setStatus(error.response?.data.msg);
          // 👇️ error: AxiosError<any, any>
          return error.message;
        } else {
          // console.log("unexpected error: ", error);
          return "An unexpected error occurred";
        }
      }
    };
    fetchClients();
  }, [session.currentUserId, setLoadClientList, render]);

  const clientListMap = clientList.map((option: Client) => {
    return (
      <MenuItem key={option.id} value={option.id}>
        {option.name}
      </MenuItem>
    );
  });

  const handleCreateClient = async (
    values: newClient,
    actions: FormikHelpers<newClient>
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      const { data } = await axios.post(
        "/api/clients/auto",
        {
          name: values.name,
          type: values.type,
          accountRepId: values.accountRepId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      if (!data) {
        throw new Error("Network Error");
      }
      if (data !== null) {
        setClientStatus("Client successfully created");
        setRender(render + 1);
        actions.resetForm();
      }
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("error message: ", error.response?.data.msg);
        // setStatus(error.response?.data.msg);
        // 👇️ error: AxiosError<any, any>
        return error.message;
      } else {
        // console.log("unexpected error: ", error);
        return "An unexpected error occurred";
      }
    }
  };

  const handleCreateUser = async (
    values: newUser,
    actions: FormikHelpers<newUser>
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      const { data } = await axios.post(
        "/api/users/",
        {
          email: values.email,
          firstName: values.firstName,
          lastName: values.lastName,
          password: values.password,
          userClientId: values.userClientId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      if (!data) {
        throw new Error("Network Error");
      }
      if (data !== null) {
        setUserStatus("User successfully created");
        actions.resetForm();
      }
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("error message: ", error.response?.data.msg);
        // setStatus(error.response?.data.msg);
        // 👇️ error: AxiosError<any, any>
        return error.message;
      } else {
        // console.log("unexpected error: ", error);
        return "An unexpected error occurred";
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "65vh",
        gap: "1rem",
        flexDirection: "column",
        // border: "solid 1px #121212",
      }}
    >
      <Typography variant="h3">Access</Typography>
      <Box sx={{ display: "flex" }}>
        <Box sx={{ width: "30%" }}>
          <Typography variant="h5">Create New Client</Typography>
          <br />
          <Formik
            initialValues={{
              name: "",
              type: "",
              accountRepId: session.currentUserId,
            }}
            validationSchema={clientSchema}
            onSubmit={handleCreateClient}
          >
            {({ isSubmitting }) => (
              <Form
                autoComplete="off"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  // width: "60%",
                }}
              >
                <Box sx={{ height: "8.5vh" }}>
                  <CustomInput
                    label="Client Name"
                    name="name"
                    type="text"
                    style={{ width: "60%" }}
                  />
                </Box>
                <Box sx={{ height: "8.5vh" }}>
                  <CustomInput
                    label="Client Type"
                    name="type"
                    type="text"
                    style={{ width: "60%" }}
                  />
                </Box>
                <input
                  name="accountRepId"
                  type="hidden"
                  defaultValue={session.currentUserId}
                />

                <Button
                  variant="contained"
                  disabled={isSubmitting}
                  type="submit"
                  sx={{ height: "36px", width: "110px" }}
                >
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
          <br />
          <Typography variant="body2">{clientStatus}</Typography>
        </Box>
        <Box sx={{ width: "30%" }}>
          <Typography variant="h5">Create User</Typography>
          <br />
          <Formik
            initialValues={{
              userClientId: "",
              email: "",
              firstName: "",
              lastName: "",
              password: "",
            }}
            validationSchema={userSchema}
            onSubmit={handleCreateUser}
          >
            {({ isSubmitting }) => (
              <Form
                autoComplete="off"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  // width: "60%",
                }}
              >
                <Box sx={{ height: "8.5vh" }}>
                  <CustomSelect
                    label={
                      loadClientList ? "Retrieving your clients..." : "Client"
                    }
                    select={true}
                    name="userClientId"
                    style={{ width: "60%" }}
                  >
                    {clientListMap}
                  </CustomSelect>
                </Box>
                <Box sx={{ height: "8.5vh" }}>
                  <CustomInput
                    label="Email"
                    name="email"
                    type="text"
                    style={{ width: "60%" }}
                  />
                </Box>
                <Box sx={{ height: "8.5vh" }}>
                  <CustomInput
                    label="First Name"
                    name="firstName"
                    type="text"
                    style={{ width: "60%" }}
                  />
                </Box>
                <Box sx={{ height: "8.5vh" }}>
                  <CustomInput
                    label="Last Name"
                    name="lastName"
                    type="text"
                    style={{ width: "60%" }}
                  />
                </Box>
                <Box sx={{ height: "8.5vh" }}>
                  <CustomInput
                    label="Password"
                    name="password"
                    type="text"
                    style={{ width: "60%" }}
                  />
                </Box>
                <Button
                  variant="contained"
                  disabled={isSubmitting}
                  type="submit"
                  sx={{ height: "36px", width: "110px" }}
                >
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
          <br />
          <Typography variant="body2">{userStatus}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Access;
