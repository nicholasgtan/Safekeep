import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import WaterfallChartIcon from "@mui/icons-material/WaterfallChart";
import PeopleIcon from "@mui/icons-material/People";
import KeyIcon from "@mui/icons-material/Key";
import AuthAPI from "../../utils/AuthAPI";
import React, { useState, useContext, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import LoadingAPI from "../../utils/LoadingAPI";

const drawerWidth = 255;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const [open, setOpen] = useState<boolean>(true);
  const [title, setTitle] = useState<string>("Dashboard");
  const [loading, setLoading] = useState<boolean>(false);

  const { session } = useContext(AuthAPI);

  useEffect(() => {
    if (session.role === "admin") {
      setTitle("Client");
    }
  }, [session.role]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleTitle = (event: React.MouseEvent) => {
    const title = (event.target as HTMLElement).innerText;
    setTitle(title);
  };

  const standardDashboard = [
    { name: "Dashboard", icon: DashboardIcon, navi: "" },
    {
      name: "Account Balance",
      icon: AccountBalanceIcon,
      navi: "account",
    },
    {
      name: "Trades",
      icon: WaterfallChartIcon,
      navi: "trades",
    },
  ];

  const adminDashboard = [
    { name: "Clients", icon: PeopleIcon, navi: "clients" },
    {
      name: "Access",
      icon: KeyIcon,
      navi: "access",
    },
  ];

  return (
    <Box sx={{ display: "flex", height: "75vh" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        sx={{ backgroundColor: "#222222", top: "103px" }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ color: "#FFF" }}
          >
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          top: "103px",
          height: "75.5vh",
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            top: "103px",
            height: "75.5vh",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        {session.role !== "admin" ? (
          <List>
            {standardDashboard.map((list) => (
              <NavLink
                to={`/dashboard/${list.navi}`}
                style={{ textDecoration: "none", color: "inherit" }}
                key={list.navi}
              >
                <ListItem disablePadding>
                  <ListItemButton onClick={handleTitle}>
                    <ListItemIcon>
                      <list.icon />
                    </ListItemIcon>
                    <ListItemText primary={list.name} />
                  </ListItemButton>
                </ListItem>
              </NavLink>
            ))}
          </List>
        ) : (
          <>
            <Divider />
            <List>
              {adminDashboard.map((list) => (
                <NavLink
                  to={`/dashboard/${list.navi}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                  key={list.navi}
                >
                  <ListItem key={list.navi} disablePadding>
                    <ListItemButton onClick={handleTitle}>
                      <ListItemIcon>
                        <list.icon />
                      </ListItemIcon>
                      <ListItemText primary={list.name} />
                    </ListItemButton>
                  </ListItem>
                </NavLink>
              ))}
            </List>
          </>
        )}
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <LoadingAPI.Provider value={{ loading, setLoading }}>
          <Outlet />
        </LoadingAPI.Provider>
      </Main>
    </Box>
  );
}
