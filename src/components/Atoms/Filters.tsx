import ErrorBoundary from '@components/Error/ErrorBoundary';
import AnimatedContainer from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import React from 'react';
import Buttons from './Buttons';

export type SortType = 'ACTIVE' | 'TRAINING' | 'INACTIVE';

const Filters = ({
  updateFilter,
  loading,
  filters,
  list
}: {
  loading: boolean;
  updateFilter: any;
  filters: SortType;
  list?: any[];
}) => {
  const getLen = (status: SortType) =>
    list.filter((_d: {status: SortType}) => _d.status === status).length;

  return (
    <ErrorBoundary componentName="Filters">
      <div className="flex items-center justify-between">
        <div className="flex gap-x-4 my-4 items-center">
          <Buttons
            onClick={() => updateFilter('ACTIVE')}
            transparent={filters !== 'ACTIVE'}
            size="small"
            disabled={loading}
            label={'Active'}
          />

          <Buttons
            onClick={() => updateFilter('INACTIVE')}
            transparent={filters !== 'INACTIVE'}
            size="small"
            disabled={loading}
            label={'Inactive'}
          />
          <Buttons
            onClick={() => updateFilter('TRAINING')}
            size="small"
            disabled={loading}
            transparent={filters !== 'TRAINING'}
            label={'Training'}
          />
        </div>

        <AnimatedContainer duration="500" animationType="slideIn" show={!loading}>
          {!loading && (
            <h5 className="text-sm text-gray-700 text-right w-auto">
              {filters !== undefined && filters !== null
                ? `${getLen(filters)} ${filters?.toLocaleLowerCase()} items - `
                : ''}{' '}
              Total {list.length} items
            </h5>
          )}
        </AnimatedContainer>
      </div>
    </ErrorBoundary>
  );
};

export default Filters;
