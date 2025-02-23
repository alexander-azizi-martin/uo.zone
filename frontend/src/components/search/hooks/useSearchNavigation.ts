import { useEffect, useRef } from 'react';

function useSearchNavigation(searchBar: HTMLInputElement | null | undefined) {
  const lastCursorPosition = useRef<number | null>();

  useEffect(() => {
    const navigableNodes = Array.from(
      document.querySelectorAll<HTMLElement>('[data-search-result=""]'),
    );

    const focusNode = (i: number) => {
      const resultNode = navigableNodes[i];
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
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      const searchbarSelected = searchBar === document.activeElement;
      const selectedNode = navigableNodes.findIndex(
        (node) => node === document.activeElement,
      );

      const upEvent =
        event.key === 'ArrowUp' || (event.key === 'Tab' && event.shiftKey);
      const downEvent =
        event.key === 'ArrowDown' || (event.key === 'Tab' && !event.shiftKey);

      if (upEvent) {
        if (selectedNode - 1 >= 0) {
          focusNode(selectedNode - 1);
          event.preventDefault();
        } else if (selectedNode !== -1) {
          focusSearchBar(true);
          event.preventDefault();
        }
      } else if (downEvent) {
        if (searchbarSelected && 0 < navigableNodes.length) {
          lastCursorPosition.current = searchBar?.selectionStart;
          focusNode(0);
          event.preventDefault();
        } else if (
          selectedNode !== -1 &&
          selectedNode + 1 < navigableNodes.length
        ) {
          focusNode(selectedNode + 1);
          event.preventDefault();
        } else if (selectedNode === -1 && event.key === 'ArrowDown') {
          focusNode(0);
          event.preventDefault();
        }
      } else if (!['Shift', 'Tab', 'Enter'].includes(event.key)) {
        focusSearchBar(false);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  });
}

export { useSearchNavigation };
