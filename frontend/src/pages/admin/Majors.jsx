import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dropdown } from "react-bootstrap";
import AdminSidebar from "../../components/admin/AdminSideBar";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import Loader from "../../components/UI/Loader";

const Majors = () => {
  const [majors, setMajors] = useState([]);
  const token = localStorage.getItem("token");
  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      axios
        .get(`${process.env.REACT_APP_SERVER_API}/majors`, config)
        .then((res) => {
          console.log(res.data);
          setMajors(res.data);
        });
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  }, []);
  return (
    <div className="flex flex-row w-full">
      <div>
        <AdminSidebar route={"majors"} />
      </div>
      <div className="ml-20 w-full mr-20">
        {majors.length > 0 ? (
          <>
            <div
              className={`flex mt-1 p-3 items-center rounded-3xl border bg-lightgrey text-grey`}
            >
              <div className="font-semibold ml-12">
                <span>Major ID</span>
              </div>
              <div className="font-semibold ml-40">
                <span>Name</span>
              </div>
              <div className="align-center text-end ml-auto mr-10">
                <Button variant="success">New Major</Button>
              </div>
            </div>
            <div>
              {majors.map((major, idx) => {
                // if (major.streams && major.streams.length > 0) {
                //   major.streams.map((stream) => {
                //     return (
                //       <div
                //         key={major._id}
                //         className={`flex mt-1 p-3 items-center rounded-3xl border  ${
                //           idx % 2 === 1 ? "bg-lightblue2" : ""
                //         }`}
                //       >
                //         <div
                //           style={{
                //             whiteSpace: "nowrap",
                //             overflow: "hidden",
                //             textOverflow: "ellipsis",
                //           }}
                //         >
                //           <span>{major._id}</span>
                //         </div>
                //         <div className="ml-10">
                //           <span className="font-bold">{major.name}</span>
                //         </div>
                //         <div className="ml-20">
                //           <span className="font-bold">{stream}</span>
                //         </div>
                //         <div className="align-center text-end ml-auto mr-10">
                //           <Dropdown>
                //             <Dropdown.Toggle variant="success" id="dropdown-basic">
                //               More
                //             </Dropdown.Toggle>

                //             <Dropdown.Menu>
                //               <Dropdown.Item onClick={() => {}}>
                //                 Update
                //               </Dropdown.Item>
                //               <Dropdown.Item onClick={() => {}}>
                //                 View Requirements
                //               </Dropdown.Item>
                //               <Dropdown.Item onClick={() => {}}>
                //                 Delete Major
                //               </Dropdown.Item>
                //             </Dropdown.Menu>
                //           </Dropdown>
                //         </div>
                //       </div>
                //     );
                //   });
                // }
                return (
                  <div
                    key={major._id}
                    className={`flex mt-1 p-3 items-center rounded-3xl border  ${
                      idx % 2 === 1 ? "bg-lightblue2" : ""
                    }`}
                  >
                    <div
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <span>{major._id}</span>
                    </div>
                    <div className="ml-10">
                      <span className="font-bold">{major.name}</span>
                    </div>
                    <div className="align-center text-end ml-auto mr-10">
                      <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                          More
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => {}}>
                            Update
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => {}}>
                            View Requirements
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => {}}>
                            Delete Major
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
};

export default Majors;
