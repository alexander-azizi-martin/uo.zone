import { notFound } from 'next/navigation';

export default async function CatchAllUnmatched() {
  notFound();
}
