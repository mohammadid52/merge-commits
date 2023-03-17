import ErrorBoundary from '@components/Error/ErrorBoundary';
import {Breadcrumb} from 'antd';
import React from 'react';
import {BreadCrumb} from './BreadcrumbsWithBanner';

interface BreadCrumProps {
  items: BreadCrumb[];
  unsavedChanges?: boolean;
  separateGoBackButton?: string;
  toggleModal?: any;
}

const BreadCrums: React.FC<BreadCrumProps> = (brdPrps: BreadCrumProps) => {
  const {items} = brdPrps;

  return (
    <ErrorBoundary componentName="BreadCrums">
      <Breadcrumb items={items} />
    </ErrorBoundary>
  );
};
export default BreadCrums;
