import {CloseCircleOutlined} from '@ant-design/icons';
import ErrorBoundary from '@components/Error/ErrorBoundary';
import {getQuery, removeQuery, setQuery} from '@utilities/urls';
import {Radio} from 'antd';
import {RadioChangeEvent} from 'antd/es/radio';
import {useEffect, useState} from 'react';
import Buttons from './Buttons';

export type SortType = 'ACTIVE' | 'TRAINING' | 'INACTIVE';

const Filters = ({
  updateFilter,
  filters,
  customFilters,
  resetPagination,
  loading,
  list
}: {
  loading: boolean;
  updateFilter: any;
  filters: SortType | null;
  list?: any[];
  customFilters?: string[];
  resetPagination?: () => void;
}) => {
  const defaultFilterMapping = ['ACTIVE', 'INACTIVE', 'TRAINING'];
  const filter = customFilters ? customFilters : defaultFilterMapping;

  const [mode, setMode] = useState<string | null>(null);

  const handleModeChange = (e: RadioChangeEvent) => {
    const newMode = e.target.value;
    setMode(newMode);
    updateFilter(newMode);

    resetPagination?.();

    // setQuery('filter', newMode);
    // removeQuery('search');
  };

  // // check filter on load in useEffect

  // const filtersFromUrl = getQuery('filter');

  // useEffect(() => {
  //   if (filtersFromUrl && !loading) {
  //     updateFilter(filtersFromUrl.toUpperCase());
  //     setMode(filtersFromUrl.toString());
  //   }
  // }, [loading]);

  // // Remove mode if not filters in url
  // useEffect(() => {
  //   if (!filtersFromUrl) {
  //     updateFilter(filters);
  //     setMode(null);
  //   }
  // }, [filtersFromUrl]);

  // set default filter to ACTIVE on useEffect

  useEffect(() => {
    if (!loading && !customFilters && list && list?.length > 0) {
      handleModeChange({target: {value: 'ACTIVE'}} as RadioChangeEvent);
    }
  }, [loading, list]);

  const onClearFilter = () => {
    updateFilter(filters);
    setMode(null);
    resetPagination?.();

    removeQuery('filter');
  };

  return (
    <ErrorBoundary componentName="Filters">
      <div className="flex items-center justify-start gap-4">
        <Radio.Group disabled={loading} onChange={handleModeChange} value={mode}>
          {filter.map((filterName) => (
            <Radio.Button key={filterName} value={filterName}>
              {filterName}
            </Radio.Button>
          ))}
        </Radio.Group>

        {/* Add clear reset button */}
        {mode && !loading && (
          <Buttons
            label={'Clear filters'}
            transparent
            Icon={CloseCircleOutlined}
            size="middle"
            onClick={onClearFilter}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Filters;
