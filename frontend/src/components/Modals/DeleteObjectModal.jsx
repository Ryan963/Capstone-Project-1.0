import React from 'react'
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import axios from "axios";


function DeleteObjectModal( {
  show,
  close,
  collection,
  object,
  deleteFromCollection
}) {
  const {_id, name} = object

  const handleDelete = () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .delete(
        `${process.env.REACT_APP_SERVER_API}/${collection}/${_id}`,
        config
      )
      .then((res) => {
        if (res.data.success) {
          deleteFromCollection( object );
          toast.success(`${name} Removed`); 
        } else {
          toast.error(res.data.message);
        }
        close()
      })
      .catch((error) => {
        toast.error(error.message);
        console.log(error);
      });
  }
  
  return (
    <>
      (
        <Modal
          show={show}
          onHide={close}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete:
          <p className="font-semibold">{name}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default DeleteObjectModal