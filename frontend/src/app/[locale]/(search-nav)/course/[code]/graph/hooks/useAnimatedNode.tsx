import { timer } from 'd3-timer';
import { useEffect, useState } from 'react';
import { Node, useReactFlow } from 'reactflow';

interface UseAnimatedNodeOptions {
  animationDuration?: number;
}

function useAnimatedNodes(
  nodes: Node[],
  { animationDuration = 300 }: UseAnimatedNodeOptions = {},
) {
  const [animatedNodes, setAnimatedNodes] = useState(nodes);
  const { getNode } = useReactFlow();

  useEffect(() => {
    const transitions = nodes.map((node) => ({
      id: node.id,
      from: getNode(node.id)?.position ?? node.position,
      to: node.position,
      node,
    }));

    const t = timer((elapsed) => {
      const step = Math.min(elapsed / animationDuration, 1);

      const currentNodes = transitions.map(({ node, from, to }) => {
        return {
          ...node,
          position: {
            x: from.x + (to.x - from.x) * step,
            y: from.y + (to.y - from.y) * step,
          },
        };
      });

      setAnimatedNodes(currentNodes);

      if (elapsed > animationDuration) {
        // it's important to set the final nodes here to avoid glitches
        setAnimatedNodes(nodes);
        t.stop();
      }
    });

    return () => t.stop();
  }, [nodes, getNode, animationDuration]);

  return animatedNodes;
}

export { useAnimatedNodes };

export type { UseAnimatedNodeOptions };
