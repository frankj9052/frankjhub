import * as React from 'react';

/**
 * stop propagation and default
 */
function stopPropagationAndDefault(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  e.preventDefault();
  e.stopPropagation();
}

export { stopPropagationAndDefault };
