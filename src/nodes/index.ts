import type { Node } from "reactflow";
import getProcesses from "../api/getProcesses";
import { Process } from "../types/Process";
import { createNode } from "./createNode";

async function buildInitialNodes() {
  const data = await getProcesses();
  let nodesList: Node[];

  if(!!data && data.length > 0) {
    nodesList = data.map((process: Process) => {
      return createNode(process, "process");
    });

  }

  return nodesList satisfies Node[];
}

export const initialNodes = await buildInitialNodes();
