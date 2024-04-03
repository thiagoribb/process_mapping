
import { useCallback, useState } from "react";
import {
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState
} from "reactflow";

import "reactflow/dist/style.css";

import { Modal } from "@mui/material";
import { PlusCircle } from "phosphor-react";
import { ToastContainer } from "react-toastify";
import type { Node } from "reactflow";
import getSubprocessByProcess from "./api/getSubprocessesByProcess";
import FormModal from "./components/FormModal";
import NodeInfoModal from "./components/NodeInfoModal";
import { edgeTypes, initialEdges } from "./edges";
import { initialNodes } from "./nodes";
import { Subprocess } from "./types/Subprocess";

export default function App(): JSX.Element {
  const [nodes, setNodes, ] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [nodeInfoToShow, setSetNodeInfoToShow] = useState<Node | null>(null);

  const calculatePositionX = useCallback((subprocesses: Subprocess[], index: number) => {
    const offsetX = 150;
    const spacing = 50;
    const totalWidth = subprocesses.length * offsetX + (subprocesses.length - 1) * spacing;
    const startX = -(totalWidth - offsetX) / 2;

    return startX + index * (offsetX + spacing);
  }, []); 

  const handleProcessClick = useCallback(async(_event: unknown, node: Node) => {
    if(node?.data?.type === "process") {
      const subprocesses = await getSubprocessByProcess(node.id);
  
      const subprocessNodes = subprocesses.map((subprocess: Subprocess, index: number) => {
        const id = `${node.id}-${subprocess.id}`;
  
  
        const positionX = calculatePositionX(subprocesses, index);
  
        return {
          id,
          data: { label: subprocess.name, type: "subprocess" },
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
    } else {
      setSetNodeInfoToShow(node);
      setisModalOpen(true);
    }
  }, [nodes, edges, setEdges, setNodes, calculatePositionX]);


  const handleOpenModal = useCallback(() => {
    setisModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSetNodeInfoToShow(null);
    setisModalOpen(false);
  }, []);

  const handleDoubleClick = useCallback((_event: unknown, node: Node) => {
    setSetNodeInfoToShow(node);
    setisModalOpen(true);
  }, []);

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        edgeTypes={edgeTypes}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleProcessClick}
        onNodeDoubleClick={handleDoubleClick}
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
        {nodeInfoToShow ? (
          <NodeInfoModal
            handleCloseModal={handleCloseModal}
            nodeInfoToShow={nodeInfoToShow}
          ></NodeInfoModal>
        ) : (
          <FormModal handleCloseModal={handleCloseModal} setNodes={setNodes} nodes={nodes}></FormModal>
        )}
      </Modal>
      <ToastContainer />
    </>

  );
}
