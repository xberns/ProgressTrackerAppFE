
import React from 'react';
import { Grid} from '@mui/material';
import '../App.css'
import Calendar from '../DatePicker/Calendar'
import Tasks from '../SubComponents/Tasks'
import ProgressCircle from '../SubComponents/ProgressCircle'
import Notes from '../SubComponents/Notes'
const MainUI = () => {
  
 
  
  return (
    <div className="backgroundStyle">
      <Grid sx={{ display: 'flex', height: '100px', width: '100%', border: '1px solid black' }}>
       <Calendar></Calendar>
      </Grid>

       <Grid sx = {{display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '20px', height: '80%', width : '100%', border : '1px solid black', marginTop: '30px' }} >
         <Grid  sx = {{display: 'flex', flexDirection: 'row',  height: '100%', width : '40%', border : '1px solid black' }}>
          <Tasks></Tasks>
         </Grid>
          <Grid  sx = {{display: 'flex', flexDirection: 'column',  height: '100%', width : '40%', border : '1px solid black' }}>
          <Grid sx = {{display: 'flex', flexDirection: 'row',  height: '50%', width : '100%', border : '1px solid black' }}>
          <ProgressCircle></ProgressCircle>
          </Grid>
          <Grid sx = {{display: 'flex', flexDirection: 'row',  height: '50%', width : '100%', border : '1px solid black' }}>
            <Notes></Notes>
          </Grid>
          </Grid>
       </Grid>
       </div>

  );
};

export default MainUI;
