import type { OnConnect } from "reactflow";

import { useCallback } from "react";
import {
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";

import "reactflow/dist/style.css";

import { PlusCircle } from "phosphor-react";
import type { Node } from "reactflow";
import getSubprocessByProcess from "./api/getSubprocessesByProcess";
import { edgeTypes, initialEdges } from "./edges";
import { initialNodes } from "./nodes";
import { Subprocess } from "./types/Subprocess";

export default function App(): JSX.Element {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
  );

  const handleProcessClick = useCallback(async(event: any, node: Node) => {
    const subprocesses = await getSubprocessByProcess(node.id);
    // const positionsX = subprocesses.map((subprocess: Subprocess, index: number) => {
    //   const totalX = (150 * subprocesses.length) + (50 * (subprocesses.length - 1));
    //   const gap = totalX / (subprocesses.length - 1);
    //   return 
    // }
    const subprocessNodes = subprocesses.map((subprocess: Subprocess, index: number) => {
      const id = `${node.id}-${subprocess.id}`;

      const offsetX = 150; // Largura do elemento
      const spacing = 50; // Espaçamento entre os elementos
      const totalWidth = subprocesses.length * offsetX + (subprocesses.length - 1) * spacing;
      const startX = -(totalWidth - offsetX) / 2;
      const positionX = startX + index * (offsetX + spacing);
      console.log(positionX);
      return {
        id,
        data: { label: subprocess.name },
        parentNode: node.id,
        position: { x: positionX, y: 90 },
        extent: "parent",
      };
    });

    const newEdges = subprocessNodes.map((subprocessNode) => {
      return { id: `${node.id}-${subprocessNode.id}`, source: `${node.id}`, target: `${subprocessNode.id}` };
    });

    setNodes([...nodes, ...subprocessNodes]);
    setEdges([...edges, ...newEdges]);
  }, []);

  // const calculatePositionX = useCallback(node: Node, subprocessNodes)

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      edgeTypes={edgeTypes}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={handleProcessClick}
      fitView
    >
      <Panel position="top-left">
        <PlusCircle size={32} cursor={"pointer"} />
      </Panel>
      <Background />
      <MiniMap />
      <Controls />
    </ReactFlow>
  );
}
