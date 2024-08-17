import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Edge as FlowEdge, Node as FlowNode, useReactFlow } from 'reactflow';

import Graph, { ElkNode } from '../lib/graph';

const GraphContext = createContext<{
  openNode: (nodeId: string) => void;
  closeNode: (nodeId: string) => void;
  nodes: FlowNode[];
  edges: FlowEdge[];
}>({
  openNode(_: string) {},
  closeNode(_: string) {},
  nodes: [],
  edges: [],
});

interface GraphProviderProps {
  children: ReactNode;
  graph: ElkNode;
}

function GraphProvider(props: GraphProviderProps) {
  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [edges, setEdges] = useState<FlowEdge[]>([]);

  const { fitView } = useReactFlow();

  const graph = useMemo(() => new Graph(props.graph), [props.graph]);

  const openNode = useCallback(
    (nodeId: string) => {
      graph.openNode(nodeId);
      graph.layout().then(({ nodes, edges }) => {
        setNodes(nodes);
        setEdges(edges);

        const children = edges
          .filter(({ source }) => source === nodeId)
          .map(({ target }) => ({ id: target }));

        setTimeout(() => {
          fitView({
            nodes: [{ id: nodeId }, ...children],
            duration: 500,
            padding: 1,
          });
        }, 200);
      });
    },
    [graph],
  );

  const closeNode = useCallback(
    (nodeId: string) => {
      graph.closeNode(nodeId);
      graph.layout().then(({ nodes, edges }) => {
        setNodes(nodes);
        setEdges(edges);
      });
    },
    [graph],
  );

  useEffect(() => {
    graph.layout().then(({ nodes, edges }) => {
      setNodes(nodes);
      setEdges(edges);
    });
  }, [graph]);

  const graphContext = {
    openNode,
    closeNode,
    nodes,
    edges,
  };

  return (
    <GraphContext.Provider value={graphContext}>
      {props.children}
    </GraphContext.Provider>
  );
}

export { GraphContext, GraphProvider };

export type { GraphProviderProps };
