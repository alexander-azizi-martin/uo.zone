import {
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
} from '@chakra-ui/react';
import { SlidersIcon } from '@primer/octicons-react';
import { useTranslations } from 'next-intl';
import { useTransition } from 'react';

import { type CourseFilterOptions } from '~/modules/subject/hooks';

interface CourseFilterMenuProps {
  value: CourseFilterOptions;
  onChange: (
    key: 'sortBy' | 'years' | 'languages',
    value: string | string[]
  ) => void;
}

export function CourseFilterMenu({ value, onChange }: CourseFilterMenuProps) {
  const tFilter = useTranslations('Filter');
  const tGeneral = useTranslations('General');

  const [, startTransition] = useTransition();

  const handleChange =
    (key: 'sortBy' | 'years' | 'languages') => (value: string | string[]) => {
      startTransition(() => {
        onChange(key, value);
      });
    };

  return (
    <Menu closeOnSelect={false} flip={false} placement={'bottom-end'}>
      <MenuButton
        as={Button}
        iconSpacing={1}
        rightIcon={<Icon as={SlidersIcon} />}
        size={'sm'}
        variant={'outline'}
        minW={'fit-content'}
      >
        {tGeneral('filter')}
      </MenuButton>
      <MenuList>
        <MenuOptionGroup
          value={value.sortBy}
          onChange={handleChange('sortBy')}
          title={tFilter('sort-by')}
          type="radio"
        >
          <MenuItemOption value="code">{tGeneral('code')}</MenuItemOption>
          <MenuItemOption value="average">{tGeneral('average')}</MenuItemOption>
          {/* <MenuItemOption value="median">Median</MenuItemOption> */}
          <MenuItemOption value="mode">{tGeneral('mode')}</MenuItemOption>
        </MenuOptionGroup>
        <MenuDivider />
        <MenuOptionGroup
          value={value.years}
          onChange={handleChange('years')}
          title={tFilter('filter-year')}
          type="checkbox"
        >
          <MenuItemOption value="1">{tFilter('1st-year')}</MenuItemOption>
          <MenuItemOption value="2">{tFilter('2nd-year')}</MenuItemOption>
          <MenuItemOption value="3">{tFilter('3rd-year')}</MenuItemOption>
          <MenuItemOption value="4">{tFilter('4th-year')}</MenuItemOption>
          <MenuItemOption value="5">{tFilter('graduate')}</MenuItemOption>
        </MenuOptionGroup>
        <MenuDivider />
        <MenuOptionGroup
          value={value.languages}
          onChange={handleChange('languages')}
          title={tFilter('filter-language')}
          type="checkbox"
        >
          <MenuItemOption value="en">{tGeneral('english')}</MenuItemOption>
          <MenuItemOption value="fr">{tGeneral('french')}</MenuItemOption>
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
}
