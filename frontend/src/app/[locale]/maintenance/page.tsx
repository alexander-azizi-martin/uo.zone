import { loadI18n } from '@/lib/i18n';
import { Trans } from '@lingui/macro';

interface MaintenancePageProps {
  params: {
    locale: string;
  };
}

export default async function MaintenancePage({
  params,
}: MaintenancePageProps) {
  await loadI18n(params.locale);

  return (
    <div className='m-auto flex h-[100vh] w-max items-center text-lg'>
      <Trans>The website is currently under maintenance.</Trans>
    </div>
  );
}
