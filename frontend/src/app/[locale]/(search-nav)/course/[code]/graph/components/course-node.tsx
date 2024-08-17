import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react';
import { Handle, type NodeProps, Position } from 'reactflow';

import { GraphContext } from './graph-provider';
import { useContext } from 'react';

function CourseNode({
  id,
  data,
  isConnectable,
  targetPosition = Position.Top,
  sourcePosition = Position.Bottom,
}: NodeProps) {
  const { openNode, closeNode } = useContext(GraphContext);

  const handleToggle = () => {
    if (data?.open) {
      closeNode(id);
    } else {
      openNode(id);
    }
  };

  return (
    <>
      <Handle
        type='target'
        position={targetPosition}
        isConnectable={isConnectable}
      />
      <div className='flex items-center'>
        {data?.hasChildren && (
          <div onClick={handleToggle}>
            {data?.open ? <ChevronDownIcon /> : <ChevronRightIcon />}
          </div>
        )}
        <div>{data?.label}</div>
      </div>
      <Handle
        type='source'
        position={sourcePosition}
        isConnectable={isConnectable}
      />
    </>
  );
}

export { CourseNode };
