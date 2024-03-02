import "../App.css";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import React from "react";
import { APIBASEURL } from "../config";
import { todoProps } from "./todoList";

function TodoForm(props: {
  onHide: (refechData?: boolean) => void;
  data?: todoProps;
}) {
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("This field is required"),
    description: Yup.string().required("This field is required"),
  });

  const handleSubmit = (value, actions) => {
    const isUpdate: boolean = props?.data ? true : false;
    axios
      .post(
        `${APIBASEURL}/${isUpdate ? "updateTodo" : "createTodo"}`,
        isUpdate
          ? {
              id: props?.data?._id,
              updates: value,
            }
          : value
      )
      .then((response) => {
        actions.resetForm();
        props.onHide(true);
        alert(response?.data?.message);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Modal
      show={true}
      onHide={() => {
        props?.onHide();
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Add New Task</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{
          title: props?.data?.title ?? "",
          description: props?.data?.description ?? "",
          isDone: props?.data?.isDone ?? false,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
          handleSubmit(values, actions);
        }}
      >
        {({ isSubmitting, errors }) => (
          <Form>
            <Modal.Body>
              <div className='form-group mb-4'>
                <label htmlFor='title'>Title</label>
                <Field type='text' name='title' className='form-control' />
                <ErrorMessage name='title' component='div' className='error' />
              </div>

              <div className='form-group mb-4'>
                <label htmlFor='description'>Description</label>
                <Field
                  type='text'
                  name='description'
                  className='form-control'
                  rows={5}
                  cols={30}
                />

                <ErrorMessage
                  name='description'
                  component='div'
                  className='error'
                />
              </div>
            </Modal.Body>

            <Modal.Footer>
              <Button variant='primary' type='submit' disabled={isSubmitting}>
                {props?.data ? "Save Changes" : "Create new"}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

export default TodoForm;
