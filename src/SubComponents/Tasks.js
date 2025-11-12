import { useEffect, useState, useRef, useMemo } from "react";
import { Box, Button, Grid, TextField } from "@mui/material";
import {
  getAllSubTask,
  getTaskContents,
  postTaskContents,
  modifyTaskContent,
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
  //From props
  const user_id = "initial";
  const title_id = 1;

  //Tasks
  const [getTrig, setGetTrig] = useState(true);
  const [tasks, setTasks] = useState([]);

  const [addNew, setAddNew] = useState(false);

  //Task content modification control
  const [taskModIndex, setTaskModIndex] = useState("");
  const [isEditing, setIsEditing] = useState(true);
  const [continued, setContinueEditing] = useState(false);
  const [hasContentChanges, setHasContentChanges] = useState(false);
  const [orderChanged, setOrderChanged] = useState(false);

  //For Task content textfield inputRef control
  const inputRef = useRef([]);

  //Status
  const [showStatusOptions, setShowStatusOptions] = useState(false);
  const [selectedTask, setSelectedTask] = useState(0);
  const [statusAnchorRef, setStatusAnchorRef] = useState(null);
  const statusOptions = ["New", "In Progress", "Completed", "On Hold"];

  //Subtask
  const [subTask, setSubTask] = useState([]);
  const [getSubTasks, setGetSubTasks] = useState(true);

  /// Modal control
  const [showModal, setShowModal] = useState("");
  const mes = "Do you want to save your changes?";
  const [message, setMessage] = useState(mes);
  const option1 = "Yes";
  const option2 = "No";

  //Task Get
  useEffect(() => {
    const params = {
      title_id: title_id,
      user_id: "hi",
    };
    if (getTrig === true) {
      const fetchTasks = async () => {
        const data = await getTaskContents(params);
        if (data === "0") {
          setTasks([]);
        } else if (data != null) {
          setTasks(data);
        }
      };
      fetchTasks();
    }
    setGetTrig(false);
  }, [getTrig]);

  const handleGetSubTaskTrig = (trig) => {
    setGetSubTasks(trig);
  };

  //Subtask
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

  //Status
  const handleStatusSelect = (statusIndex, anchorElement) => {
    setSelectedTask(statusIndex);
    setStatusAnchorRef(anchorElement);
    setShowStatusOptions((prev) => !prev);
  };

  const handleStatusSelected = (taskIndex, option) => {
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
    setShowStatusOptions(false);
  };
  const handleStatusPopperClose = (event) => {
    if (statusAnchorRef && statusAnchorRef.contains(event.target)) {
      return;
    }
    setShowStatusOptions(false);
  };

  //Add New Task
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

  const handleAddNewTaskContent = (i) => {
    saveNewTaskContent(i);
    setAddNew(false);
    setHasContentChanges(false);
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

  useEffect(() => {
    const i = taskModIndex;
    if (addNew === true || continued === true) {
      if (inputRef.current[i]) {
        inputRef.current[i].focus();
      }
      setContinueEditing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addNew, continued]);

  const handleCancelNewTask = (i) => {
    const updatedTask = [...tasks];
    updatedTask.splice(i, 1);
    setTasks(updatedTask);

    setDefault();
  };

  //Save Modified Task
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

  //Modal
  const handleModalResponse = (res) => {
    if (addNew === true || hasContentChanges === true) {
      handleAddModTask(res);
    } else {
      handleDeleteTask(res);
    }
  };

  //Task Textfield Props
  const handleTaskTextfieldFocus = (index) => {
    setTaskModIndex(index);
  };

  const handleTaskTextfieldOnBlur = () => {
    if (hasContentChanges === true || addNew === true) {
      setShowModal(true);
      if (addNew === true) {
        if (tasks[taskModIndex].task_details === "") {
          setHasContentChanges(false);
          setMessage("Do you want to continue editing?");
        }
      }
    } else {
      setTaskModIndex("");
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      if (inputRef.current[index]) {
        inputRef.current[index].blur();
      }
      handleModTaskContent(index);
    }
  };

  //Add and Modify Task Control
  const handleAddModTask = (res) => {
    const i = taskModIndex;
    if (addNew === true) {
      if (hasContentChanges === false) {
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
    setContinueEditing(true);
    setShowModal(false);
  };

  const handleTaskChange = (index, value) => {
    setHasContentChanges(true);
    const updatedTask = [...tasks];
    updatedTask[index].task_details = value;
    setTasks(updatedTask);
  };

  const handleModTaskContent = (i) => {
    saveModifiedTaskContent(i);
    setDefault();
  };

  //Save and Cancel Button Control
  const handleClickSave = (i) => {
    if (addNew === true) {
      if (hasContentChanges === false) {
        handleTaskTextfieldOnBlur();
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

  //Default Control
  const setDefault = () => {
    if (hasContentChanges === false) {
      if (addNew === true) {
      }
      setTaskModIndex("");
    } else {
      setGetTrig(true);
      setHasContentChanges(false);
      setTaskModIndex("");
    }

    if (addNew === true) {
      setAddNew(false);
      setContinueEditing(false);
    }
    if (showModal === true) {
      setShowModal(false);
      setMessage(mes);
    }
  };

  //Edit Control (Delete Task and Task Order Change)
  const handleEditClick = (b) => {
    setIsEditing(b);
  };
  //Task Order Change
  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) return;
    setOrderChanged(true);
    const reorderedTasks = Array.from(tasks);
    const [movedTask] = reorderedTasks.splice(source.index, 1);
    reorderedTasks.splice(destination.index, 0, movedTask);
    setTasks(reorderedTasks);
  };
  useEffect(() => {
    if (orderChanged === true) {
      handleSaveOrderChange();
    }
    setOrderChanged(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderChanged]);

  const handleSaveOrderChange = async () => {
    if (orderChanged === true) {
      const newData = tasks.map(
        ({ taskSubContents, taskTitle, ...rest }) => rest
      );
      await updateTasksOrder(newData);

      setGetTrig(true);
    }
  };

  //Delete Task
  const handleDeleteTask = (res) => {
    if (res === 0) {
      removeTask(taskModIndex);
    } else {
      setDefault();
    }
    setTaskModIndex("");
  };
  const deleteTask = (index) => {
    setShowModal(true);
    setTaskModIndex(index);
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

  return (
    <div style={{ width: "100%" }}>
      <Modals
        open={showModal}
        message={message}
        option1={option1}
        option2={option2}
        response={handleModalResponse}
      />
      <Grid container justifyContent="flex-end">
        {isEditing === false && (
          <Button onClick={() => handleEditClick(true)}>Edit</Button>
        )}
        {isEditing === true && (
          <Button onClick={() => handleEditClick(false)}>StopEdit</Button>
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
                              handleStatusSelect(index, event.currentTarget)
                            }
                            style={{ padding: "5px 15px", marginRight: "10px" }}
                          >
                            {statusOptions[task.status]}
                          </button>
                          <TextField
                            type="text"
                            inputRef={(el) => (inputRef.current[index] = el)}
                            onFocus={(e) => handleTaskTextfieldFocus(index)}
                            onBlur={(e) => handleTaskTextfieldOnBlur(index)}
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
                            open={showStatusOptions && statusAnchorRef}
                            anchorEl={statusAnchorRef}
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
                                  <ClickAwayListener
                                    onClickAway={handleStatusPopperClose}
                                  >
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
                                              handleStatusSelected(
                                                selectedTask,
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
