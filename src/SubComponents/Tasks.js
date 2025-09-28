import React, { useEffect, useState } from "react";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import {
  postTaskContents,
  getTaskContents,
  updateTasksOrder,
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

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const id = 1;
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [taskStatus, setTaskStatus] = useState({});
  const [anchorRef, setAnchorRef] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [getTrig, setGetTrig] = useState(false);
  const [orderChanged, setOrderChanged] = useState(false);
  const [origTask, setOrigTask] = useState();

  const statusOptions = ["New", "In Progress", "Completed", "On Hold"];

  useEffect(() => {
    if (getTrig === false) {
      const fetchNotes = async () => {
        const data = await getTaskContents({ id });
        if (data != null) {
          setTasks(data);
        }
      };
      fetchNotes();
    }

    setGetTrig(true);
  }, [getTrig]);

  const handleClick = (taskIndex, anchorElement) => {
    setAnchorRef(anchorElement);
    setShowOptions((prev) => !prev);
  };

  const handleOptionSelect = (taskIndex, option) => {
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex].status = statusOptions.indexOf(option);
    updatedTasks[taskIndex].status_modified = new Date();
    setTasks(updatedTasks);
    setTaskStatus((prev) => ({ ...prev, [taskIndex]: option }));
    setShowOptions(false);
  };

  const handleTaskChange = (index, value) => {
    const updatedTask = [...tasks];
    updatedTask[index].task_details = value;
    setTasks(updatedTask);
  };

  const addNote = () => {
    setTasks([
      ...tasks,
      {
        task_details: "",
        date_created: getDateTime(),
        status: 0,
        status_modified: getDateTime(),
      },
    ]);
  };

  const deleteTask = (index) => {
    const updatedTask = [...tasks];
    updatedTask.splice(index, 1);
    setTasks(updatedTask);
  };

  const handleClose = (event) => {
    if (anchorRef && anchorRef.contains(event.target)) {
      return;
    }
    setShowOptions(false);
  };
  const handleEditOrder = () => {
    setIsEditing(true);
    setOrigTask(tasks);
  };
  const handleSaveOrderChange = async () => {
    if (orderChanged === true) {
      const newData = tasks.map(
        ({ taskSubContents, taskTitle, ...rest }) => rest
      );
      await updateTasksOrder(newData);

      setGetTrig(false);
    }
  };
  const handleOrderChanges = async () => {
    const taskCount = tasks.length;
    for (let i = 0; i < taskCount; i++) {
      if (origTask[i].id === tasks[i].id) {
        if (i === taskCount) {
          break;
        }
        continue;
      } else {
        handleSaveOrderChange();
        break;
      }
    }
    setOrderChanged(false);
    setIsEditing(false);
    setOrigTask("");
  };
  // Drag-and-Drop handler
  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) return;
    setOrderChanged(true);
    const reorderedTasks = Array.from(tasks);
    const [movedTask] = reorderedTasks.splice(source.index, 1);
    reorderedTasks.splice(destination.index, 0, movedTask);
    setTasks(reorderedTasks);
    console.log(tasks, " this is tasks");
  };
  return (
    <div style={{ width: "100%" }}>
      <Grid container justifyContent="flex-end">
        {isEditing === false && <Button onClick={handleEditOrder}>Edit</Button>}
        {isEditing === true && (
          <Button onClick={handleOrderChanges}>StopEdit</Button>
        )}
      </Grid>

      {/* Drag-and-drop context */}
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
                          {taskStatus[index] ? taskStatus[index] : "New"}
                        </button>
                        <TextField
                          type="text"
                          value={task.task_details}
                          onChange={(e) =>
                            handleTaskChange(index, e.target.value)
                          }
                          sx={{ marginTop: "10px", width: "500px" }}
                        />
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
                                            handleOptionSelect(index, option)
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

      <button onClick={addNote}>+ Add Note</button>
    </div>
  );
}
