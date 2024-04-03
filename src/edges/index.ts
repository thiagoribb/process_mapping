import type { Edge, EdgeTypes } from "reactflow";

export const initialEdges = [
  { id: "a->c", source: "a", target: "c" },
  { id: "a->b", source: "a", target: "b" },
  { id: "a->d", source: "a", target: "d" },
] satisfies Edge[];

export const edgeTypes = {
  // Add your custom edge types here!
} satisfies EdgeTypes;
