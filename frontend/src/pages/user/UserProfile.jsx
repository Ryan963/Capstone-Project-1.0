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
import Button from "@mui/material/Button";
import useUser from "../../hooks/useUser";
import Card from "react-bootstrap/Card";

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

export default function UserProfile() {
  const token = localStorage.getItem("token");
  //const userEmail = localStorage.getItem("email");
  const userType = localStorage.getItem("type");
  const navigate = useNavigate();
  //const [currentStudent, setCurrentStudent] = useState({});
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
          <div className="flex justify-between flex-wrap">
            <Card border="danger" style={{ width: "20rem" }}>
              <Card.Body>
                <Card.Title>Name:</Card.Title>
                <Card.Text>{user.firstname + " " + user.lastname}</Card.Text>
              </Card.Body>
            </Card>
            <Card border="danger" style={{ width: "20rem" }}>
              <Card.Body>
                <Card.Title>Email:</Card.Title>
                <Card.Text>{user.email}</Card.Text>
              </Card.Body>
            </Card>
            <Card border="danger" style={{ width: "20rem" }}>
              <Card.Body>
                <Card.Title>Degree:</Card.Title>
                <Card.Text>{user.degree}</Card.Text>
              </Card.Body>
            </Card>
            <Card border="danger" style={{ width: "20rem" }}>
              <Card.Body>
                <Card.Title>Major:</Card.Title>
                <Card.Text>{user.majors}</Card.Text>
              </Card.Body>
            </Card>
          </div>
          <br />
          <br />
          <div className="d-flex justify-content-around">
            <Card border="danger" style={{ width: "20rem" }}>
              <Card.Body>
                <Card.Title>Minor:</Card.Title>
                <Card.Text>{user.minors}</Card.Text>
              </Card.Body>
            </Card>
            <Card border="danger" style={{ width: "20rem" }}>
              <Card.Body>
                <Card.Title>Password:</Card.Title>
                <Card.Text>{user.password}</Card.Text>
              </Card.Body>
            </Card>
            <Card border="danger" style={{ width: "20rem" }}>
              <Card.Body>
                <Card.Title>Current Year:</Card.Title>
                <Card.Text>{user.currentyear}</Card.Text>
              </Card.Body>
            </Card>
          </div>
          <br />
          <br />
          <div className="d-flex justify-content-around">
            <Card border="danger" style={{ width: "20rem" }}>
              <Card.Body>
                <Card.Title>Graduated: (T/F)</Card.Title>
                <Card.Text>{user.graduated}</Card.Text>
              </Card.Body>
            </Card>
            <Card border="danger" style={{ width: "20rem" }}>
              <Card.Body>
                <Card.Title>Name:</Card.Title>
                <Card.Text>{user.firstname + " " + user.lastname}</Card.Text>
              </Card.Body>
            </Card>
            <Card border="danger" style={{ width: "20rem" }}>
              <Card.Body>
                <Card.Title>GPA:</Card.Title>
                <Card.Text>{user.gpa}</Card.Text>
              </Card.Body>
            </Card>
            <Card
              className="text-center pt-4"
              border="danger"
              style={{ width: "20rem" }}
            >
              <Link to="/user/courses">
                <Button variant="contained">Check and Romove Courses</Button>
              </Link>
            </Card>
          </div>
        </Main>
      </Box>
    </ThemeProvider>
  );
}
