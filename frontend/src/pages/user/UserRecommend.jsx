import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { styled, createTheme } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
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
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import { useEffect } from "react";
import Loader from "../../components/UI/Loader";
import ViewCourseModal from "../../components/Modals/ViewCourseModal";
import useUser from "../../hooks/useUser"
const drawerWidth = 200;
const Page = {
  Start: 'Start',
  Load: 'Load',
  Recommend: 'Recommend',
};

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



export default function UserRecommend() {
  //const userEmail = localStorage.getItem("email");
  const userType = localStorage.getItem("type");
  const navigate = useNavigate();

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
  const [page, setPage] = React.useState(Page.Start);
  const [recommendedCourses, setRecommendedCourses] = React.useState([]);
  const [currentCourse, setCurrentCourse] = React.useState({});
  const [showCourseModal, setShowCourseModal] = React.useState(false);
  const [user, setUser] = useUser();

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

  const handleRecommend = () => {
    setPage(Page.Load);
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
     axios
      .get(
        `${process.env.REACT_APP_SERVER_API}/recommendations`,
        config
      )
      .then((res) => {
        if (res.data.success) {
          toast.success("Courses have been chosen successfully");
          setRecommendedCourses(res.data.recommendedCourses);
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      });   
  };

  const handleAddCourse = (courseArray) => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .post(
        `${process.env.REACT_APP_SERVER_API}/user/futureCourses`,
        {
          id: user._id,
          futureCourses: courseArray
        },
        config
      )
      .then((res) => {
        if (res.data.success) {
          toast.success("Course(s) added to Future Courses");
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      });
  }

  const handleAddAll = () => {
    let courseArray = [];
    for (var course in recommendedCourses) {
      courseArray.push(recommendedCourses[course].course.name);
    }

    handleAddCourse(courseArray);
  }

  useEffect(() => {
    if (recommendedCourses.length > 0) {
      console.log(recommendedCourses);
      setPage(Page.Recommend);
    }  
  }, [recommendedCourses])
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
                {/* columnSpacing={{xs: 80, sm:150, md:150}} */}
                <Grid item xs={1}>
                  <div class="grid-item">
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
            flexShrink: 0,
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
        <Main open={open}>
          <DrawerHeader />
            {page === Page.Start && (
              <div>
                <div 
                  className="flex justify-center"
                  //style={{ height: `${height > 900 ? "50rem" : "40rem"}` }}
                >
                  <Typography variant="h6" >10 courses will be recommended for you to take, ranked by the number of requirements and prerequisites the course satisfies.</Typography> 
                </div>
                <div class="pt-4 flex justify-center">
                  <Button variant="success" onClick={handleRecommend}>Recommend Courses</Button>
                </div>
              </div>
            )}
            {page === Page.Load && (
              <div>
                <div className="flex justify-center">
                 <span>Building list of courses...</span>
                </div>
                <div class="pt-4 flex justify-center">
                  <Loader />
                </div>
              </div>
            )}
            {page === Page.Recommend && (
              <div>
                
                <div>
                  {recommendedCourses.map((course, idx) => {
                    return(
                      <div 
                        key={idx}
                        className={`flex mt-1 mx-60 p-10 items-center rounded-3xl border  ${
                          idx % 2 === 1 ? "bg-lightblue2" : ""
                        }`}
                      >
                        <div className="w-5/6">
                            <div className="row p-2 font-bold">{course.course.name}</div>
                            {/* <div className="pl-10">
                              <span> {course.course.description} </span>
                            </div> */}
                            <div className="font-bold text-sm pt-4">
                              <span>This course satisfies {course.importance - (4-course.course.level)} requirement(s)/prerequisite(s)</span>
                            </div>
                        </div>
                        <div className="align-center mx-auto ">
                          <div>
                            <Button onClick={() => {
                              setCurrentCourse(course.course)
                              setShowCourseModal(true)
                            }}>
                              View Course
                            </Button>
                          </div>
                          
                          <div className="pt-2"><Button variant="success" onClick={() => {
                            
                            handleAddCourse([course.course.name]);
                          }}>Add Course</Button></div>
                        </div>
                      </div>

                      
                    )
                  }
                  )}
                </div>
                <div class="pt-4 flex justify-center">
                  <Button variant="success" onClick={handleAddAll}>Add All</Button>
                </div>
                <ViewCourseModal
                  show={showCourseModal}
                  close={() => setShowCourseModal(false)}
                  course={currentCourse}
                />
              </div>
            )}
            
            
            
          
 
          
        </Main>
      </Box>
    </ThemeProvider>
  );
}
