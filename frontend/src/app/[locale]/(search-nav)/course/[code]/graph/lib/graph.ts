import ELK, {
  type ElkExtendedEdge as BaseElkEdge,
  type ElkNode as BaseElkNode,
} from 'elkjs/lib/elk.bundled.js';
import {
  type Edge as FlowEdge,
  MarkerType,
  type Node as FlowNode,
} from 'reactflow';
import * as textMetrics from 'text-metrics';

const ElkFactory = (function () {
  const elk = new ELK();

  return () => elk;
})();

const TextMetricFactory = (function () {
  const metrics = textMetrics.init({
    width: '1000000px',
    fontSize: '12px',
    lineHeight: '18px',
    fontWeight: 400,
    fontFamily: 'sans-serif',
  });

  return () => metrics;
})();

interface ElkEdge extends BaseElkEdge {
  data?: {
    label?: string;
    edgeType: string;
  };
}

export interface ElkNode extends BaseElkNode {
  children?: ElkNode[];
  edges?: ElkEdge[];
  data?: {
    label?: string;
    nodeType: string;
    isRoot: boolean;
  };
}

interface AdjacencyListEdge {
  targetId: string;
  edgeId: string;
  isGlobal: boolean;
}

export default class Graph {
  adjacencyList: Map<string, AdjacencyListEdge[]>;
  nodes: Map<string, ElkNode>;
  openNodes: Set<string>;
  rootIds: string[];

  constructor(graph: ElkNode) {
    this.nodes = new Map();
    this.adjacencyList = new Map();
    this.openNodes = new Set();
    this.rootIds = [];

    this._processGraph(graph);
  }

  _processGraph(graph: ElkNode) {
    type StackItem = { node: ElkNode; depth: number };
    const stack: StackItem[] = [{ node: graph, depth: 0 }];

    while (stack.length > 0) {
      let { node, depth } = stack.pop() as StackItem;
      this.nodes.set(node.id, node);

      if (node.data?.isRoot) {
        this.rootIds.push(node.id);
        this.openNodes.add(node.id);
      }

      for (const edge of node.edges ?? []) {
        const sourceId = edge.sources[0];
        const targetId = edge.targets[0];

        if (!this.adjacencyList.has(sourceId)) {
          this.adjacencyList.set(sourceId, []);
        }

        this.adjacencyList.get(sourceId)?.push({
          edgeId: edge.id,
          targetId,
          isGlobal: depth == 0,
        });
      }

      for (const child of node.children ?? []) {
        stack.push({ node: child, depth: depth + 1 });
      }

      if (depth >= 1) {
        if (node.children === undefined) {
          const { width, height } = this._nodeDimensions(node);

          node.width = width;
          node.height = height;
        } else {
          node.layoutOptions = {
            'elk.padding': '[top=45.0,left=12.0,bottom=12.0,right=12.0]',
          };
        }
      }
    }
  }

  _nodeDimensions(node: ElkNode) {
    if (typeof window === 'undefined' || node === undefined) {
      return { width: 0, height: 0 };
    }

    const BUTTON_DIMENSIONS = 24;
    const PADDING = 25;

    const metrics = TextMetricFactory();

    const label = node.data?.label as string;
    const hasChildren = !!this.adjacencyList.get(node.id)?.length;

    let width: number, height: number;
    if (hasChildren && !node.data?.isRoot) {
      width = Math.ceil(metrics.width(label)) + BUTTON_DIMENSIONS;
      height = Math.max(metrics.height(label), BUTTON_DIMENSIONS);
    } else {
      width = Math.ceil(metrics.width(label));
      height = metrics.height(label);
    }

    width += PADDING;
    height += PADDING;

    return { width, height };
  }

  async layout() {
    const graph: ElkNode = {
      id: 'root',
      children: this.rootIds.map((id) => this.nodes.get(id) as ElkNode),
      edges: [],
      layoutOptions: {
        'elk.algorithm': 'elk.layered',
        'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
        'elk.direction': 'DOWN',
        'elk.layered.spacing.nodeNodeBetweenLayers': '100',
        'elk.spacing.nodeNode': '80',
        'nodePlacement.bk.fixedAlignment': 'BALANCED',
        'elk.layered.crossingMinimization.semiInteractive': 'true',
        'elk.layered.nodePlacement.favorStraightEdges': 'false',
        'elk.layered.considerModelOrder.strategy': 'PREFER_EDGES',
        'elk.alignment': 'LEFT',
        'nodeSize.options': 'COMPUTE_PADDING',
      },
    };

    const idStack = [...this.rootIds];
    while (idStack.length > 0) {
      const nodeId = idStack.pop() as string;

      for (const edge of this.adjacencyList.get(nodeId) ?? []) {
        const childId = edge.targetId;

        if (!edge.isGlobal || this.openNodes.has(nodeId)) {
          idStack.push(childId);
        }

        if (edge.isGlobal && this.openNodes.has(nodeId)) {
          const childNode = this.nodes.get(childId) as ElkNode;

          graph.children?.push(childNode);
          graph.edges?.push({
            id: edge.edgeId,
            sources: [nodeId],
            targets: [childId],
          });
        }
      }
    }

    const layedOutGraph = await ElkFactory().layout(graph);

    const layedOutNodes: FlowNode[] = [];
    const layedOutEdges: FlowEdge[] = [];

    type StackItem = { node: ElkNode; parent?: string; depth: number };
    const nodeStack: StackItem[] = [
      { node: layedOutGraph, parent: undefined, depth: 0 },
    ];

    while (0 < nodeStack.length) {
      let { node, parent, depth } = nodeStack.pop() as StackItem;

      for (let childNode of node.children ?? []) {
        nodeStack.push({
          node: childNode,
          parent: node.id === graph.id ? undefined : node.id,
          depth: depth + 1,
        });
      }

      for (let edge of node.edges ?? []) {
        layedOutEdges.push({
          id: edge.id,
          source: edge.sources[0],
          target: edge.targets[0],
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
          type: depth > 0 ? 'container' : 'default',
          style: {},
          label: edge.data?.label,
        });
      }

      if (node.id === graph.id) continue;

      layedOutNodes.push({
        id: node.id,
        data: {
          label: node.data?.label,
          open: this.openNodes.has(node.id),
          hasChildren:
            !!this.adjacencyList.get(node.id)?.length && !node.data?.isRoot,
        },
        // className: 'react-flow__node-default',
        position: {
          x: node.x as number,
          y: node.y as number,
        },
        style: {
          fontFamily: 'sans-serif',
          width: node.width,
          height: node.height,
          zIndex: -1,
        },
        type: node?.children?.length
          ? 'container'
          : node.data?.nodeType == 'course'
          ? 'course'
          : 'default',
        ...(!node?.children?.length && {
          className: 'react-flow__node-default',
        }),
        // label: node?.data?.label ?? null,
        ...(parent && {
          extent: 'parent',
          parentNode: parent,
        }),
      });
    }

    return { nodes: layedOutNodes, edges: layedOutEdges };
  }

  openNode(nodeId: string) {
    if (this.rootIds.includes(nodeId)) {
      throw new Error('Root nodes are always open');
    }

    this.openNodes.add(nodeId);
  }

  closeNode(nodeId: string) {
    if (this.rootIds.includes(nodeId)) {
      throw new Error('Root nodes are always open');
    }

    this.openNodes.delete(nodeId);
  }
}
