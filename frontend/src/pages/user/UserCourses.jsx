import React, { useState, useEffect } from "react";
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
import axios from "axios";
import { toast } from "react-toastify";
import { Button, Dropdown, Modal } from "react-bootstrap";
import ViewCourseModal from "../../components/Modals/ViewCourseModal";
import useCourses from "../../hooks/useCourses";

const drawerWidth = 200;

/*
check how manu requirements are satisfied
*/

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

export default function UserCourses() {
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

  /*
    - filter out already taken courses
    - display no results if filter return nothing
    - check selected course against progress
    - better css
    - spinner
  */

  const [courses, setCourses] = useCourses([]);
  const [currentCourse, setCurrentCourse] = useState({});
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [filterByDiscipline, setFilterByDiscipline] = useState("");
  const [filterByLevel, setFilterByLevel] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    setCourses([]);
  }, []);

  function getDisciplines(courses) {
    const disciplines = [];
    for (let course of courses) {
      if (!disciplines.includes(course.discipline)) {
        disciplines.push(course.discipline);
      }
    }
    return disciplines;
  }
  const disciplines = getDisciplines(courses);

  const addFutureCourse = (course) => {
    //* checks ?
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .post(
        `${process.env.REACT_APP_SERVER_API}/user/futureCourses`,
        { futureCourses: [course] },
        config
      )
      .then((res) => {
        toast.success("Course added successfully!");
      })
      .catch((error) => {
        toast.error(error.message);
        console.log(error);
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
                {/* columnSpacing={{xs: 80, sm:150, md:150}} */}
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
          <div>
            <div className="flex ">
              <div>
                <label className="font-semibold text-lg">
                  Course Discipline:
                </label>

                <select
                  className="w-40 m-2 border rounded-md border-primary "
                  id="grid-first-name"
                  type="text"
                  name="discipline"
                  onChange={(e) => setFilterByDiscipline(e.target.value)}
                  value={filterByDiscipline}
                >
                  <option value={""}></option>
                  {disciplines.map((discipline, idx) => (
                    <option key={idx} value={discipline}>
                      {discipline}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex space-between">
                <label className="font-semibold text-lg">Course Level:</label>
                <select
                  className="w-40 m-2 border rounded-md border-primary "
                  name="filterByLevel"
                  id="filterByLevel"
                  value={filterByLevel}
                  onChange={(e) => setFilterByLevel(e.target.value)}
                >
                  <option value={""}></option>
                  <option value="1">100</option>
                  <option value="2">200</option>
                  <option value="3">300</option>
                  <option value="4">400</option>
                </select>
              </div>
            </div>
            <div
              className={`flex mt-1 p-3 items-center rounded-3xl border bg-lightgrey text-grey`}
            >
              <div className="font-semibold ml-24">
                <span>Name</span>
              </div>
              <div className="font-semibold  ml-auto text-center">
                <span>Credits</span>
              </div>
              <div className="font-semibold ml-20 text-center ">
                <span>Level</span>
              </div>
              <div className="align-center text-end ml-auto mr-10"></div>
            </div>
            <div>
              {courses
                .filter((course) => {
                  if (filterByDiscipline.length > 0) {
                    if (course.discipline !== filterByDiscipline) {
                      return false;
                    }
                  }
                  if (filterByLevel.length > 0) {
                    if (course.name[course.name.length - 3] !== filterByLevel) {
                      return false;
                    }
                  }
                  return true;
                })
                .map((course, idx) => {
                  return (
                    <div
                      key={course._id}
                      className={`flex mt-1 p-3 items-center rounded-3xl border  ${
                        idx % 2 === 1 ? "bg-lightblue2" : ""
                      }`}
                    >
                      <div
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          width: "240px",
                        }}
                        className=" flex content-center items-center self-center justify-center p-auto"
                      >
                        <span className="font-bold">{course.name}</span>
                      </div>
                      <div
                        style={{
                          marginLeft: "auto",
                        }}
                      >
                        <span
                          style={{ width: "20px" }}
                          className="font-bold  ml-auto"
                        >
                          {course.credits}
                        </span>
                      </div>
                      <div className="ml-28">
                        <span className="font-bold">{course.level * 100}</span>
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
                                setShowConfirmModal(true);
                              }}
                            >
                              Add to Future Courses
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
          <ViewCourseModal
            show={showCourseModal}
            close={() => setShowCourseModal(false)}
            course={currentCourse}
          />
          <Modal
            show={showConfirmModal}
            onHide={() => setShowConfirmModal(false)}
            backdrop="static"
            keyboard={false}
            style={{ zIndex: 10000 }}
          >
            <Modal.Header closeButton>
              <Modal.Title>Confirm Action</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to Add this course to future courses?
              <p className="font-semibold">{currentCourse.name}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="danger"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  addFutureCourse(currentCourse.name);
                  setShowConfirmModal(false);
                }}
                variant="success"
              >
                Add
              </Button>
            </Modal.Footer>
          </Modal>
        </Main>
      </Box>
    </ThemeProvider>
  );
}
