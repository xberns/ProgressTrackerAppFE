import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import '../App.css'
import {postNotes, getNotes} from '../Controller/NotesController'


export default function Notes ()
{
    const [date, setDate] = useState("2025-08-30");
    const [notes, setNotes] = useState("");
    const [params, setParams] = useState();
     const [datessss, setDatess] = useState({date : "2025-08-30"});
 
  
    useEffect(()=> {
     const fetchNotes = async () => {
        const datas = await getNotes(datessss);
        setNotes(datas);
     }
    fetchNotes();

    }, [datessss]
  );
     
  useEffect(()=> {
   setParams( { Date_created: date, Notes_content: notes});
    }
  , [notes]);

    const handleClick = async  () => {
      console.log(params);
    if (params.Notes_content != null)
    {
    await postNotes (params)
  }
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

