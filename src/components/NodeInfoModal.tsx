import { Box, Typography } from "@mui/material";
import { PencilSimpleLine, TrashSimple, XSquare } from "phosphor-react";
import { modalStyle } from "./modalStyle";

export default function NodeInfoModal({handleCloseModal, nodeInfoToShow}): JSX.Element {
  const typeLabel = nodeInfoToShow.data.type === "process" ? "Processo:" : "Subprocesso:";
  
  return (
    <Box sx={modalStyle}>
      <div style={{alignSelf: "flex-end", marginBottom: "1rem"}}>
        <PencilSimpleLine size={25} style={{marginRight: "0.5rem", cursor: "pointer"}} />
        <TrashSimple size={25} style={{marginRight: "0.5rem", cursor: "pointer"}}/>
        <XSquare size={25} style={{cursor: "pointer"}} onClick={handleCloseModal}/>
      </div>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        <strong>{typeLabel}</strong> {nodeInfoToShow.data.label}
      </Typography>
      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
        <strong>Descrição:</strong><br></br>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
      </Typography>
    </Box>

  );
}