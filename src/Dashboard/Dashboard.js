import { Grid, Box } from "@mui/material";
import "../App.css";
import TaskTitle from "../SubComponents/TaskTitle";
const Dashboard = () => {
  return (
    <div className="backgroundStyle">
      <Grid
        sx={{
          display: "flex",
          height: "100%",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box>
          <TaskTitle />
        </Box>
      </Grid>
    </div>
  );
};

export default Dashboard;
