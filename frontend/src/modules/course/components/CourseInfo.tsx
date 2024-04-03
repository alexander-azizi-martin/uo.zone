import { HStack, Tag, Text, VStack } from '@chakra-ui/react';
import Markdown from 'markdown-to-jsx';
import { useTranslations } from 'next-intl';

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
        <Markdown options={{ overrides: { a: CourseLink } }}>
          {course.description}
        </Markdown>
      </Text>

      {course.components.length > 0 && (
        <HStack align={'start'}>
          <Text fontWeight={'bold'} fontSize={'sm'}>
            {tGeneral('components')}:
          </Text>

          <HStack flexWrap={'wrap'}>
            {course.components.map((component) => (
              <Tag size={'sm'} key={component} width={'max-content'}>
                {component}
              </Tag>
            ))}
          </HStack>
        </HStack>
      )}
      {course.requirements && (
        <HStack>
          <Text fontWeight={'bold'} fontSize={'sm'} mb={'auto'}>
            {tGeneral('requirements')}:
          </Text>
          <Text fontSize={'sm'} as={'div'}>
            <Markdown options={{ overrides: { a: CourseLink } }}>
              {course.description}
            </Markdown>
          </Text>
        </HStack>
      )}
    </VStack>
  );
}
