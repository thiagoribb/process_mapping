import axios from "axios";
import { Subprocess } from "../types/Subprocess";

async function getSubprocessByProcess(processId: string): Promise<Subprocess[]> {
  try {
    const response = await axios.get(`http://localhost:8000/api/subprocess/${processId}`);
    return response?.data;
  } catch (error) {
    return [];
  }
}

export default getSubprocessByProcess;