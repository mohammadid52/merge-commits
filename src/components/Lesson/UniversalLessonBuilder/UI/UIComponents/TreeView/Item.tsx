import React from 'react';
export const Item = ({
  children,
  // @ts-ignore
  dark,
  ...rest
}: React.PropsWithChildren<
  React.DetailedHTMLProps<React.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>
>) => (
  <li className={`cursor-pointer ${dark ? 'text-darkest' : ''}`} {...rest}>
    {children}
  </li>
);
