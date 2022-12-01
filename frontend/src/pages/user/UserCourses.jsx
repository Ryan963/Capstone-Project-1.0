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
import useUser from "../../hooks/useUser";
import ProgressBar from "react-bootstrap/ProgressBar";
import ProgressLine from "../../components/homePageComponents/ProgressLine";
import Loader from "../../components/UI/Loader";

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

  const [courses, setCourses] = useCourses([]);
  const [user, setUser] = useUser({});
  const [currentCourse, setCurrentCourse] = useState({});
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCourseTaken, setshowCourseTaken] = useState(false);
  const [filterByDiscipline, setFilterByDiscipline] = useState("");
  const [filterByLevel, setFilterByLevel] = useState("");
  const [filterByCompletion, setFilterByCompletion] = useState("");
  const [filterByRequirement, setFilterByRequirement] = useState({});
  const [requirements, setRequirements] = useState([]);

  // variable to save how many requiremnts the selected course counts towards
  const [neededByRequirements, setNeededByRequirements] = useState(0);

  // array of requirements that selected course counts towards
  const [requirementsSatisfied, setRequirementsSatisfied] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    setCourses([]);
    setUser();
    getRequirements();
  }, []);

  function getDisciplines(courses) {
    const disciplines = [];
    for (let course of courses) {
      if (!disciplines.includes(course.discipline)) {
        disciplines.push(course.discipline);
      }
    }
    return disciplines.sort();
  }
  const disciplines = getDisciplines(courses);

  const addFutureCourse = (course) => {
    //* check if course already taken or already in future courses
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
        setUser({
          ...user,
          futureCourses: user.futureCourses.concat(course),
        });
        toast.success("Course added successfully!");
      })
      .catch((error) => {
        toast.error(error.message);
        console.log(error);
      });
  };

  const getRequirementSatisfaction = (course) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .get(
        `${process.env.REACT_APP_SERVER_API}/recommendations/${course._id}`,
        config
      )
      .then((res) => {
        setNeededByRequirements(res.data.satisfied);
        setRequirementsSatisfied(res.data.reqs);
        setShowConfirmModal(true);
      })
      .catch((error) => {
        toast.error(error.message);
        console.log(error);
      });
  };

  const getRequirements = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .get(
        `${process.env.REACT_APP_SERVER_API}/recommendations/requirements`,
        config
      )
      .then((res) => {
        setRequirements(res.data.requirements);
      })
      .catch((error) => {
        toast.error(error.message);
        console.log(error);
      });
  };

  // get completed courses
  const getCompleted = (requirement, userCourses) => {
    // array of requirment courses the user has already completed
    const allUserCourses = user.courses.concat(user.futureCourses);

    const completed = allUserCourses.filter((value) =>
      requirement.courses.includes(value)
    );

    // check if requirment is satisfied if yes then don't display anything
    if (
      requirement.type === "credits_of_group" &&
      completed.length * 3 >= requirement.credits
    ) {
      return;
    }

    var percent = Math.round(
      ((completed.length * 3) / requirement.credits) * 100
    );
    return (
      <li className="m-auto p-3">
        <ProgressLine
          percentGiven={percent}
          label={requirement.description + " - " + percent + "% completed"}
          visualParts={[
            {
              percentage: percent + "%",
              color: "green",
            },
          ]}
        />
        {completed.length === 0
          ? "Completed: N/A"
          : completed.length > 5
          ? ""
          : "Completed: " + completed.join(" ")}{" "}
      </li>
    );
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
          {/*--- Start of page body ---*/}
          <div>
            <div className="flex justify-between">
              <div>
                <label className="font-semibold text-lg">
                  Filter By Requirement:
                </label>

                <select
                  className=" text-ellipsis w-40 p-2.5 m-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  name="filterByCompletion"
                  id="filterByCompletion"
                  value={filterByRequirement}
                  onChange={(e) => setFilterByRequirement(e.target.value)}
                >
                  <option value={""}>All</option>
                  {requirements.map((requirement, idx) => (
                    <option key={idx} value={requirement.courses}>
                      {requirement.description}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-semibold text-lg">
                  Course Discipline:
                </label>

                <select
                  // className="w-40 m-2 border rounded-md border-primary "
                  className=" w-40 p-2.5 m-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  id="grid-first-name"
                  type="text"
                  name="discipline"
                  onChange={(e) => setFilterByDiscipline(e.target.value)}
                  value={filterByDiscipline}
                >
                  <option value={""}>All</option>
                  {disciplines.map((discipline, idx) => (
                    <option key={idx} value={discipline}>
                      {discipline}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-semibold text-lg">Course Level:</label>
                <select
                  className=" w-40 p-2.5 m-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  name="filterByLevel"
                  id="filterByLevel"
                  value={filterByLevel}
                  onChange={(e) => setFilterByLevel(e.target.value)}
                >
                  <option value={""}>All</option>
                  <option value="1">100</option>
                  <option value="2">200</option>
                  <option value="3">300</option>
                  <option value="4">400</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-lg">
                  Show Completed Courses:
                </label>

                <select
                  className=" w-40 p-2.5 m-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  name="filterByCompletion"
                  id="filterByCompletion"
                  value={filterByCompletion}
                  onChange={(e) => setFilterByCompletion(e.target.value)}
                >
                  <option value="show">Show</option>
                  <option value="hide">Hide</option>
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
              {courses.length > 0 ? (
                <>
                  {courses
                    .filter((course) => {
                      if (filterByDiscipline.length > 0) {
                        if (course.discipline !== filterByDiscipline) {
                          return false;
                        }
                      }
                      if (filterByRequirement.length > 0) {
                        if (!filterByRequirement.includes(course.name)) {
                          return false;
                        }
                      }
                      if (filterByLevel.length > 0) {
                        if (
                          course.name[course.name.length - 3] !== filterByLevel
                        ) {
                          return false;
                        }
                      }
                      if (filterByCompletion === "hide") {
                        if (
                          user.courses.includes(course.name) ||
                          user.futureCourses.includes(course.name)
                        ) {
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
                            <span className="font-bold">
                              {course.level * 100}
                            </span>
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
                                    if (
                                      user.futureCourses.includes(
                                        course.name
                                      ) ||
                                      user.courses.includes(course.name)
                                    ) {
                                      setshowCourseTaken(true);
                                    } else {
                                      getRequirementSatisfaction(course);
                                    }
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
                </>
              ) : (
                <div className="flex items-center justify-center w-full pt-10 h-full">
                  <Loader />
                </div>
              )}
            </div>
          </div>
          <ViewCourseModal
            show={showCourseModal}
            close={() => setShowCourseModal(false)}
            course={currentCourse}
            user={true}
          />
          <Modal
            show={showConfirmModal}
            size="lg"
            onHide={() => setShowConfirmModal(false)}
            backdrop="static"
            keyboard={false}
            style={{ zIndex: 10000 }}
          >
            <Modal.Header closeButton>
              <Modal.Title>Confirm Action</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to add the following course to your future
              courses?
              <p className="font-semibold">{currentCourse.name}</p>
              <p>
                This course will count towards{" "}
                <strong>{neededByRequirements} </strong>
                uncompleted Degree/Major/Minor requirement(s):
              </p>
              <ul className="list-disc">
                {requirementsSatisfied.map((requirement, idx) => {
                  return (
                    <div key={idx}>
                      {/* {requirement.description} */}
                      <div>{getCompleted(requirement, user.courses)}</div>
                    </div>
                  );
                })}
              </ul>
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

          <Modal
            show={showCourseTaken}
            onHide={() => setshowCourseTaken(false)}
            backdrop="static"
            keyboard={false}
            style={{ zIndex: 10000 }}
          >
            <Modal.Header closeButton>
              <Modal.Title>Warning</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                You have already taken or plan on taking:{" "}
                <strong>{currentCourse.name}</strong>
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="danger"
                onClick={() => setshowCourseTaken(false)}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Main>
      </Box>
    </ThemeProvider>
  );
}
