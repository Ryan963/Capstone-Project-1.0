import React from "react";
import { Link, useNavigate } from "react-router-dom";

import { styled, createTheme } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import ReactDOM from "react-dom";
import {
  Grid,
  Box,
  Drawer,
  CssBaseline,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemText,
  ListItemIcon,
  ThemeProvider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import RecommendIcon from "@mui/icons-material/Recommend";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import ProfileBoxIcon from "@mui/icons-material/AccountBox";
import LogoutIcon from "@mui/icons-material/Logout";
import styles from "../../styles/Layout.module.css";
import "../../styles/userHome.css";
import ProgressLine from "../../components/homePageComponents/ProgressLine";
import { toast } from "react-toastify";
import axios from "axios";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useState, useEffect } from "react";
import useUser from "../../hooks/useUser";

const drawerWidth = 200;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
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
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
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

export default function UserHome() {
  const token = localStorage.getItem("token");
  //const theme = useTheme();
  //const userEmail = localStorage.getItem("email");
  const userType = localStorage.getItem("type");
  const navigate = useNavigate();
  const [breadths, setBreadths] = useState([]);
  const [majors, setMajors] = useState([]);
  const [minors, setMinors] = useState([]);
  const [user, setuser] = useUser({});
  const [progress, setProgress] = useState([]);
  const [degreePercent, setDegreePercent] = useState("");
  // logs out the user not matter what type he is
  const logout = () => {
    localStorage.clear();
    // navigate user back based on user type
    if (userType.toLowerCase() === "user") {
      navigate("/login");
    } else if (userType === "admin") {
      navigate("/admin/login");
    }
  };

  const [open, setOpen] = React.useState(false);

  const getProgress = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .get(`${process.env.REACT_APP_SERVER_API}/progress/degree`, config)
      .then((res) => {
        setProgress(res.data);
      })
      .catch((error) => {
        toast.error(error.message);
        console.log(error);
      });
  };

  const getMajors = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .get(`${process.env.REACT_APP_SERVER_API}/progress/major`, config)
      .then((res) => {
        setMajors(res.data);
      })
      .catch((error) => {
        toast.error(error.message);
        console.log(error);
      });
  };

  const getMinors = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .get(`${process.env.REACT_APP_SERVER_API}/progress/minor`, config)
      .then((res) => {
        setMinors(res.data);
      })
      .catch((error) => {
        toast.error(error.message);
        console.log(error);
      });
  };

  const getBreadth = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .get(`${process.env.REACT_APP_SERVER_API}/progress/breadth`, config)
      .then((res) => {
        setBreadths(res.data);
      })
      .catch((error) => {
        toast.error(error.message);
        console.log(error);
      });
  };

  const getDegreePercent = () => {
    const percB = parseFloat(progress.percentBreadth);
    const percMj = parseFloat(progress.percentMajor);
    const percMn = parseFloat(progress.percentMinor);
    const percDeg = percB + percMj + percMn;
    console.log(percDeg);
    setDegreePercent(percDeg.toString());
  };

  useEffect(() => {
    //Moved to separate function so I can call function in modal and update main page
    getMajors();
    getMinors();
    getProgress();
    getBreadth();
  }, []);

  useEffect(() => {
    //Moved to separate function so I can call function in modal and update main page
    getDegreePercent();
  }, [progress]);

  const theme = createTheme({
    palette: {
      primary: {
        main: "#8B0000",
      },
    },
    components: {
      MuiToolbar: {
        styleOverrides: {
          dense: {
            height: 100,
            minHeight: 100,
          },
        },
      },
    },
  });

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  //Controls Icons and links on the navigation drawer/hamburger menu
  const itemsList = [
    {
      text: "Home",
      icon: <HomeIcon />,
      onClick: () => {
        navigate("../../user/me");
      },
    },
    {
      text: "Recommend",
      icon: <RecommendIcon />,
      onClick: () => {
        navigate("../../user/recommend");
      },
    },
    {
      text: "Courses",
      icon: <SchoolIcon />,
      onClick: () => {
        navigate("../../user/courses");
      },
    },
    {
      text: "Progress",
      icon: <TrendingUpIcon />,
      onClick: () => {
        navigate("../../user/progress");
      },
    },
    {
      text: "Profile",
      icon: <ProfileBoxIcon />,
      onClick: () => {
        navigate("../../user/profile");
      },
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <nav className={styles.userNavbar}>
            <Toolbar variant="dense">
              <Grid container rowSpacing={1} spacing={0}>
                <Grid item xs={1}>
                  <div className="grid-item">
                    <IconButton
                      color="inherit"
                      aria-label="open drawer"
                      onClick={handleDrawerOpen}
                      edge="start"
                      sx={{ mr: 2, ...(open && { display: "none" }) }}
                    >
                      <MenuIcon />
                    </IconButton>
                  </div>
                </Grid>
                <Grid item xs={10}>
                  <Typography variant="h6" noWrap component="div">
                    {/* <p className="text-xl font-bold">Degree Planner</p> */}
                    <Link to="/dashboard">
                      <strong>Degree Planner</strong>
                    </Link>
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <div>
                    <IconButton
                      color="inherit"
                      aria-label="logout"
                      edge="start"
                      sx={{
                        mr: 2,
                        ...(open && { display: "none" }),
                        alignItems: "center",
                      }}
                      onClick={logout}
                    >
                      <LogoutIcon sx={{ marginLeft: "auto" }} />
                    </IconButton>
                  </div>
                </Grid>
              </Grid>
            </Toolbar>
          </nav>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            boxSizing: "border-box",
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
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
          <List>
            {itemsList.map((item, index) => {
              const { text, icon, onClick } = item;
              return (
                <ListItem button key={text} onClick={onClick}>
                  {icon && <ListItemIcon>{icon}</ListItemIcon>}
                  <ListItemText primary={text} />
                </ListItem>
              );
            })}
          </List>
          <Divider />
        </Drawer>
        {/** Main Body Start */}
        <Main open={open}>
          <DrawerHeader />
          <div className="title ">
            <h1>Hi, {user.firstname}</h1>
            <hr></hr>
          </div>

          {/* TODO: Put Degree, Major, Minor in boxes for better UI */}
          <h3>Degree</h3>
          <p>
            <h4>Percentage finished: {degreePercent} % </h4>
          </p>
          <div className="container info-container">
            <ProgressLine
              // label={
              //   "Breadth: " +
              //   progress.percentBreadth +
              //   "%\n" +
              //   "Major: " +
              //   progress.percentMajor +
              //   "%\n" +
              //   "Minor: " +
              //   progress.percentMinor +
              //   "%"
              // }
              visualParts={[
                {
                  // percentage: progress.percentBreadth,
                  percentage: progress.percentBreadth + "%",
                  color: "gold",
                },
                {
                  percentage: progress.percentMajor + "%",
                  color: "#8B2332",
                },
                {
                  percentage: progress.percentMinor + "%",
                  color: "#1B3768",
                },
              ]}
            />
            <hr></hr>
          </div>
          <div>
            <h3>Breadth</h3>
          </div>
          <h5>Percentage finished: {progress.finishedBreadth} % </h5>
          <p>
            <h5>Percentage towards degree: {progress.percentBreadth} % </h5>
          </p>
          <div className="container info-container">
            {breadths.map((breadth) => (
              <ProgressLine
                label={breadth.description + " " + breadth.percentage + "%"}
                visualParts={[
                  {
                    percentage: breadth.percentage + "%",
                    color: "gold",
                  },
                ]}
              />
            ))}
            <hr></hr>
          </div>

          <div>
            <h3>Major</h3>
          </div>
          <h5>Percentage finished: {progress.finishedMajor} % </h5>
          <h5>Percentage towards degree: {progress.percentMajor} % </h5>
          <div className="container info-container">
            {majors.map((major) => (
              <ProgressLine
                label={major.description + " " + major.percentage + "%"}
                visualParts={[
                  {
                    percentage: major.percentage + "%",
                    color: "#8B2332",
                  },
                ]}
              />
            ))}
            <hr></hr>
          </div>

          <div>
            <h3>Minor</h3>
          </div>
          <h5>Percentage finished: {progress.finishedMinor} % </h5>
          <p>
            <h5>Percentage towards degree: {progress.percentMinor} % </h5>
          </p>
          <div className="container info-container">
            {minors.map((minor) => (
              <ProgressLine
                label={minor.description + " " + minor.percentage + "%"}
                visualParts={[
                  {
                    percentage: minor.percentage + "%",
                    color: "#1B3768",
                  },
                ]}
              />
            ))}
          </div>
        </Main>
      </Box>
    </ThemeProvider>
  );
}
