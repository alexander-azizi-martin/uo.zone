import { Trans } from '@lingui/macro';
import cntl from 'cntl';
import { StarHalfIcon, StarIcon } from 'lucide-react';
import { type HTMLAttributes } from 'react';

import { Badge } from '@/components/ui/badge';
import { Tooltip } from '@/components/ui/tooltip';
import { type components } from '@/lib/api/schema';
import { cn } from '@/lib/utils';

function ratingToColor(rating: number): string {
  if (rating >= 4) return 'text-green-600';
  if (rating >= 3) return 'text-yellow-600';
  if (rating >= 2) return 'text-orange-600';
  if (rating >= 1) return 'text-red-600';
  return 'text-pink-600';
}

function difficultyToColor(rating: number): string {
  if (rating <= 2) return 'text-green-600';
  if (rating <= 3) return 'text-yellow-600';
  if (rating <= 4) return 'text-orange-600';
  if (rating <= 5) return 'text-red-600';
  return 'text-pink-600';
}

interface RmpRatingProps {
  review: components['schemas']['RateMyProfessorReviewResource'];
}

function RmpRating({ review }: RmpRatingProps) {
  return (
    <div className='flex flex-wrap gap-2'>
      <Tooltip label={<Trans>RateMyProfessor rating</Trans>}>
        <Badge
          className={cntl`
            min-w-max border-current text-center
            ${ratingToColor(review.rating)}
          `}
          variant='outline'
          size='sm'
        >
          {review.rating} <Trans>RMP Rating</Trans>
          <StarRating className='-mt-px pl-1' rating={review.rating} />
        </Badge>
      </Tooltip>

      <Tooltip label={<Trans>RateMyProfessor difficulty</Trans>}>
        <Badge
          className={cntl`
            min-w-max border-current text-center
            ${difficultyToColor(review.difficulty)}
          `}
          variant='outline'
          size='sm'
        >
          {review.difficulty} <Trans>RMP Difficulty</Trans>
          <StarRating className='-mt-px pl-1' rating={review.difficulty} />
        </Badge>
      </Tooltip>

      <Tooltip label={<Trans>Number of RateMyProfessor reviews</Trans>}>
        <Badge
          className='min-w-max border-current text-center text-blue-500'
          variant='outline'
          size='sm'
        >
          {review.numRatings} <Trans>RMP ratings</Trans>
        </Badge>
      </Tooltip>
    </div>
  );
}

export { RmpRating };

export type { RmpRatingProps };

interface StarRatingInterface extends HTMLAttributes<HTMLSpanElement> {
  rating: number;
}

function StarRating({ rating, className, ...props }: StarRatingInterface) {
  // Rounds to the nearest 0.5
  const numStars = Math.round(rating * 2) / 2;

  return (
    <span {...props} className={cn(className, 'flex')}>
      {Array.from({ length: Math.floor(numStars) }).map((_, i) => (
        <StarIcon key={i} className='size-3.5 fill-current' />
      ))}
      {!Number.isInteger(numStars) && (
        <StarHalfIcon className='size-3.5 fill-current' />
      )}
    </span>
  );
}
