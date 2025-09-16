import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import '../App.css'
import {postNotes,updateNotes, getNotes , deleteNotes} from '../Controller/NotesController'
import {getDateOnly} from "../mainslice/commonUtils"


export default function Notes ()
{
    const [date, setDate] = useState(getDateOnly());
    const [notes, setNotes] = useState("");
    const [params, setParams] = useState();
    const [getTrig, setGetTrig] = useState (true);
    const [toUpdate, setToUpdate] = useState (false);
   useEffect(() => {
  if (getTrig){
    const fetchNotes = async () => {
    try {
      const data = await getNotes({date});
      if (data != null)
      {
       setToUpdate(true);
       setNotes(data);
      }
      else{
        setToUpdate(false);
      }
      
    } catch (error) {
      console.error("Fetch failed", error);
      setNotes("Failed to load note.");
    }
    };
    setGetTrig(false);
    fetchNotes();
  }
  }, [notes, getTrig]);
     
  useEffect(()=> {
   setParams( { Date_created: date, Notes_content: notes});
    }
  , [notes]);

    const handleClick = async  () => {
    if (params.Notes_content != null)
    {
      if (toUpdate === true)
      {
        await updateNotes (params);
      }
      else
      {
        await postNotes (params)
      }
      setGetTrig(true);
    }
  };

    const handleClear = async () => {
     if (toUpdate){ 
      await deleteNotes({date});
     }
      setGetTrig(true);
      setNotes("");
      
    };


  return (
      <Box
      sx={{
        width: '100%',
        height: '100%',
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography sx = {{display: 'flex',height : '15%'}} variant="h6">Note</Typography>
      <Button onClick={handleClear}> Delete all</Button>
      <Box sx = {{height: '70%', overflow: 'auto',}}>
        <TextField
        multiline
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        fullWidth
                sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              border: 'none',
              
            },
          },
        }}
      />
      </Box>
     
      <Button sx = {{marginTop: '10px'}}variant="contained" onClick={handleClick}>
        Save Note
      </Button>
    </Box>
  );
};

