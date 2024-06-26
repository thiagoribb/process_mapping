import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getProcesses from "../api/getProcesses";
import postProcess from "../api/postProcess";
import postSubprocess from "../api/postSubprocess";
import { createNode } from "../nodes/createNode";
import { Process } from "../types/Process";
import { createOptions } from "../utils/formOptions";
import { modalStyle } from "./modalStyle";

export default function FormModal({handleCloseModal, setNodes, nodes}): JSX.Element {
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [processesList, setProcessesList] = useState<Process[]>([]);
  const [processId, setProcessId] = useState<number>();

  const handleChangeType = useCallback(async({target}) => {
    setType(target.value);

    if(target.value === "Subprocesso") {
      const data = await getProcesses();
      setProcessesList(data);
    }
  }, []);

  const handleChangeProcess = useCallback(({target}) => {
    setProcessId(target?.value);
  }, []);

  const handleSubmit = useCallback(async() => {
    try {
      if(type === "Processo" && !!name) {
        const response = await postProcess(name);
        const newNode = createNode(response, "process");
        if(nodes?.length > 0) {
          setNodes(nodes => [...nodes, newNode]);
        } else {
          setNodes([newNode]);
        }
        toast.success("Processo cadastrado");
        handleCloseModal();
      } else if(type === "Subprocesso" && typeof processId === "number" && !!name) {
        await postSubprocess(name, processId);
        toast.success("Subprocesso cadastrado");
        handleCloseModal();
      } else {
        toast.warn("Selecione um tipo de item e preencha seu nome.");
      }
    } catch {
      toast.error("Não foi possível cadastrar o item. Tente novamente");
    }
  }, [type, name, processId, handleCloseModal]);

  return (
    <Box sx={modalStyle}>
      <Typography style={{marginBottom: "1rem"}}>Criar novo item:</Typography>
      <FormControl fullWidth>
        <InputLabel id="type-label">Tipo de Item</InputLabel>
        <Select
          labelId="type-label"
          id="type"
          value={type}
          label="Tipo de item"
          onChange={(handleChangeType)}
          style={{width: "100%"}}
        >
          {createOptions?.map((option: string) => {
            return <MenuItem value={option}>{option}</MenuItem>;
          })}
        </Select>
      </FormControl>
      <FormControl fullWidth style={{marginTop: "2rem"}}>
        <TextField id="outlined-basic" label="Nome" variant="outlined" onChange={({target}) => setName(target.value)}/>
      </FormControl>
      {type === "Subprocesso" && (
        <div style={{marginTop: "2rem"}}>
          <InputLabel id="process-label">Processo</InputLabel>
          <Select
            labelId="process-label"
            id="process"
            label="Processo"
            onChange={handleChangeProcess}
            style={{width: "100%"}}
          >
            {processesList?.map((option: Process) => {
              return <MenuItem value={option.id}>{option.name}</MenuItem>;
            })}
          </Select>
        </div>
      )}
      <Button variant="contained" style={{marginTop: "2rem"}} onClick={handleSubmit}>Cadastrar</Button>
    </Box>
  );
}

