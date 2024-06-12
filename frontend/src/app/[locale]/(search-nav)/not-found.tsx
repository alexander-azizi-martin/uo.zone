import { Trans } from '@lingui/macro';

export default async function SearchNavNotFound() {
  return (
    <h2 className='my-4 mt-4 sm:text-4xl'>
      <Trans>This page does not exist.</Trans>
    </h2>
  );
}
