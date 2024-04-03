import axios from "axios";
import { Subprocess } from "../types/Subprocess";

async function postSubprocess(name: string, processId: number): Promise<Subprocess | null> {
  try {
    const response = await axios.post("http://localhost:8000/api/subprocess", {name, processId});
    return response?.data;
  } catch (error) {
    return null;
  }
}

export default postSubprocess;