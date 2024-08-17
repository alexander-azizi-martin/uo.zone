import dynamic from 'next/dynamic';

const DynamicGraph = dynamic(() => import('./components/course-graph'), {
  loading: () => <p>Loading...</p>,
});

export default function GraphPage() {
  return <DynamicGraph />;
}
