import { useEffect, useState, useRef } from "react"; // remider to orgaanize the functions  and vaariables after finalizing task functionality
import { Box, Button, TextField } from "@mui/material";
import {
  modifySubTask,
  postSubTask,
  getSubTask,
  deleteSubTask,
  updateSubTasksOrder,
  updateSubTaskStatus,
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
export default function SubTasks(props) {
  const id = props.content_id; //title id (as of now)
  const isEditing = props.isEditing;

  const [subtasks, setSubtasks] = useState(props.subtask);

  const [showOptions, setShowOptions] = useState(false);
  const [tasksIndex, setTasksIndex] = useState(0); // index holder for which item changed status
  const [taskModIndex, setTaskModIndex] = useState(""); // index for task mod save or cancel
  const [anchorRef, setAnchorRef] = useState(null);

  const [getTrig, setGetTrig] = useState(false);

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

  useEffect(() => {
    setSubtasks(props.subtask);
  }, [props.subtask]);

  const handleClick = (taskIndex, anchorElement) => {
    setTasksIndex(taskIndex);
    setAnchorRef(anchorElement);
    setShowOptions((prev) => !prev);
  };

  const handleOptionSelect = (taskIndex, option) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[taskIndex].status = statusOptions.indexOf(option);
    updatedSubtasks[taskIndex].status_modified = getDateTime();
    setSubtasks(updatedSubtasks);
    handleStatusSave(taskIndex);
  };

  const handleStatusSave = async (e) => {
    const params = {
      id: subtasks[e].id,
      content_id: subtasks[e].content_id,
      status: subtasks[e].status,
      status_modified: subtasks[e].status_modified,
    };
    await updateSubTaskStatus(params);
    props.trig(true);
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
      id: subtasks[i].id,
      content_id: subtasks[i].content_id,
    };
    await deleteSubTask(params);
    props.trig(true);
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
    const updatedSubtask = [...subtasks];
    updatedSubtask.splice(i, 1);
    setSubtasks(updatedSubtask);

    setDefault();
  };
  const handleAddNewTaskContent = (i) => {
    setAddNew(false);
    setHasChanges(false);
    saveNewTaskContent(i);
  };
  const saveNewTaskContent = async (i) => {
    const params = {
      id: subtasks[i].id,
      title_id: subtasks[i].title_id,
      content_id: subtasks[i].content_id,
      subtask: subtasks[i].subtask,
      subtask_order: subtasks[i].subtask_order,
      date_created: subtasks[i].date_created,
    };
    await postSubTask(params);
    props.trig(true);
    setDefault();
  };

  const addSubtask = () => {
    setSubtasks([
      ...subtasks,
      {
        title_id: 1,
        content_id: props.content_id,
        subtask_order: subtasks.length === 0 ? 0 : subtasks.length,
        subtask: "",
        date_created: getDateTime(),
        status: 0,
      },
    ]);
    setIndex();
  };
  const setIndex = () => {
    const i = subtasks.length;
    setTaskModIndex(i);
    setAddNew(true);
  };

  useEffect(() => {
    //
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
    const updatedSubtask = [...subtasks];
    updatedSubtask[index].subtask = value;
    setSubtasks(updatedSubtask);
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
      props.trig(true);
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
        if (subtasks[taskModIndex].subtask === "") {
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
      id: subtasks[i].id,
      title_id: subtasks[i].title_id,
      content_id: subtasks[i].content_id,
      subtask_order: subtasks[i].subtask_order,
      subtask: subtasks[i].subtask,
      date_created: subtasks[i].date_created,
    };
    await modifySubTask(params);
  };

  const handleClose = (event) => {
    if (anchorRef && anchorRef.contains(event.target)) {
      return;
    }
    setShowOptions(false);
  };
  const handleSaveOrderChange = async () => {
    if (orderChanged === true) {
      const newData = subtasks.map(
        ({ taskSubContents, taskTitle, ...rest }) => rest
      );
      await updateSubTasksOrder(newData);

      props.trig(true);
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
    const reorderedTasks = Array.from(subtasks);
    const [movedTask] = reorderedTasks.splice(source.index, 1);
    reorderedTasks.splice(destination.index, 0, movedTask);
    setSubtasks(reorderedTasks);
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

      {subtasks !== "" && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="subtasks" direction="vertical">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{ padding: "10px 0" }}
              >
                {subtasks.map((subtaskss, index) => (
                  <Draggable
                    key={subtaskss.id}
                    draggableId={String(subtaskss.id)}
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
                            value={subtaskss.date_created}
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
                            {statusOptions[subtaskss.status]}
                          </button>
                          <TextField
                            type="text"
                            inputRef={(el) => (inputRef.current[index] = el)}
                            onFocus={(e) => handleFocus(index)}
                            onBlur={(e) => handleOnBlur(index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            value={subtaskss.subtask}
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

      {addNew === false && <button onClick={addSubtask}>+ Add Subtask</button>}
    </div>
  );
}
