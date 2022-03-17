import React from 'react';

export const Memoize = React.memo(({children}) => {
  return <>{children}</>;
});
