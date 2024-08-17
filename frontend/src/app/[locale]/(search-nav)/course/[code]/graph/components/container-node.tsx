import cntl from 'cntl';
import { Handle, type NodeProps, Position } from 'reactflow';

function ContainerNode({ data, isConnectable }: NodeProps) {
  return (
    <div className='h-full rounded border border-solid'>
      {data?.label && (
        <div
          style={{
            width: 'max-content',
            height: 'min-content',
            fontFamily: 'sans-serif',
            padding: '3px 8px',
            background: 'white',
            borderRight: '1px solid #1a192b',
            borderBottom: '1px solid #1a192b',
            borderRadius: '3px 0px 3px 0px',
            fontSize: '12px',
          }}
        >
          {data?.label}
        </div>
      )}

      <Handle
        type='target'
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <Handle
        type='source'
        position={Position.Top}
        isConnectable={isConnectable}
      />
    </div>
  );
}

export { ContainerNode };
