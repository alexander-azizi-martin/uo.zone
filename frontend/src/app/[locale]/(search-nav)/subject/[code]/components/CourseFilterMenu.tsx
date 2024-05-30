'use client';

import { Trans } from '@lingui/macro';
import { SlidersHorizontalIcon } from 'lucide-react';
import { useContext, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

import {
  CourseFilterContext,
  type CourseFilterOptions,
} from './CourseFilterProvider';

export function CourseFilterMenu() {
  const courseFilterContext = useContext(CourseFilterContext);
  if (courseFilterContext === null) {
    throw new Error(
      `\`useFilteredCourses\` must be used within \`CourseFilterProvider\``,
    );
  }

  const { filterOptions, setFilterOptions, resetFilterOptions } =
    courseFilterContext;

  const [, startTransition] = useTransition();

  const handleChange =
    (key: keyof CourseFilterOptions) => (value: string | string[]) => {
      startTransition(() => {
        setFilterOptions(key, value);
      });
    };

  const preventDefault = (event: Event) => {
    event.preventDefault();
  };

  return (
    <DropdownMenu modal={false}>
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
        <div
          className={`
            scrollbar-thin h-[500px] overflow-x-hidden 
            overflow-y-scroll overscroll-contain
          `}
        >
          <DropdownMenuLabel>
            <Trans>Sort By</Trans>
          </DropdownMenuLabel>

          <DropdownMenuRadioGroup
            value={filterOptions.sortBy}
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
            values={filterOptions.years}
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
            <Trans>Filter Term</Trans>
          </DropdownMenuLabel>
          <DropdownMenuCheckboxGroup
            values={filterOptions.term}
            onValuesChange={handleChange('term')}
          >
            <DropdownMenuCheckboxItem value='fall' onSelect={preventDefault}>
              <Trans>Fall</Trans>
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem value='winter' onSelect={preventDefault}>
              <Trans>Winter</Trans>
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem value='summer' onSelect={preventDefault}>
              <Trans>Summer</Trans>
            </DropdownMenuCheckboxItem>
          </DropdownMenuCheckboxGroup>

          <DropdownMenuSeparator />

          <DropdownMenuLabel>
            <Trans>Filter Language</Trans>
          </DropdownMenuLabel>
          <DropdownMenuCheckboxGroup
            values={filterOptions.languages}
            onValuesChange={handleChange('languages')}
          >
            <DropdownMenuCheckboxItem value='en' onSelect={preventDefault}>
              <Trans>English</Trans>
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem value='fr' onSelect={preventDefault}>
              <Trans>French</Trans>
            </DropdownMenuCheckboxItem>
          </DropdownMenuCheckboxGroup>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={preventDefault}
          onClick={() => {
            startTransition(resetFilterOptions);
          }}
        >
          <Trans>Reset Filters</Trans>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
