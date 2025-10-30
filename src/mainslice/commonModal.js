import { Box, Button, Typography, Modal } from "@mui/material";

export default function Modals(props) {
  return (
    <Modal open={props.open}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography sx={{ mt: 2 }}>{props.message}</Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <Button onClick={() => props.response(0)}>{props.option1}</Button>
          <Button onClick={() => props.response(1)}>{props.option2}</Button>
        </Box>
      </Box>
    </Modal>
  );
}
