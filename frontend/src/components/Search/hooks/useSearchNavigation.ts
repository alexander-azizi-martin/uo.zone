import { useEffect, useRef } from 'react';

export function useSearchNavigation(
  searchBar: HTMLInputElement | null | undefined,
) {
  const selectedIndex = useRef<number>(-1);
  const lastCursorPosition = useRef<number | null>();

  useEffect(() => {
    const resultNodes = document.querySelectorAll<HTMLElement>(
      '[data-search-result=""]',
    );

    const focusSelected = () => {
      const resultNode = resultNodes[selectedIndex.current];
      const resultNodeRect = resultNode.getBoundingClientRect();
      resultNode.focus();

      window.scrollTo({
        top:
          resultNodeRect.top +
          resultNodeRect.height / 2 +
          window.scrollY -
          window.innerHeight / 2,
      });
    };

    const focusSearchBar = (setCursor: boolean) => {
      searchBar?.focus();

      // Needed because won't work if synchronous
      requestAnimationFrame(() => {
        if (searchBar && lastCursorPosition.current && setCursor) {
          searchBar.setSelectionRange(
            lastCursorPosition.current,
            lastCursorPosition.current,
          );

          lastCursorPosition.current = undefined;
        }
      });

      selectedIndex.current = -1;
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      if (document.activeElement === searchBar) {
        selectedIndex.current = -1;
      }

      switch (event.key) {
        case 'ArrowUp':
          if (selectedIndex.current === 0) {
            focusSearchBar(true);
          } else if (selectedIndex.current > 0) {
            selectedIndex.current -= 1;
            focusSelected();
            event.preventDefault();
          }

          break;
        case 'ArrowDown':
          if (selectedIndex.current === -1) {
            lastCursorPosition.current = searchBar?.selectionStart;
          }
          if (resultNodes.length > selectedIndex.current + 1) {
            selectedIndex.current += 1;
            focusSelected();
            event.preventDefault();
          }

          break;
        default:
          if (selectedIndex.current >= 0 && event.key !== 'Enter') {
            focusSearchBar(false);
          }

          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  });
}
