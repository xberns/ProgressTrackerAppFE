import React, { useEffect, useState, useRef, useMemo } from "react";
import { Box, Button, Grid, TextField, Typography, Modal } from "@mui/material";
import {
  getAllSubTask,
  modifyTaskContent,
  postTaskContents,
  getTaskContents,
  deleteTaskContent,
  updateTasksOrder,
  updateStatus,
} from "../Controller/TasksController";
import {
  Popper,
  MenuList,
  MenuItem,
  Grow,
  Paper,
  ClickAwayListener,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "../App.css";
import { getDateTime } from "../mainslice/commonUtils";
import Modals from "../mainslice/commonModal";
import SubTasks from "./SubTasks";
export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const user_id = "initial";
  const title_id = 1;
  const [showOptions, setShowOptions] = useState(false);
  const [tasksIndex, setTasksIndex] = useState(0); // index holder for which item changed status
  const [taskModIndex, setTaskModIndex] = useState(""); // index for task mod save or cancel
  const [anchorRef, setAnchorRef] = useState(null);
  const [isEditing, setIsEditing] = useState(true);
  const [getTrig, setGetTrig] = useState(true);

  const [subTask, setSubTask] = useState([]);
  const [getSubTasks, setGetSubTasks] = useState(true);
  const [orderChanged, setOrderChanged] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [addNew, setAddNew] = useState(false);
  const [continued, setContinue] = useState(false); //Continued editing contents

  /// Modal control
  const mes = "Do you want to save your changes?";
  const [showModal, setShowModal] = useState("");
  const [message, setMessage] = useState(mes);
  const [option1, setOption1] = useState("Yes");
  const [option2, setOption2] = useState("No");

  const inputRef = useRef([]);

  const statusOptions = ["New", "In Progress", "Completed", "On Hold"];

  const handleGetSubTaskTrig = (trig) => {
    setGetSubTasks(trig);
  };
  useEffect(() => {
    const params = {
      title_id: title_id,
      user_id: "hi",
    };
    if (getTrig === true) {
      const fetchTasks = async () => {
        const data = await getTaskContents(params);
        if (data === "0") {
          setTasks("");
        } else if (data != null) {
          setTasks(data);
        }
      };
      fetchTasks();
    }

    setGetTrig(false);
  }, [getTrig]);
  useEffect(() => {
    const params = {
      title_id: title_id,
      user_id: user_id,
    };
    if (getSubTasks === true) {
      const fetchSubtask = async () => {
        const data = await getAllSubTask(params);
        if (data === "0") {
          setSubTask([]);
        } else if (data != null) {
          setSubTask(data);
        }
      };
      fetchSubtask();
    }
    setGetSubTasks(false);
  }, [getSubTasks]);

  const toSubtask = useMemo(() => {
    const subtaskPerTask = subTask.reduce((subtask, contents) => {
      if (!subtask[contents.content_id]) subtask[contents.content_id] = [];
      subtask[contents.content_id].push(contents);
      return subtask;
    }, {});
    return subtaskPerTask;
  }, [subTask]);
  const handleClick = (taskIndex, anchorElement) => {
    setTasksIndex(taskIndex);
    setAnchorRef(anchorElement);
    setShowOptions((prev) => !prev);
  };

  const handleOptionSelect = (taskIndex, option) => {
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex].status = statusOptions.indexOf(option);
    updatedTasks[taskIndex].status_modified = getDateTime();
    setTasks(updatedTasks);
    handleStatusSave(taskIndex);
  };

  const handleStatusSave = async (e) => {
    const params = {
      id: tasks[e].id,
      title_id: tasks[e].title_id,
      status: tasks[e].status,
      status_modified: tasks[e].status_modified,
    };
    await updateStatus(params);
    setGetTrig(true);
    setShowOptions(false);
  };

  const handleResponse = (res) => {
    if (addNew === true || hasChanges === true) {
      handleAddModTask(res);
    } else {
      handleDeleteTask(res);
    }
  };
  const handleDeleteTask = (res) => {
    if (res === 0) {
      removeTask(tasksIndex);
    } else {
      setDefault();
    }
    setTasksIndex("");
  };
  const deleteTask = (index) => {
    setShowModal(true);
    setTasksIndex(index);
    setMessage("Do you want to delete this task?");
  };
  const removeTask = async (i) => {
    const params = {
      id: tasks[i].id,
      title_id: tasks[i].title_id,
    };
    await deleteTaskContent(params);
    setGetTrig(true);
    setDefault();
  };
  const handleAddModTask = (res) => {
    const i = taskModIndex;
    if (addNew === true) {
      if (hasChanges === false) {
        if (res === 0) {
          continueEditing();
        } else {
          handleCancelNewTask(i);
        }
      } else {
        if (res === 0) {
          handleAddNewTaskContent(i);
        } else {
          handleCancelNewTask(i);
        }
      }
    } else {
      if (res === 0) {
        handleModTaskContent(i);
      } else {
        handleClickCancel();
      }
    }
  };
  const continueEditing = () => {
    setContinue(true);
    setShowModal(false);
  };
  const handleCancelNewTask = (i) => {
    const updatedTask = [...tasks];
    updatedTask.splice(i, 1);
    setTasks(updatedTask);

    setDefault();
  };
  const handleAddNewTaskContent = (i) => {
    setAddNew(false);
    setHasChanges(false);
    saveNewTaskContent(i);
  };
  const saveNewTaskContent = async (i) => {
    const params = {
      id: tasks[i].id,
      title_id: tasks[i].title_id,
      task_details: tasks[i].task_details,
      task_order: tasks[i].task_order,
      date_created: tasks[i].date_created,
    };
    await postTaskContents(params);
    setDefault();
  };

  const addTask = () => {
    setTasks([
      ...tasks,
      {
        title_id: 1,
        task_order: tasks.length === 0 ? 0 : tasks.length,
        task_details: "",
        date_created: getDateTime(),
        status: 0,
      },
    ]);
    setIndex();
  };
  const setIndex = () => {
    const i = tasks.length;
    setTaskModIndex(i);
    setAddNew(true);
  };
  useEffect(() => {
    const i = taskModIndex;
    if (addNew === true || continued === true) {
      if (inputRef.current[i]) {
        inputRef.current[i].focus();
      }
      setContinue(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addNew, continued]);

  const handleFocus = (index) => {
    setTaskModIndex(index);
  };
  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      if (inputRef.current[index]) {
        inputRef.current[index].blur();
      }
      handleModTaskContent(index);
    }
  };

  const handleTaskChange = (index, value) => {
    setHasChanges(true);
    const updatedTask = [...tasks];
    updatedTask[index].task_details = value;
    setTasks(updatedTask);
  };
  const handleClickSave = (i) => {
    if (addNew === true) {
      if (hasChanges === false) {
        handleOnBlur();
      } else {
        handleAddNewTaskContent(i);
      }
    } else {
      saveModifiedTaskContent(i);
      setDefault();
    }
  };
  const handleClickCancel = () => {
    if (addNew === true) {
      handleCancelNewTask(taskModIndex);
    } else setDefault();
  };
  const handleModTaskContent = (i) => {
    saveModifiedTaskContent(i);
    setDefault();
  };

  const setDefault = () => {
    if (hasChanges === false) {
      if (addNew === true) {
      }
      setTaskModIndex("");
    } else {
      setGetTrig(true);
      setHasChanges(false);
      setTaskModIndex("");
    }

    if (addNew === true) {
      setAddNew(false);
      setContinue(false);
    }
    if (showModal === true) {
      setShowModal(false);
      setMessage(mes);
    }
  };

  const handleOnBlur = () => {
    if (hasChanges === true || addNew === true) {
      setShowModal(true);
      if (addNew === true) {
        if (tasks[taskModIndex].task_details === "") {
          setHasChanges(false);
          setMessage("Do you want to continue editing?");
        }
      }
    } else {
      setTaskModIndex("");
    }
  };
  const saveModifiedTaskContent = async (i) => {
    const params = {
      id: tasks[i].id,
      title_id: tasks[i].title_id,
      task_order: tasks[i].task_order,
      task_details: tasks[i].task_details,
      date_created: tasks[i].date_created,
    };
    await modifyTaskContent(params);
  };

  const handleClose = (event) => {
    if (anchorRef && anchorRef.contains(event.target)) {
      return;
    }
    setShowOptions(false);
  };
  const handleEditOrder = (b) => {
    setIsEditing(b);
  };
  const handleSaveOrderChange = async () => {
    if (orderChanged === true) {
      const newData = tasks.map(
        ({ taskSubContents, taskTitle, ...rest }) => rest
      );
      await updateTasksOrder(newData);

      setGetTrig(true);
    }
  };

  useEffect(() => {
    if (orderChanged === true) {
      handleSaveOrderChange();
    }
    setOrderChanged(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderChanged]);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) return;
    setOrderChanged(true);
    const reorderedTasks = Array.from(tasks);
    const [movedTask] = reorderedTasks.splice(source.index, 1);
    reorderedTasks.splice(destination.index, 0, movedTask);
    setTasks(reorderedTasks);
  };
  return (
    <div style={{ width: "100%" }}>
      <Modals
        open={showModal}
        message={message}
        option1={option1}
        option2={option2}
        response={handleResponse}
      />
      <Grid container justifyContent="flex-end">
        {isEditing === false && (
          <Button onClick={() => handleEditOrder(true)}>Edit</Button>
        )}
        {isEditing === true && (
          <Button onClick={() => handleEditOrder(false)}>StopEdit</Button>
        )}
      </Grid>

      {tasks !== "" && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tasks" direction="vertical">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{ padding: "10px 0" }}
              >
                {tasks.map((task, index) => (
                  <Draggable
                    key={task.id}
                    draggableId={String(task.id)}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                          ...provided.draggableProps.style,
                          marginBottom: "10px",
                          padding: "10px",
                          borderRadius: "4px",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          {isEditing === true && (
                            <div
                              style={{
                                cursor: "grab",
                                padding: "5px 10px",
                                borderRadius: "4px",
                              }}
                              {...provided.dragHandleProps}
                            >
                              ☰
                            </div>
                          )}

                          <TextField
                            sx={{
                              width: "500px",
                              "& .MuiInputBase-root": {
                                border: "none",
                                "& fieldset": {
                                  border: "none",
                                },
                              },
                            }}
                            type="text"
                            value={task.date_created}
                            readOnly
                          />
                        </div>
                        {/* Status & Task Content */}
                        <div
                          className="custom-button-container"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: "10px",
                          }}
                        >
                          <button
                            className="custom-button"
                            onClick={(event) =>
                              handleClick(index, event.currentTarget)
                            }
                            style={{ padding: "5px 15px", marginRight: "10px" }}
                          >
                            {statusOptions[task.status]}
                          </button>
                          <TextField
                            type="text"
                            inputRef={(el) => (inputRef.current[index] = el)}
                            onFocus={(e) => handleFocus(index)}
                            onBlur={(e) => handleOnBlur(index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            value={task.task_details}
                            onChange={(e) =>
                              handleTaskChange(index, e.target.value)
                            }
                            sx={{ marginTop: "10px", width: "500px" }}
                          />{" "}
                          {index === taskModIndex && (
                            <Box
                              sx={{
                                marginLeft: 1,
                                display: "flex",
                                flexDirection: "row",
                                gap: 1,
                              }}
                            >
                              <Button
                                variant="contained"
                                color="primary"
                                onMouseDown={() =>
                                  handleClickSave(taskModIndex)
                                }
                              >
                                yes
                              </Button>
                              <Button
                                variant="contained"
                                color="primary"
                                onMouseDown={handleClickCancel}
                              >
                                no
                              </Button>
                            </Box>
                          )}
                          {isEditing && (
                            <button
                              onClick={() => deleteTask(index)}
                              style={{
                                marginLeft: "10px",
                                background: "red",
                                color: "white",
                              }}
                            >
                              -
                            </button>
                          )}
                          <Popper
                            sx={{ zIndex: 1 }}
                            open={showOptions && anchorRef}
                            anchorEl={anchorRef}
                            role={undefined}
                            transition
                            disablePortal
                          >
                            {({ TransitionProps, placement }) => (
                              <Grow
                                {...TransitionProps}
                                style={{
                                  transformOrigin:
                                    placement === "bottom"
                                      ? "center top"
                                      : "center bottom",
                                }}
                              >
                                <Paper>
                                  <ClickAwayListener onClickAway={handleClose}>
                                    <MenuList
                                      autoFocusItem
                                      sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        padding: 0,
                                        gap: "10px",
                                        margin: 0.5,
                                      }}
                                    >
                                      {statusOptions.map(
                                        (option, optionIndex) => (
                                          <MenuItem
                                            key={optionIndex}
                                            onClick={() =>
                                              handleOptionSelect(
                                                tasksIndex,
                                                option
                                              )
                                            }
                                            sx={{
                                              minWidth: "auto",
                                              padding: "5px 15px",
                                            }}
                                          >
                                            {option}
                                          </MenuItem>
                                        )
                                      )}
                                    </MenuList>
                                  </ClickAwayListener>
                                </Paper>
                              </Grow>
                            )}
                          </Popper>
                        </div>

                        <SubTasks
                          trig={handleGetSubTaskTrig}
                          title_id={title_id}
                          content_id={task.id}
                          isEditing={isEditing}
                          subtask={toSubtask[task.id] || []}
                        ></SubTasks>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {addNew === false && <button onClick={addTask}>+ Add Task</button>}
    </div>
  );
}
