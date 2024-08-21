import cntl from 'cntl';
import { SearchIcon } from 'lucide-react';
import { type ComponentPropsWithRef, forwardRef } from 'react';

import { cn } from '@/lib/utils';

type SearchBarProps = ComponentPropsWithRef<'input'>;

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, ...props }, ref) => (
    <div
      className={cn(
        'relative flex rounded-lg shadow-[0_0_20px] shadow-geegee-light/10 dark:shadow-geegee-light/25',
        className,
      )}
    >
      <div className='absolute left-0 top-0 flex size-10 items-center justify-center'>
        <SearchIcon size={18} />
      </div>

      <input
        {...props}
        ref={ref}
        type='text'
        className={cntl`
          h-10 w-full rounded-[inherit] pl-10 pr-4 outline-none 
          transition-shadow placeholder:text-gray-500 
          focus:shadow-[0_0_20px] focus:shadow-geegee-light/35
        `}
      />
    </div>
  ),
);
SearchBar.displayName = 'SearchBar';

export { SearchBar };

export type { SearchBarProps };
