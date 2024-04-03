import type { OnConnect } from "reactflow";

import { useCallback, useEffect, useState } from "react";
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

import { Modal } from "@mui/material";
import { PlusCircle } from "phosphor-react";
import { ToastContainer } from "react-toastify";
import type { Node } from "reactflow";
import getSubprocessByProcess from "./api/getSubprocessesByProcess";
import FormModal from "./components/FormModal";
import { edgeTypes, initialEdges } from "./edges";
import { initialNodes } from "./nodes";
import { Subprocess } from "./types/Subprocess";

export default function App(): JSX.Element {
  const [nodes, setNodes, ] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isModalOpen, setisModalOpen] = useState(false);
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
  );

  useEffect(() => {
    setNodes(initialNodes);
  }, []);

  const handleProcessClick = useCallback(async(_event: unknown, node: Node) => {
    const subprocesses = await getSubprocessByProcess(node.id);

    const subprocessNodes = subprocesses.map((subprocess: Subprocess, index: number) => {
      const id = `${node.id}-${subprocess.id}`;


      const positionX = calculatePositionX(subprocesses, index);

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
  }, [nodes, edges, setEdges, setNodes]);

  const calculatePositionX = useCallback((subprocesses: Subprocess[], index: number) => {
    const offsetX = 150;
    const spacing = 50;
    const totalWidth = subprocesses.length * offsetX + (subprocesses.length - 1) * spacing;
    const startX = -(totalWidth - offsetX) / 2;

    return startX + index * (offsetX + spacing);
  }, []); 

  const handleOpenModal = useCallback(() => {
    setisModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setisModalOpen(false);
  }, []);

  return (
    <>
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
          <PlusCircle size={32} cursor={"pointer"} onClick={handleOpenModal}/>
        </Panel>
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <FormModal handleCloseModal={handleCloseModal} setNodes={setNodes}></FormModal>
      </Modal>
      <ToastContainer />
    </>

  );
}
