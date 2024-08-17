import { useLayoutEffect, useState } from 'react';
import { BaseEdge, EdgeProps, getBezierPath, Position } from 'reactflow';

function ContainerEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  targetPosition,
  sourceHandleId,
  ...props
}: EdgeProps) {
  const [handleHeight, setHandleHeight] = useState(12);

  useLayoutEffect(() => {
    if (sourceHandleId) {
      const handle = document.getElementById(sourceHandleId);

      if (handle) {
        const { height } = handle.getBoundingClientRect();

        setHandleHeight(height);
      }
    }
  }, [sourceHandleId]);

  const [path, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY: sourceY + handleHeight / 2,
    targetX,
    targetY,
    sourcePosition: Position.Bottom,
    targetPosition,
  });

  return <BaseEdge path={path} labelX={labelX} labelY={labelY} {...props} />;
}

export { ContainerEdge };
