import axios from "axios";
import { Process } from "../types/Process";

async function getProcesses(): Promise<Process[]> {
  try {
    const response = await axios.get("http://localhost:8000/api/process");
    return response?.data;
  } catch (error) {
    return [];
  }
}

export default getProcesses;