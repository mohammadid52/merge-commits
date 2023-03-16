import ErrorBoundary from '@components/Error/ErrorBoundary';
import {Breadcrumb} from 'antd';
import {getAsset} from 'assets';
import Buttons from 'atoms/Buttons';
import {useGlobalContext} from 'contexts/GlobalContext';
import React from 'react';
import {IoArrowUndoCircleOutline} from 'react-icons/io5';
import {useHistory} from 'react-router';
import {BreadCrumb} from './BreadcrumbsWithBanner';

interface BreadCrumProps {
  items: BreadCrumb[];
  unsavedChanges?: boolean;
  separateGoBackButton?: string;
  toggleModal?: any;
}

const BreadCrums: React.FC<BreadCrumProps> = (brdPrps: BreadCrumProps) => {
  const {items, separateGoBackButton = '', unsavedChanges = false, toggleModal} = brdPrps;
  const {theme, clientKey} = useGlobalContext();
  const themeColor = getAsset(clientKey, 'themeClassName');
  const history = useHistory();

  const goToUrl = (url: string) => {
    if (unsavedChanges) {
      toggleModal(url);
    } else {
      history.push(url);
    }
  };

  return (
    <ErrorBoundary componentName="BreadCrums">
      <Breadcrumb items={items} />
    </ErrorBoundary>
  );
};
export default BreadCrums;
