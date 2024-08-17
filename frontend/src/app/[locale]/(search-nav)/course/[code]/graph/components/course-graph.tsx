import 'reactflow/dist/style.css';

import NextLink from 'next/link';
import {
  Panel,
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
} from 'reactflow';

import { ContainerEdge } from './container-edge';
import { ContainerNode } from './container-node';
import { CourseNode } from './course-node';
import { GraphProvider, GraphContext } from './graph-provider';
import a from '../lib/graph.json';
import { useAnimatedNodes } from '../hooks/useAnimatedNode';
import { useContext } from 'react';

const edgeTypes = {
  container: ContainerEdge,
};

const nodeTypes = {
  container: ContainerNode,
  course: CourseNode,
};

function LayoutFlow() {
  const { nodes, edges } = useContext(GraphContext);
  const animatedNodes = useAnimatedNodes(nodes);

  return (
    <ReactFlow
      nodes={animatedNodes}
      edges={edges}
      edgeTypes={edgeTypes}
      nodeTypes={nodeTypes}
      proOptions={{ hideAttribution: true }}
      fitView
    >
      <Panel position='top-left'>top-left</Panel>
      <Controls showInteractive={false} />
      <Background />
      <MiniMap style={{ width: 100, height: 75 }} />
    </ReactFlow>
  );
}

export default function Test() {
  return (
    <div className='h-full w-full'>
      <ReactFlowProvider>
        <GraphProvider graph={a}>
          <LayoutFlow />
        </GraphProvider>
      </ReactFlowProvider>
    </div>
  );
}
