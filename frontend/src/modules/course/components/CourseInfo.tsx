import { HStack, Tag, Text, VStack } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import Markdown from 'react-markdown';

import { type Course } from '~/lib/api';
import { CourseLink } from '~/modules/course/components';

interface CourseInfoProps {
  course: Course;
}

export function CourseInfo({ course }: CourseInfoProps) {
  const tGeneral = useTranslations('General');

  return (
    <VStack my={6} spacing={4} align={'start'}>
      <Text fontSize={'md'} as="div">
        <Markdown components={{ a: CourseLink }}>{course.description}</Markdown>
      </Text>

      {course.components.length > 0 && (
        <HStack>
          <Text fontWeight={'bold'} fontSize={'sm'}>
            {tGeneral('components')}:
          </Text>

          {course.components.map((component) => (
            <Tag size={'sm'} key={component}>
              {component}
            </Tag>
          ))}
        </HStack>
      )}
      {course.requirements && (
        <HStack>
          <Text fontWeight={'bold'} fontSize={'sm'} mb={'auto'}>
            {tGeneral('requirements')}:
          </Text>
          <Text fontSize={'sm'} as={'div'}>
            <Markdown components={{ a: CourseLink }}>
              {course.requirements}
            </Markdown>
          </Text>
        </HStack>
      )}
    </VStack>
  );
}
