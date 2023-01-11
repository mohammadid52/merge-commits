import ErrorBoundary from '@components/Error/ErrorBoundary';
import AnimatedContainer from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import ShowingCount from '@components/MicroComponents/ShowingCount';
import {isEmpty} from 'lodash';
import React from 'react';
import Buttons from './Buttons';

export type SortType = 'ACTIVE' | 'TRAINING' | 'INACTIVE';

const Filters = ({
  updateFilter,
  loading,
  filters,
  list,
  showingCount,
  customFilters
}: {
  loading: boolean;
  updateFilter: any;
  filters: SortType;
  list?: any[];
  customFilters?: string[];
  showingCount?: {
    totalResults: number;
    currentPage: number;
    lastPage: boolean;
    pageCount: number;
  };
}) => {
  const getLen = (status: SortType) =>
    list.filter((_d: {status: SortType}) => _d.status === status).length;

  const defaultFilterMapping = ['ACTIVE', 'INACTIVE', 'TRAINING'];
  const filter = customFilters ? customFilters : defaultFilterMapping;

  return (
    <ErrorBoundary componentName="Filters">
      <div className="flex items-center justify-between">
        <div className="flex gap-x-4 my-4 items-center">
          {filter.map((filterName) => (
            <Buttons
              onClick={() => updateFilter(filterName)}
              transparent={filters !== filterName}
              size="small"
              disabled={loading}
              label={filterName}
            />
          ))}
        </div>

        <AnimatedContainer duration="500" animationType="slideIn" show={!loading}>
          {!loading && !isEmpty(filters) ? (
            <h5 className="text-sm text-gray-700 text-right w-auto">
              {filters !== undefined && filters !== null
                ? `${getLen(filters)} ${filters?.toLocaleLowerCase()} items - `
                : ''}{' '}
              Total {list.length} items
            </h5>
          ) : (
            Boolean(showingCount) && <ShowingCount {...showingCount} />
          )}
        </AnimatedContainer>
      </div>
    </ErrorBoundary>
  );
};

export default Filters;
