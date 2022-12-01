import React, { useEffect } from "react";
import { Stepper, Step, StepLabel } from "@material-ui/core";
import { useState } from "react";
import Input from "../components/UI/Input";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import useDegrees from "../hooks/useDegrees";
import useMajors from "../hooks/useMajors";
import useMinors from "../hooks/useMinors";
import useCourses from "../hooks/useCourses";
import CourseSelections from "../components/CourseSelections";
import ButtonPrimary from "../components/UI/ButtonPrimary";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Register = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    degree: "",
    majors: [],
    minors: [],
    courses: [],
    currentyear: null,
    graduated: false,
    gpa: null,
  });
  const [doubleMajorCheck, setDoubleMajorCheck] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [degrees, setDegrees] = useDegrees();
  const [majors, setMajors] = useMajors();
  const [minors, setMinors] = useMinors();
  const [courses, setCourses] = useCourses();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const checkFirstStep = () => {
    if (user?.firstname.length === 0) {
      toast.error("firstname is required");
      return;
    }
    if (user?.lastname.length === 0) {
      toast.error("lastname is required");
      return;
    }
    if (user?.email.length === 0) {
      toast.error("email is required");
      return;
    }
    if (user?.password.length === 0) {
      toast.error("password is required");
      return;
    }
    setActiveStep(activeStep + 1);
  };

  // checks if user info are set correctly and moves to next step
  const checkSecondStep = () => {
    if (user.degree.length === 0) {
      toast.error("degree is rquired");
      return;
    }
    if (user.majors.length + user.minors.length < 2) {
      toast.error(
        "You need to choose either a major and a minor or two majors"
      );
      return;
    }

    if (!user.currentyear) {
      toast.error("Current year is required");
      return;
    }

    if (!user.gpa || user.gpa < 0 || user.gpa > 4.0) {
      toast.error("Please enter accurate GPA");
      return;
    }
    setActiveStep(activeStep + 1);
  };

  // checks if majors and minors are selected accordingly and moves to the next steps
  const handleMajorSelect = (e) => {
    setUser((prevUser) => {
      const majorsCpy = [...prevUser.majors];
      if (
        majorsCpy.length === 0 ||
        (majorsCpy.length === 1 && e.target.name === "major2")
      ) {
        majorsCpy.push(e.target.value);
      } else if (majorsCpy.length > 0 && e.target.name === "major") {
        majorsCpy[0] = e.target.value;
      } else if (majorsCpy.length > 1 && e.target.name === "major2") {
        majorsCpy[1] = e.target.value;
      }
      return {
        ...user,
        majors: majorsCpy,
      };
    });
  };

  const addMinor = (e) => {
    setUser((prevUser) => {
      return {
        ...prevUser,
        minors: [e.target.value],
      };
    });
  };

  // clear local storage when arriving to this page
  useEffect(() => {
    localStorage.clear();
  }, []);

  const addCourse = (course) => {
    for (let current of user.courses) {
      if (current === course.name) {
        toast.error("course is already added");
        return;
      }
    }
    setUser((prevUser) => {
      return {
        ...prevUser,
        courses: [...prevUser.courses, course.name],
      };
    });
  };

  const removeCourse = (course) => {
    setUser((prevUser) => {
      const newCourses = [...prevUser.courses].filter((p) => p !== course);
      return {
        ...prevUser,
        courses: newCourses,
      };
    });
  };

  // create new user
  const handleSubmit = () => {
    setButtonDisabled(true);
    axios
      .post(`${process.env.REACT_APP_SERVER_API}/user`, { ...user })

      .then((res) => {
        console.log(user);
        if (res.data.success) {
          // save in localstorage with user type as user
          localStorage.setItem("email", res.data.email);
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("type", "user");

          toast.success("Register Successful");
          // change the route to the home page
          navigate("/user/me");
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      })
      .finally(() => setButtonDisabled(false));
  };
  return (
    <>
      <Stepper activeStep={activeStep}>
        <Step>
          <StepLabel>Personal Info</StepLabel>
        </Step>
        <Step>
          <StepLabel>Degree Info</StepLabel>
        </Step>
        <Step>
          <StepLabel>Courses Taken</StepLabel>
        </Step>
      </Stepper>
      <div className=" flex justify-center">
        <div className="ml-5 w-1/2">
          {activeStep === 0 && (
            <>
              <Input
                handleChange={handleChange}
                name="firstname"
                label="Enter Firstname"
                value={user.firstname}
                placeholder="Ex: John"
                type="text"
              />
              <Input
                handleChange={handleChange}
                name="lastname"
                label="Enter lastname"
                value={user.lastname}
                placeholder="Ex: Smith"
                type="text"
              />
              <Input
                handleChange={handleChange}
                name="email"
                label="Enter email"
                value={user.email}
                placeholder="johnsmith@gmail.com"
                type="email"
              />
              <Input
                handleChange={handleChange}
                name="password"
                label="Enter password"
                value={user.password}
                placeholder="Password"
                type="password"
              />
              <div className="flex justify-between">
                {activeStep > 0 && (
                  <Button
                    variant="primary"
                    onClick={() => setActiveStep(activeStep - 1)}
                  >
                    <div className="mx-3 ">Prev</div>
                  </Button>
                )}
                {activeStep < 2 && (
                  <div className="ml-auto">
                    <Button variant="primary" onClick={checkFirstStep}>
                      <div className="mx-3 ">Next</div>
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
          {activeStep === 1 && (
            <div>
              <div>
                <div className="font-semibold text-lg">Current Degree:</div>
                <select
                  className="w-full m-2 pt-2 border rounded-md self-center border-primary "
                  id="grid-first-name"
                  type="text"
                  name="degree"
                  placeholder="ex. Bachelor of science"
                  value={user.degree}
                  onChange={handleChange}
                >
                  <option value={""}></option>
                  {degrees.map((degree, idx) => (
                    <option key={idx} value={degree._id}>
                      {degree.name}
                    </option>
                  ))}
                </select>
                <h4>Majors & Minors</h4>
                <div className="font-semibold text-lg">
                  Current Major:{" "}
                  <span className="text-sm font-semibold ml-2 mr-2">
                    Double major
                    <input
                      onChange={(e) => setDoubleMajorCheck(!doubleMajorCheck)}
                      value={doubleMajorCheck}
                      className="ml-2"
                      type="checkbox"
                      placeholder="Double major"
                    />
                  </span>
                </div>
                <select
                  className="w-full m-2 pt-2 border rounded-md self-center border-primary "
                  id="grid-first-name"
                  type="text"
                  name="major"
                  placeholder="ex. Marketing"
                  onChange={handleMajorSelect}
                >
                  <option value={""}></option>
                  {majors.map((major, idx) => (
                    <option key={idx} value={major._id}>
                      {major.name} : ({major.stream})
                    </option>
                  ))}
                </select>
                {doubleMajorCheck ? (
                  <>
                    <div className="font-semibold text-lg">Second Major:</div>
                    <select
                      className="w-full m-2 pt-2 border rounded-md self-center border-primary "
                      id="grid-first-name"
                      type="text"
                      name="major2"
                      placeholder="ex. Math"
                      onChange={handleMajorSelect}
                    >
                      <option value={""}></option>
                      {majors.map((major, idx) => (
                        <option key={idx} value={major._id}>
                          {major.name} : ({major.stream})
                        </option>
                      ))}
                    </select>
                  </>
                ) : (
                  <>
                    <div className="font-semibold text-lg">Current Minor:</div>
                    <select
                      className="w-full m-2 pt-2 border rounded-md self-center border-primary "
                      id="grid-first-name"
                      type="text"
                      name="minors"
                      placeholder="ex. Math"
                      onChange={addMinor}
                    >
                      <option value={""}></option>
                      {minors.map((minor, idx) => (
                        <option key={idx} value={minor._id}>
                          {minor.name}
                        </option>
                      ))}
                    </select>
                  </>
                )}
              </div>

              <div>
                <div className="font-semibold text-lg">Current Year:</div>
                <select
                  className="w-full m-2 pt-2 border rounded-md self-center border-primary"
                  onChange={handleChange}
                  value={user.year}
                  name="currentyear"
                >
                  <option value=""></option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
              <label className="font-semibold text-lg mr-3">Graduated:</label>
              <input
                type={"checkbox"}
                onChange={handleChange}
                name="graduated"
              />

              <Input
                handleChange={handleChange}
                name="gpa"
                label="Enter gpa"
                value={user.gpa}
                placeholder="EX: 3.2"
                type="number"
              />
              <div className="flex justify-between">
                {activeStep > 0 && (
                  <Button
                    variant="primary"
                    onClick={() => setActiveStep(activeStep - 1)}
                  >
                    <div className="mx-3 ">Prev</div>
                  </Button>
                )}
                {activeStep < 2 && (
                  <div className="ml-auto">
                    <Button variant="primary" onClick={checkSecondStep}>
                      <div className="mx-3 ">Next</div>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
          {activeStep === 2 && (
            <>
              <CourseSelections
                courses={courses}
                addedCourses={user.courses}
                addCourse={addCourse}
                removeCourse={removeCourse}
              />
              <div className="flex justify-between mt-3">
                {activeStep > 0 && (
                  <Button
                    variant="primary"
                    onClick={() => setActiveStep(activeStep - 1)}
                  >
                    <div className="mx-3 ">Prev</div>
                  </Button>
                )}
                {activeStep < 2 && (
                  <div className="ml-auto">
                    <Button
                      variant="primary"
                      onClick={() => setActiveStep(activeStep + 1)}
                    >
                      <div className="mx-3 ">Next</div>
                    </Button>
                  </div>
                )}
              </div>
              <ButtonPrimary onClick={handleSubmit} disabled={buttonDisabled}>
                Register
              </ButtonPrimary>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Register;
