import { SearchIcon } from 'lucide-react';
import { type ComponentPropsWithRef, forwardRef } from 'react';

import { cn } from '@/lib/utils';

export type SearchBarProps = ComponentPropsWithRef<'input'>;

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn(
          'relative flex rounded-lg shadow-[0_0_20px_rgba(111,19,29,0.1)]',
          className,
        )}
      >
        <div className='absolute left-0 top-0 flex h-10 w-10 items-center justify-center'>
          <SearchIcon size={18} />
        </div>

        <input
          {...props}
          ref={ref}
          type='text'
          className='h-10 w-full rounded-[inherit] pl-10 pr-4 outline-none transition-shadow placeholder:opacity-60 focus:shadow-[0_0_20px_rgba(111,19,29,0.35)]'
        />
      </div>
    );
  },
);

SearchBar.displayName = 'SearchBar';
