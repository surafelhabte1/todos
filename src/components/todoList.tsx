import "../App.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import React, { useEffect, useState } from "react";
import { APIBASEURL } from "../config";
import { Col, Container, Row } from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";
import TodoForm from "../components/todoForm.tsx";

export interface todoProps {
  _id: String;
  title: string;
  description: string;
  isDone: boolean;
}

function TodoList() {
  const [data, setData] = useState([]);
  const [showTodoForm, setShowTodoForm] = useState(false);

  const [Item, setItem] = useState<todoProps | undefined>();

  const getDatas = () => {
    axios
      .get(`${APIBASEURL}/getTodos`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getDatas();
  }, []);

  return (
    <Container>
      {showTodoForm && (
        <TodoForm
          onHide={(reloadData) => {
            setShowTodoForm(false);
            setItem(undefined);
            reloadData && getDatas();
          }}
          data={Item}
        />
      )}
      <Row>
        <Col></Col>
        <Col xs={10} className='mb-4 mt-4'>
          <Button
            variant='link'
            className='mb-4'
            style={{}}
            onClick={() => {
              setShowTodoForm(true);
            }}
          >
            Add New
          </Button>
          <ListGroup>
            {data.map((item: todoProps, index: number) => {
              return (
                <IndividualItem
                  key={index}
                  item={item}
                  onEdit={(item: todoProps) => {
                    setItem(item);
                    setShowTodoForm(true);
                  }}
                  onDelete={() => {
                    getDatas();
                  }}
                />
              );
            })}
          </ListGroup>
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
}

export default TodoList;

export function IndividualItem(props: {
  item: todoProps;
  onEdit: (item: todoProps) => void;
  onDelete: () => void;
}) {
  const deleteTodo = () => {
    if (window.confirm("Are you sure want to delete this todo ?")) {
      axios
        .get(`${APIBASEURL}/${"deleteTodo"}/${props?.item?._id}`)
        .then((response) => {
          alert(response?.data?.message);
          props?.onDelete();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };
  return (
    <ListGroup.Item>
      <Row>
        <Col
          xs={1}
          style={{
            alignItems: "center",
          }}
        >
          <input
            className='form-check-input'
            type='checkbox'
            id={props?.item._id?.toString()}
            name={props?.item._id?.toString()}
            checked={props?.item?.isDone}
            onChange={(value) => {
              axios
                .post(`${APIBASEURL}/updateTodo`, {
                  id: props?.item?._id,
                  updates: {
                    isDone: value.target.checked
                  },
                })
                .then((response) => {
                  props.onDelete();
                })
                .catch((error) => {
                  console.error(error);
                });
            }}
          />
        </Col>
        <Col>
          <div className='ms-2 me-auto'>
            <div
              className='fw-bold'
              style={{
                textDecoration: props?.item.isDone ? "line-through" : "none",
              }}
            >
              {props?.item.title}
            </div>
            <span
              style={{
                textDecoration: props?.item.isDone ? "line-through" : "none",
              }}
            >
              {props?.item.description}
            </span>
          </div>
        </Col>

        <Col xs={1}>
          <Button
            variant='link'
            className='mb-4'
            style={{}}
            onClick={() => {
              props?.onEdit(props?.item);
            }}
          >
            Edit
          </Button>
        </Col>
        <Col xs={1}>
          <Button
            variant='link'
            className='mb-4'
            style={{}}
            onClick={() => {
              deleteTodo();
            }}
          >
            Delete
          </Button>
        </Col>
      </Row>
    </ListGroup.Item>
  );
}
