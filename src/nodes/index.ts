import type { Node } from "reactflow";
import getProcesses from "../api/getProcesses";
import { Process } from "../types/Process";

async function buildInitialNodes() {
  const data = await getProcesses();
  let nodesList: Node[];

  if(!!data && data.length > 0) {
    nodesList = data.map((process: Process) => {
      return { id: process.id.toString(), position: { x: process.id * 800, y: 0 }, data: { label: process.name } };
    });

  }

  return nodesList satisfies Node[];
}

export const initialNodes = await buildInitialNodes();
