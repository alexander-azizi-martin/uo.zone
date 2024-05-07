import { SlidersHorizontalIcon } from 'lucide-react';
import { useTransition } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  DropdownMenuCheckboxGroup,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu-checkbox';
import { type CourseFilterOptions } from '@/modules/subject/hooks';
import { Trans } from '@lingui/macro';

interface CourseFilterMenuProps {
  value: CourseFilterOptions;
  onChange: (
    key: 'sortBy' | 'years' | 'languages',
    value: string | string[],
  ) => void;
  onReset: () => void;
}

export function CourseFilterMenu({
  value,
  onChange,
  onReset,
}: CourseFilterMenuProps) {
  const [, startTransition] = useTransition();

  const handleChange =
    (key: 'sortBy' | 'years' | 'languages') => (value: string | string[]) => {
      startTransition(() => {
        onChange(key, value);
      });
    };

  const preventDefault = (event: Event) => {
    event.preventDefault();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='h-8 font-semibold ' variant='outline'>
          <Trans>Filter</Trans>
          <SlidersHorizontalIcon className='ml-1' size={14} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className='w-48'
        align='end'
        onCloseAutoFocus={preventDefault}
      >
        <DropdownMenuLabel>
          <Trans>Sort By</Trans>
        </DropdownMenuLabel>

        <DropdownMenuRadioGroup
          value={value.sortBy}
          onValueChange={handleChange('sortBy')}
        >
          <DropdownMenuRadioItem value='code' onSelect={preventDefault}>
            <Trans>Code</Trans>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value='average' onSelect={preventDefault}>
            <Trans>Average</Trans>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value='mode' onSelect={preventDefault}>
            <Trans>Mode</Trans>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>
          <Trans>Filter Year</Trans>
        </DropdownMenuLabel>
        <DropdownMenuCheckboxGroup
          values={value.years}
          onValuesChange={handleChange('years')}
        >
          <DropdownMenuCheckboxItem value='1' onSelect={preventDefault}>
            <Trans>1st Year</Trans>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem value='2' onSelect={preventDefault}>
            <Trans>2nd Year</Trans>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem value='3' onSelect={preventDefault}>
            <Trans>3rd Year</Trans>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem value='4' onSelect={preventDefault}>
            <Trans>4th Year</Trans>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem value='5' onSelect={preventDefault}>
            <Trans>Graduate</Trans>
          </DropdownMenuCheckboxItem>
        </DropdownMenuCheckboxGroup>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>
          <Trans>Filter Language</Trans>
        </DropdownMenuLabel>
        <DropdownMenuCheckboxGroup
          values={value.languages}
          onValuesChange={handleChange('languages')}
        >
          <DropdownMenuCheckboxItem value='en' onSelect={preventDefault}>
            <Trans>English</Trans>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem value='fr' onSelect={preventDefault}>
            <Trans>French</Trans>
          </DropdownMenuCheckboxItem>
        </DropdownMenuCheckboxGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={preventDefault}
          onClick={() => {
            startTransition(onReset);
          }}
        >
          <Trans>Reset Filters</Trans>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
