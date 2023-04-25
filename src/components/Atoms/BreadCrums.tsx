import ErrorBoundary from '@components/Error/ErrorBoundary';
import {Breadcrumb} from 'antd';
import React from 'react';
import {BreadCrumb} from './BreadcrumbsWithBanner';
import {NavLink} from 'react-router-dom';

interface BreadCrumProps {
  items: BreadCrumb[];
  unsavedChanges?: boolean;
  separateGoBackButton?: string;
  toggleModal?: any;
}

const BreadCrums: React.FC<BreadCrumProps> = (brdPrps: BreadCrumProps) => {
  const {items} = brdPrps;

  const itemRender = (route: any, _: any, routes: string | any[]) => {
    const last = routes.indexOf(route.title as string) === routes.length - 1;

    return last ? (
      <span>{route.title}</span>
    ) : (
      <NavLink to={route.href}>{route.title}</NavLink>
    );
  };

  return (
    <ErrorBoundary componentName="BreadCrums">
      <Breadcrumb itemRender={itemRender} items={items} />
    </ErrorBoundary>
  );
};
export default BreadCrums;
