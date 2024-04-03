import { Node } from "reactflow";
import { Process } from "../types/Process";

export function createNode(process: Process, type: string): Node {
  return { id: process?.id?.toString(), position: { x: process?.id * 800, y: 0 }, data: { label: process?.name, type: type } };
}