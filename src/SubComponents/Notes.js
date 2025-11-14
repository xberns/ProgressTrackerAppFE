import React, { useEffect, useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import "../App.css";
import {
  postNotes,
  updateNotes,
  getNotes,
  deleteNotes,
} from "../Controller/NotesController";
import Modals from "../mainslice/commonModal";
import { getDateOnly } from "../mainslice/commonUtils";

export default function Notes() {
  //From prop
  const date = getDateOnly();

  //Notes
  const [getTrig, setGetTrig] = useState(true);
  const [notes, setNotes] = useState("");

  //Add new or modify notes
  const [isNewNote, setisNewNote] = useState(false);

  //Delete button trig
  const [showDeleteButton, setShowDelete] = useState(false);

  //Input field control
  const [hasChange, setHasChange] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  //Saving status control
  const [saving, setSaving] = useState("");
  const [savingTimeout, setSavingTimeout] = useState(null);

  //Modal Control
  const [showModal, setShowModal] = useState(false);
  const message = "Are you sure you want to clear notes?";
  const option1 = "Yes";
  const option2 = "No";

  //Get
  useEffect(() => {
    if (getTrig) {
      const fetchNotes = async () => {
        try {
          const data = await getNotes({ date });
          if (data && data.note === "0") {
            setisNewNote(true);
            setNotes("");
            setShowDelete(false);
          } else {
            setisNewNote(false);
            setNotes(data);
            setShowDelete(true);
          }
        } catch (error) {
          console.error("Fetch failed", error);
          setNotes("Failed to load note.");
        }
      };
      setGetTrig(false);
      setHasChange(false);
      fetchNotes();
    }
  }, [getTrig]);

  //Note change controller
  const handleNoteChange = (e) => {
    setHasChange(true);
    const notes = e.target.value;
    setNotes(notes);
  };

  //Saving status controller
  useEffect(() => {
    if (hasChange === true) {
      if (typingTimeout) clearTimeout(typingTimeout);

      setSaving("Saving...");

      setTypingTimeout(
        setTimeout(() => {
          handleSaveNotes();
        }, 2000) // 2 seconds
      );
    }
  }, [notes]);

  //Saved status controller
  useEffect(() => {
    if (saving === "Saving...") {
      clearTimeout(savingTimeout);
    }
    if (saving === "Saved") {
      if (typingTimeout) clearTimeout(typingTimeout);
      setSavingTimeout(
        setTimeout(() => {
          setSaving("");
        }, 2000) // 2 seconds
      );
    }
  }, [saving]);

  //Save notes
  const handleSaveNotes = async () => {
    setHasChange(false);
    const params = { Date_created: date, Notes_content: notes };
    if (params && params.Notes_content != null) {
      if (isNewNote === true) {
        await postNotes(params);
      } else {
        await updateNotes(params);
      }
      setSaving("Saved");
      setGetTrig(true);
    }
  };

  //Delete notes
  const handleClearNotes = async () => {
    clearTimeout(savingTimeout);
    clearTimeout(typingTimeout);
    setShowModal(true);
    setSaving("");
  };

  const handleModalResponse = (res) => {
    console.log(res);
    if (res === 0) {
      handleDeleteNotes();
    }
  };

  const handleDeleteNotes = async () => {
    if (isNewNote === false) {
      await deleteNotes({ date });
    }
    setGetTrig(true);
    setShowModal(false);
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
      <Modals
        open={showModal}
        message={message}
        option1={option1}
        option2={option2}
        response={handleModalResponse}
      />
      <Typography sx={{ display: "flex", height: "15%" }} variant="h6">
        Note
      </Typography>
      {showDeleteButton === true && (
        <Button onClick={handleClearNotes}> Delete all</Button>
      )}
      <Box sx={{ height: "70%", overflow: "auto" }}>
        <TextField
          multiline
          value={notes}
          onChange={handleNoteChange}
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                border: "none",
              },
            },
          }}
        />
      </Box>

      <Typography>{saving}</Typography>
    </Box>
  );
}
