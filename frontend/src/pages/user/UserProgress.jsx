import React, { useState } from "react";
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
import useUser from "../../hooks/useUser";
import useCourses from "../../hooks/useCourses";
import { Button, Dropdown, Modal } from "react-bootstrap";
import ViewCourseModal from "../../components/Modals/ViewCourseModal";
import axios from "axios";
import { toast } from "react-toastify";
let height = window.innerHeight;
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

export default function UserProgress() {
  //const theme = useTheme();
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

  const [user, setUser] = useUser();
  const [courses, setCourses] = useCourses();
  const [currentCourse, setCurrentCourse] = useState({});
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showRemoveCourseModal, setShowRemoveCourseModal] = useState(false);

  const completeCourse = () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .put(
        `${process.env.REACT_APP_SERVER_API}/user/futureCourses`,
        {
          id: user._id,
          course: currentCourse.name,
        },
        config
      )
      .then((res) => {
        if (res.data.success) {
          setUser({
            ...user,
            futureCourses: user.futureCourses.filter(
              (course) => course !== currentCourse.name
            ),
            courses: [...user.courses, currentCourse.name],
          });
          toast.success("Course has been completed successfully");
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      });
  };
  const removeCourse = () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        id: user._id,
        coursesToRemove: [currentCourse.name],
      },
    };
    axios
      .delete(
        `${process.env.REACT_APP_SERVER_API}/user/futureCourses`,

        config
      )
      .then((res) => {
        if (res.data.success) {
          setUser({
            ...user,
            futureCourses: user.futureCourses.filter(
              (course) => course !== currentCourse.name
            ),
          });
          toast.success("Course has been removed successfully");
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      });
  };
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <nav className={styles.userNavbar}>
            <Toolbar variant="dense">
              <Grid container rowSpacing={1} spacing={0}>
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
        {/** Main Body Start */}
        <Main open={open}>
          <DrawerHeader />
          <div
            className="flex justify-center"
            style={{ height: `${height > 900 ? "50rem" : "40rem"}` }}
          >
            <div
              className="w-1/2 h-4/5 rounded-md mr-3 ml-3"
              style={{ border: "2px solid darkred" }}
            >
              <div className="text-xl mt-2 text-center font-bold">
                Taken Courses
              </div>
              <hr className=" h-1" style={{ background: "darkred" }} />
              <div className="w-full  overflow-auto" style={{ height: "85%" }}>
                {courses
                  .filter((course) => user.courses.includes(course.name))
                  .map((course, idx) => {
                    return (
                      <div
                        key={course._id}
                        className={`flex mt-1 p-3 items-center rounded-3xl border  ${
                          idx % 2 === 1 ? "bg-lightblue2" : ""
                        }`}
                      >
                        <div
                          style={{ width: "20px", marginLeft: "7%" }}
                          className=" flex content-center items-center self-center justify-center p-auto"
                        >
                          <span className="font-bold">{course.name}</span>
                        </div>

                        <div className="align-center text-end ml-auto mr-10 ">
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="success"
                              id="dropdown-basic"
                            >
                              More
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={() => {
                                  setCurrentCourse(course);
                                  setShowCourseModal(true);
                                }}
                              >
                                View Course info
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
            <div
              className="w-1/2 max-h-full h-4/5 rounded-md mr-3 ml-3"
              style={{ border: "2px solid darkred" }}
            >
              <div className="text-xl mt-2 text-center font-bold">
                Future Courses
              </div>
              <hr className=" h-1" style={{ background: "darkred" }} />
              <div className="w-full  overflow-auto" style={{ height: "85%" }}>
                {courses
                  .filter((course) => user.futureCourses.includes(course.name))
                  .map((course, idx) => {
                    return (
                      <div
                        key={course._id}
                        className={`flex mt-1 p-3 items-center rounded-3xl border  ${
                          idx % 2 === 1 ? "bg-lightblue2" : ""
                        }`}
                      >
                        <div
                          style={{ width: "20px", marginLeft: "7%" }}
                          className=" flex content-center items-center self-center justify-center p-auto"
                        >
                          <span className="font-bold">{course.name}</span>
                        </div>

                        <div className="align-center text-end ml-auto mr-10 ">
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="success"
                              id="dropdown-basic"
                            >
                              More
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={() => {
                                  setCurrentCourse(course);
                                  setShowCompletionModal(true);
                                }}
                              >
                                Complete Course
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => {
                                  setCurrentCourse(course);
                                  setShowRemoveCourseModal(true);
                                }}
                              >
                                Remove Course
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => {
                                  setCurrentCourse(course);
                                  setShowCourseModal(true);
                                }}
                              >
                                View Course info
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
          <ViewCourseModal
            show={showCourseModal}
            close={() => setShowCourseModal(false)}
            course={currentCourse}
          />
          (
          <Modal
            show={showCompletionModal}
            onHide={() => setShowCompletionModal(false)}
            backdrop="static"
            keyboard={false}
            style={{ zIndex: 10000 }}
          >
            <Modal.Header closeButton>
              <Modal.Title>Confirm Completion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to complete this course?
              <p className="font-semibold">{currentCourse.name}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="danger"
                onClick={() => setShowCompletionModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  completeCourse();
                  setShowCompletionModal(false);
                }}
                variant="success"
              >
                Complete
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal
            show={showRemoveCourseModal}
            onHide={() => setShowRemoveCourseModal(false)}
            backdrop="static"
            keyboard={false}
            style={{ zIndex: 10000 }}
          >
            <Modal.Header closeButton>
              <Modal.Title>Confirm Removal</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to Remove this course from future courses?
              <p className="font-semibold">{currentCourse.name}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="danger"
                onClick={() => setShowRemoveCourseModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  removeCourse();
                  setShowRemoveCourseModal(false);
                }}
                variant="success"
              >
                Remove
              </Button>
            </Modal.Footer>
          </Modal>
        </Main>
      </Box>
    </ThemeProvider>
  );
}
