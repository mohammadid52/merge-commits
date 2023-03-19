import ErrorBoundary from '@components/Error/ErrorBoundary';
import {Radio} from 'antd';
import {RadioChangeEvent} from 'antd/es/radio';
import {useState} from 'react';

export type SortType = 'ACTIVE' | 'TRAINING' | 'INACTIVE';

const Filters = ({
  updateFilter,

  customFilters
}: {
  loading: boolean;
  updateFilter: any;
  filters: SortType | null;
  list?: any[];
  customFilters?: string[];
  showingCount?: {
    totalResults: number;
    currentPage: number;
    lastPage: boolean;
    pageCount: number;
  } | null;
}) => {
  const defaultFilterMapping = ['ACTIVE', 'INACTIVE', 'TRAINING'];
  const filter = customFilters ? customFilters : defaultFilterMapping;

  const [mode, setMode] = useState(filter[0]);

  const handleModeChange = (e: RadioChangeEvent) => {
    const mode = e.target.value;
    setMode(mode);
    updateFilter(mode);
  };

  return (
    <ErrorBoundary componentName="Filters">
      <div className="flex items-center justify-between">
        <Radio.Group onChange={handleModeChange} value={mode} style={{marginBottom: 8}}>
          {filter.map((filterName) => (
            <Radio.Button key={filterName} value={filterName}>
              {filterName}
            </Radio.Button>
          ))}
        </Radio.Group>

        {/* <AnimatedContainer duration="500" animationType="slideIn" show={!loading}>
          {!loading && !isEmpty(filters) ? (
            <h5 className="text-sm text-gray-700 text-right w-auto">
              {filters !== undefined && filters !== null
                ? `${getLen(filters)} ${filters?.toLocaleLowerCase()} items - `
                : ''}{' '}
              Total {list?.length} items
            </h5>
          ) : (
            Boolean(showingCount) &&
            showingCount?.totalResults && <ShowingCount {...showingCount} />
          )}
        </AnimatedContainer> */}
      </div>
    </ErrorBoundary>
  );
};

export default Filters;
