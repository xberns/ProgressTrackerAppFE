import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Card,
  Modal,
  ClickAwayListener,
} from "@mui/material";
import "../App.css";
import {
  postTaskTitle,
  modifyTaskTitle,
  getTaskTitle,
  deleteTaskTitle,
} from "../Controller/TaskTitleController";
import { getDateTime } from "../mainslice/commonUtils";

export default function TaskTitle() {
  //From prop
  const user_id = "hi";

  //Title
  const [getTrig, setGetTrig] = useState(true);
  const [title, setTitle] = useState([]);

  const [addNew, setAddNew] = useState(false);

  //Title content modification control
  const [titleModIndex, setTitleModIndex] = useState("");
  const [hasContentChanges, setHasContentChanges] = useState(false);

  //New title form buttons and required field ref
  const btn1Ref = useRef(null);
  const btn2Ref = useRef(null);
  const titleRef = useRef(null);

  //Edit Control
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDeletion, setConfirmDeletion] = useState(false);

  //Modal Control
  const [showModal, setShowModal] = useState(false);

  //Get
  useEffect(() => {
    const params = {
      user_id: user_id,
    };
    if (getTrig === true) {
      const fetchTasks = async () => {
        const data = await getTaskTitle(params);
        if (data === "0") {
          setTitle([]);
        } else if (data != null) {
          setTitle(data);
        }
      };
      fetchTasks();
    }
    setGetTrig(false);
  }, [getTrig]);

  //Add New Task
  const addTitle = () => {
    setTitle([
      ...title,
      {
        task_title: "",
        task_description: "",
        date_created: getDateTime(),
        user_id: user_id,
      },
    ]);
    setIndex();
  };
  const setIndex = () => {
    const i = title.length;
    setTitleModIndex(i);
    setAddNew(true);
  };

  useEffect(() => {
    if (addNew === true) {
      setShowModal(true);
    }
  }, [addNew]);

  //Save New Task Title
  const handleAddNewTasktitle = (i) => {
    saveNewTaskContent(i);
    setAddNew(false);

    setShowModal(false);
    setGetTrig(true);
  };

  const saveNewTaskContent = async (i) => {
    const params = {
      id: title[i].id,
      task_title: title[i].task_title,
      task_description: title[i].task_description,
      date_created: title[i].date_created,
      user_id: title[i].user_id,
    };
    await postTaskTitle(params);
  };

  const handleCancelNewTitle = (i) => {
    const updatedTask = [...title];
    updatedTask.splice(i, 1);
    setTitle(updatedTask);
  };

  //Save Modified Task
  const handleModifiedTask = (i) => {
    saveModifiedTaskContent(i);
    setIsEditing(false);
  };
  const saveModifiedTaskContent = async (i) => {
    const params = {
      id: title[i].id,
      task_title: title[i].task_title,
      task_description: title[i].task_description,
      date_created: title[i].date_created,
      user_id: title[i].user_id,
    };
    await modifyTaskTitle(params);
  };

  //Redirection to TaskContent
  const handleOnClick = (index) => {
    //To TaskContents page
  };

  //Edit Control (Delete Task and Edit Contents)
  const handleEditClick = (i) => {
    setShowModal(true);
    setIsEditing(true);
    setTitleModIndex(i);
  };

  const handleTasTitleChange = (index, value) => {
    const updatedTask = [...title];
    updatedTask[index].task_title = value;
    setTitle(updatedTask);
    if (isEditing === true) {
      setHasContentChanges(true);
    }
  };

  const handleDeleteClick = (i) => {
    if (!confirmDeletion) {
      setConfirmDeletion(true);
      setTimeout(() => setConfirmDeletion(false), 4000); // auto-reset
    } else {
      deleteTask(i);
    }
  };

  const handleTaskDescChange = (index, value) => {
    const updatedTask = [...title];
    updatedTask[index].task_description = value;
    setTitle(updatedTask);
    if (isEditing === true) {
      setHasContentChanges(true);
    }
  };

  //Modal: blink control for Save and Discard button
  const onModalClickAway = () => {
    blink(btn1Ref.current);
    blink(btn2Ref.current);
  };
  const blink = (button) => {
    if (!button) return;

    button.classList.remove("blink-twice");
    void button.offsetWidth;
    button.classList.add("blink-twice");

    setTimeout(() => {
      button.classList.remove("blink-twice");
    }, 600);
  };

  //Add or Modify Control
  const handleResponse = (res) => {
    if (isEditing === true) {
      if (hasContentChanges === true) {
        handleModTask(res);
      } else {
        setIsEditing(false);
        setShowModal(false);
        setTitleModIndex("");
      }
    }
    if (addNew === true) {
      handleAddNewTask(res);
    }
  };
  const handleAddNewTask = (res) => {
    if (res === 0) {
      if (title[titleModIndex].task_title === "") {
        blink(titleRef.current);
      } else {
        handleAddNewTasktitle(titleModIndex);
      }
    } else if (res === 1) {
      handleCancelNewTitle(titleModIndex);
      setShowModal(false);
    }
  };
  const handleModTask = (res) => {
    if (res === 0) {
      handleModifiedTask(titleModIndex); // here it is
      setShowModal(false);
    } else if (res === 1) {
      setShowModal(false);
    }

    setGetTrig(true);
  };

  //Delete Task
  const deleteTask = (index) => {
    removeTask(index);
    setShowModal(false);
    setGetTrig(true);
    setIsEditing(false);
    setConfirmDeletion(false);
  };
  const removeTask = async (i) => {
    const params = {
      id: title[i].id,
      user_id: title[i].user_id,
    };
    await deleteTaskTitle(params);
    setGetTrig(true);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Modal open={showModal}>
        <ClickAwayListener onClickAway={onModalClickAway}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 600,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              p: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {isEditing && (
              <button
                onClick={() => handleDeleteClick(titleModIndex)}
                style={{
                  background: "red",
                  color: "white",
                }}
              >
                {confirmDeletion ? "Click again to delete" : "Delete"}
              </button>
            )}
            <TextField
              type="text"
              ref={titleRef}
              label="Task Title"
              value={title[titleModIndex]?.task_title}
              onChange={(e) =>
                handleTasTitleChange(titleModIndex, e.target.value)
              }
              sx={{ marginTop: "10px", width: "auto" }}
            />
            <TextField
              type="text"
              label="Task Description"
              multiline
              minRows={3}
              value={title[titleModIndex]?.task_description}
              onChange={(e) =>
                handleTaskDescChange(titleModIndex, e.target.value)
              }
              sx={{ marginTop: "10px", width: "auto" }}
            />

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <Button ref={btn1Ref} onClick={(e) => handleResponse(0)}>
                Save
              </Button>
              <Button ref={btn2Ref} onClick={(e) => handleResponse(1)}>
                Discard
              </Button>
            </Box>
          </Box>
        </ClickAwayListener>
      </Modal>
      {title !== "" &&
        title.map((title, index) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Box
              sx={{
                cursor: "pointer",
              }}
              onClick={(e) => handleEditClick(index)}
            >
              Edit
            </Box>
            <Box
              onClick={(e) => handleOnClick(index)}
              type="text"
              sx={{
                cursor: "pointer",
                marginTop: "10px",
                width: "500px",
                border: "1px solid black",
              }}
            >
              <Box>{title.task_title}</Box>
              <Box>{title.task_description}</Box>
            </Box>
          </div>
        ))}

      {addNew === false && <button onClick={addTitle}>+</button>}
    </Box>
  );
}
