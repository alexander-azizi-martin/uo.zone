import { StarIcon } from '@chakra-ui/icons';
import { chakra, HStack, Tag, Tooltip } from '@chakra-ui/react';

import type { RateMyProfessorReview } from '~/lib/api';

function ratingToColor(rating: number): string {
  if (rating === undefined) return 'blackAlpha';
  if (rating >= 4) return 'green';
  if (rating >= 3) return 'yellow';
  if (rating >= 2) return 'orange';
  if (rating >= 1) return 'red';
  return 'pink';
}

interface RmpRatingProps {
  review: RateMyProfessorReview;
}

export default function RmpRating({ review }: RmpRatingProps) {
  return (
    <HStack spacing={2}>
      <Tooltip label={'RateMyProfessor rating'} hasArrow>
        <Tag
          size={'sm'}
          variant={'outline'}
          textAlign={'center'}
          colorScheme={ratingToColor(review.rating)}
        >
          {review.rating} Rating
          <chakra.span pl={1} mt={-1}>
            {Array.from(Array(Math.round(review.rating)), (_, i) => (
              <StarIcon key={i} />
            ))}
          </chakra.span>
        </Tag>
      </Tooltip>

      <Tooltip label={'RateMyProfessor difficulty'} hasArrow>
        <Tag
          size={'sm'}
          variant={'outline'}
          textAlign={'center'}
          colorScheme={ratingToColor(5 - review.difficulty)}
        >
          {review.difficulty} Difficulty
          <chakra.span pl={1} mt={-1}>
            {Array.from(Array(Math.round(review.difficulty)), (_, i) => (
              <StarIcon key={i} />
            ))}
          </chakra.span>
        </Tag>
      </Tooltip>
    </HStack>
  );
}
