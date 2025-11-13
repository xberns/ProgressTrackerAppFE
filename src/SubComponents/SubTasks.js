import { useEffect, useState, useRef } from "react"; // remider to orgaanize the functions  and vaariables after finalizing task functionality
import { Box, Button, TextField } from "@mui/material";
import {
  postSubTask,
  modifySubTask,
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
  //From props
  const title_id = props.title_id;
  const content_id = props.content_id;
  const isEditing = props.isEditing;

  //Subtask
  const [subtasks, setSubtasks] = useState(props.subtask);
  const [addNew, setAddNew] = useState(false);

  //Subtask Modification control
  const [subtaskModIndex, setSubtaskModIndex] = useState("");
  const [continued, setContinueEditing] = useState(false);
  const [hasSubtaskChanges, setHasSubtaskChanges] = useState(false);
  const [orderChanged, setOrderChanged] = useState(false);

  //For Subtask textfield inputRef control
  const inputRef = useRef([]);
  const [isEnter, setIsEnter] = useState(false);
  const [inputOnBlurControl, setInputOnBlurControl] = useState(false);

  //Status
  const [showStatusOptions, setShowStatusOptions] = useState(false);

  const [selectedSubtask, setSelectedSubtask] = useState(0);
  const [statusAnchorRef, setStatusAnchorRef] = useState(null);
  const statusOptions = ["New", "In Progress", "Completed", "On Hold"];

  /// Modal control
  const [showModal, setShowModal] = useState("");
  const mes = "Do you want to save your changes?";
  const [message, setMessage] = useState(mes);
  const option1 = "Yes";
  const option2 = "No";

  //Subtask immediate update
  useEffect(() => {
    setSubtasks(props.subtask);
  }, [props.subtask]);

  //Status
  const handleStatusSelect = (subtaskIndex, anchorElement) => {
    setSelectedSubtask(subtaskIndex);
    setStatusAnchorRef(anchorElement);
    setShowStatusOptions((prev) => !prev);
  };

  const handleStatusSelected = (taskIndex, option) => {
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
    setShowStatusOptions(false);
  };

  const handleStatusPopperClose = (event) => {
    if (statusAnchorRef && statusAnchorRef.contains(event.target)) {
      return;
    }
    setShowStatusOptions(false);
  };

  // Add new subtask
  const addSubtask = () => {
    setSubtasks([
      ...subtasks,
      {
        title_id: title_id,
        content_id: content_id,
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
    setSubtaskModIndex(i);
    setAddNew(true);
  };

  const handleAddNewSubTaskContent = (i) => {
    saveNewSubTaskContent(i);
    setAddNew(false);
    setHasSubtaskChanges(false);
  };
  const saveNewSubTaskContent = async (i) => {
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

  useEffect(() => {
    //
    const i = subtaskModIndex;
    if (addNew === true || continued === true) {
      if (inputRef.current[i]) {
        inputRef.current[i].focus();
      }
      setContinueEditing(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addNew, continued]);

  const handleCancelNewSubTask = (i) => {
    const updatedSubtask = [...subtasks];
    updatedSubtask.splice(i, 1);
    setSubtasks(updatedSubtask);

    setDefault();
  };

  //Save modified subtask
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

  //Modal
  const handleModalResponse = (res) => {
    if (addNew === true || hasSubtaskChanges === true) {
      handleAddModSubTask(res);
    } else {
      handleDeleteSubTask(res);
    }
  };

  //Task Textfield Props
  const handleSubTaskTextfieldFocus = (index) => {
    setSubtaskModIndex(index);
  };
  const handlSubTaskTextfieldOnBlur = () => {
    setInputOnBlurControl(true);
  };
  const handleShowModal = () => {
    setShowModal(true);
  };
  useEffect(() => {
    if (inputOnBlurControl === true) {
      if (hasSubtaskChanges === true || addNew === true) {
        handleShowModal();
        if (addNew === true) {
          if (subtasks[subtaskModIndex].subtask === "") {
            setHasSubtaskChanges(false);
            setMessage("Do you want to continue editing?");
          }
        }
      } else {
        setSubtaskModIndex("");
      }
    }
    setInputOnBlurControl(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputOnBlurControl]);

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      if (inputRef.current[index]) {
        inputRef.current[index].blur();
      }
      handleModSubTaskContent(index);
    }
  };

  //Add and Modify Task Control
  const handleAddModSubTask = (res) => {
    const i = subtaskModIndex;
    if (addNew === true) {
      if (hasSubtaskChanges === false) {
        if (res === 0) {
          continueEditing();
        } else {
          handleCancelNewSubTask(i);
        }
      } else {
        if (res === 0) {
          handleAddNewSubTaskContent(i);
        } else {
          handleCancelNewSubTask(i);
        }
      }
    } else {
      if (res === 0) {
        handleModSubTaskContent(i);
      } else {
        handleClickCancel();
      }
    }
  };
  const continueEditing = () => {
    setContinueEditing(true);
    setShowModal(false);
  };

  const handleSubTaskChange = (index, value) => {
    setHasSubtaskChanges(true);
    const updatedSubtask = [...subtasks];
    updatedSubtask[index].subtask = value;
    setSubtasks(updatedSubtask);
  };

  const handleModSubTaskContent = (i) => {
    saveModifiedTaskContent(i);
    setIsEnter(false);
    setDefault();
  };

  //Save and Cancel Button Control
  const handleClickSave = (i) => {
    if (addNew === true) {
      if (hasSubtaskChanges === false) {
        handlSubTaskTextfieldOnBlur();
      } else {
        handleAddNewSubTaskContent(i);
      }
    } else {
      saveModifiedTaskContent(i);
      setDefault();
    }
  };

  const handleClickCancel = () => {
    if (addNew === true) {
      handleCancelNewSubTask(subtaskModIndex);
    } else setDefault();
  };

  //Default Control
  const setDefault = () => {
    if (hasSubtaskChanges === false) {
      if (addNew === true) {
      }
      setSubtaskModIndex("");
    } else {
      props.trig(true);
      setHasSubtaskChanges(false);
      setSubtaskModIndex("");
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

  //Edit Control (Delete Subtask and Subtask Order Change)
  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) return;
    setOrderChanged(true);
    const reorderedSubtasks = Array.from(subtasks);
    const [movedTask] = reorderedSubtasks.splice(source.index, 1);
    reorderedSubtasks.splice(destination.index, 0, movedTask);
    setSubtasks(reorderedSubtasks);
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
      const newData = subtasks.map(
        ({ taskSubContents, taskTitle, ...rest }) => rest
      );
      await updateSubTasksOrder(newData);

      props.trig(true);
    }
  };

  // Delete Subtask
  const handleDeleteSubTask = (res) => {
    if (res === 0) {
      removeSubTask(subtaskModIndex);
    } else {
      setDefault();
    }
    setSubtaskModIndex("");
  };
  const deleteSubtask = (index) => {
    setShowModal(true);
    setSubtaskModIndex(index);
    setMessage("Do you want to delete this task?");
  };
  const removeSubTask = async (i) => {
    const params = {
      id: subtasks[i].id,
      content_id: subtasks[i].content_id,
    };
    await deleteSubTask(params);
    props.trig(true);
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
                              handleStatusSelect(index, event.currentTarget)
                            }
                            style={{ padding: "5px 15px", marginRight: "10px" }}
                          >
                            {statusOptions[subtaskss.status]}
                          </button>
                          <TextField
                            type="text"
                            inputRef={(el) => (inputRef.current[index] = el)}
                            onFocus={(e) => handleSubTaskTextfieldFocus(index)}
                            onBlur={(e) => handlSubTaskTextfieldOnBlur(index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            value={subtaskss.subtask}
                            onChange={(e) =>
                              handleSubTaskChange(index, e.target.value)
                            }
                            sx={{ marginTop: "10px", width: "500px" }}
                          />{" "}
                          {index === subtaskModIndex && (
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
                                  handleClickSave(subtaskModIndex)
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
                              onClick={() => deleteSubtask(index)}
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
                                                selectedSubtask,
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
