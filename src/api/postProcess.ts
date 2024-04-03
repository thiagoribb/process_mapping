import axios from "axios";
import { Process } from "../types/Process";

async function postProcess(name: string): Promise<Process | null> {
  try {
    const response = await axios.post("http://localhost:8000/api/process", {name});
    return response?.data;
  } catch (error) {
    return null;
  }
}

export default postProcess;