import { StarHalfIcon, StarIcon } from 'lucide-react';
import { type HTMLAttributes } from 'react';

import { Tooltip } from '@/components/Tooltip';
import { Badge } from '@/components/ui/badge';
import { type RateMyProfessorReview } from '@/lib/api';
import { cn } from '@/lib/utils';

function ratingToColor(rating: number): string {
  if (rating === undefined) return 'blackAlpha';
  if (rating >= 4) return 'text-green-500';
  if (rating >= 3) return 'text-yellow-500';
  if (rating >= 2) return 'text-orange-500';
  if (rating >= 1) return 'text-red-500';
  return 'text-pink-500';
}

interface RmpRatingProps {
  review: RateMyProfessorReview;
}

export function RmpRating({ review }: RmpRatingProps) {
  return (
    <div className='flex gap-2'>
      <Tooltip label={'RateMyProfessor rating'} hasArrow>
        <Badge
          className={`bg-blue text-center ${ratingToColor(review.rating)}`}
          variant={'outline'}
        >
          {review.rating} RMP Rating
          <StarRating className='-mt-px pl-1' rating={review.rating} />
        </Badge>
      </Tooltip>

      <Tooltip label={'RateMyProfessor difficulty'} hasArrow>
        <Badge
          className={`bg-blue text-center ${ratingToColor(5 - review.difficulty)}`}
          variant={'outline'}
        >
          {review.difficulty} RMP Difficulty
          <StarRating className='-mt-px pl-1' rating={review.difficulty} />
        </Badge>
      </Tooltip>

      <Tooltip label={'Number of RateMyProfessor ratings'} hasArrow>
        <Badge className='bg-blue text-center' variant={'outline'}>
          {review.numRatings} RMP ratings
        </Badge>
      </Tooltip>
    </div>
  );
}

interface StarRatingInterface extends HTMLAttributes<HTMLSpanElement> {
  rating: number;
}

function StarRating({ rating, className, ...props }: StarRatingInterface) {
  // Rounds to the nearest 0.5
  const numStars = Math.round(rating * 2) / 2;
  const fullStars = Math.floor(numStars);

  return (
    <span {...props} className={cn(className, 'flex')}>
      {Array.from({ length: fullStars }).map((_, i) => (
        <StarIcon key={i} size={12} className='fill-current' />
      ))}

      {Math.fround(numStars) > Math.fround(fullStars) && (
        <StarHalfIcon size={12} className='fill-current' />
      )}
    </span>
  );
}
