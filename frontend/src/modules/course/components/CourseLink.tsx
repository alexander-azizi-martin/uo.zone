import { chakra } from '@chakra-ui/react';
import Link from 'next/link';

export function CourseLink(props: any) {
  return (
    <chakra.span
      color={'#8f001a'}
      textDecoration={'underline'}
      textDecorationThickness={'1px'}
      _hover={{ textDecorationThickness: '2px' }}
    >
      <Link {...props} />
    </chakra.span>
  );
}
