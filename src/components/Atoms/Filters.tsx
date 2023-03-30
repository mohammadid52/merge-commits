import {CloseCircleOutlined} from '@ant-design/icons';
import ErrorBoundary from '@components/Error/ErrorBoundary';
import {Radio} from 'antd';
import {RadioChangeEvent} from 'antd/es/radio';
import {useState} from 'react';
import Buttons from './Buttons';

export type SortType = 'ACTIVE' | 'TRAINING' | 'INACTIVE';

const Filters = ({
  updateFilter,
  filters,
  customFilters,
  resetPagination
}: {
  loading: boolean;
  updateFilter: any;
  filters: SortType | null;
  list?: any[];
  customFilters?: string[];
  resetPagination?: () => void;
  showingCount?: {
    totalResults: number;
    currentPage: number;
    lastPage: boolean;
    pageCount: number;
  } | null;
}) => {
  const defaultFilterMapping = ['ACTIVE', 'INACTIVE', 'TRAINING'];
  const filter = customFilters ? customFilters : defaultFilterMapping;

  const [mode, setMode] = useState(null);

  const handleModeChange = (e: RadioChangeEvent) => {
    const newMode = e.target.value;
    setMode(newMode);
    updateFilter(newMode);
    resetPagination?.();
  };

  return (
    <ErrorBoundary componentName="Filters">
      <div className="flex items-center justify-start gap-4">
        <Radio.Group
          onChange={handleModeChange}
          value={mode}
          style={{marginTop: 8, marginBottom: 8}}>
          {filter.map((filterName) => (
            <Radio.Button key={filterName} value={filterName}>
              {filterName}
            </Radio.Button>
          ))}
        </Radio.Group>

        {/* Add clear reset button */}
        {mode && (
          <Buttons
            label={'Clear filters'}
            transparent
            Icon={CloseCircleOutlined}
            size="middle"
            onClick={() => {
              updateFilter(filters);
              setMode(null);
              resetPagination?.();
            }}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Filters;
