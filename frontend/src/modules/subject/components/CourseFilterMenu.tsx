import { SlidersHorizontalIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
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
  const tFilter = useTranslations('Filter');
  const tGeneral = useTranslations('General');

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
          {tGeneral('filter')}
          <SlidersHorizontalIcon className='ml-1' size={14} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className='w-48'
        align='end'
        onCloseAutoFocus={preventDefault}
      >
        <DropdownMenuLabel>{tFilter('sort-by')}</DropdownMenuLabel>

        <DropdownMenuRadioGroup
          value={value.sortBy}
          onValueChange={handleChange('sortBy')}
        >
          <DropdownMenuRadioItem value='code' onSelect={preventDefault}>
            {tGeneral('code')}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value='average' onSelect={preventDefault}>
            {tGeneral('average')}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value='mode' onSelect={preventDefault}>
            {tGeneral('mode')}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>{tFilter('filter-year')}</DropdownMenuLabel>
        <DropdownMenuCheckboxGroup
          values={value.years}
          onValuesChange={handleChange('years')}
        >
          <DropdownMenuCheckboxItem value='1' onSelect={preventDefault}>
            {tFilter('1st-year')}
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem value='2' onSelect={preventDefault}>
            {tFilter('2nd-year')}
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem value='3' onSelect={preventDefault}>
            {tFilter('3rd-year')}
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem value='4' onSelect={preventDefault}>
            {tFilter('4th-year')}
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem value='5' onSelect={preventDefault}>
            {tFilter('graduate')}
          </DropdownMenuCheckboxItem>
        </DropdownMenuCheckboxGroup>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>{tFilter('filter-language')}</DropdownMenuLabel>
        <DropdownMenuCheckboxGroup
          values={value.languages}
          onValuesChange={handleChange('languages')}
        >
          <DropdownMenuCheckboxItem value='en' onSelect={preventDefault}>
            {tGeneral('english')}
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem value='fr' onSelect={preventDefault}>
            {tGeneral('french')}
          </DropdownMenuCheckboxItem>
        </DropdownMenuCheckboxGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={preventDefault}
          onClick={() => {
            startTransition(onReset);
          }}
        >
          Reset Filters
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
