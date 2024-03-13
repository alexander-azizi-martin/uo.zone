import { HStack, Tag, Text, VStack } from '@chakra-ui/react';
import Markdown from 'react-markdown';

import { type Course } from '~/lib/api';
import { CourseLink } from '~/modules/course/components';

interface CourseInfoProps {
  course: Course;
}

export function CourseInfo({ course }: CourseInfoProps) {
  return (
    <VStack my={6} spacing={4} align={'start'}>
      <Text fontSize={'md'} as="div">
        <Markdown components={{ a: CourseLink }}>{course.description}</Markdown>
      </Text>

      {course.components.length > 0 && (
        <HStack>
          <Text fontWeight={'bold'} fontSize={'sm'}>
            Components:
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
            Requirements:
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
