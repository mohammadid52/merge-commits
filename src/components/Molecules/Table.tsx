import ErrorBoundary from '@components/Error/ErrorBoundary';
import {Table, TableProps} from 'antd';
import camelCase from 'lodash/camelCase';
import '../../style/_table.scss';
import {ListBottomBar as IListBottomBar} from './ListBottomBar';

interface IDataListItem {
  [key: string]: any;
}

interface IConfig {
  isLastAction?: boolean;
  isFirstIndex?: boolean;
  dark?: boolean;
  headers?: {textColor?: string; bgColor?: string};
  dataList?: {
    loading?: boolean;
    emptyText?: string;
    customWidth?: {[key: string]: any};
    maxHeight?: string;
    textColor?: string;

    expandable?: boolean;

    droppable?: {
      isDroppable: boolean;
      onDragEnd: (result: any) => void;
      droppableId: string;
    };
    searchInput?: {
      value: string;
      isActive: boolean;
      typing: boolean;
    };
    pagination?: {
      showPagination: boolean;
      config: {
        allAsProps: IListBottomBar;
      };
    };
    bgColor?: string;
    pattern?: string;
    patternConfig?: {firstColor?: string; secondColor?: string};
  };
}

const TableComponent = ({
  dataList,
  headers,
  config = {dark: false, dataList: {customWidth: {}, pattern: 'striped'}}
}: {
  config?: IConfig;
  headers: (string | false)[];
  dataList: IDataListItem[];
}) => {
  const _headers = headers.filter(Boolean) as string[];

  const dataListConfig = config.dataList || {};

  const paginationConfig = dataListConfig?.pagination?.config;

  const showPagination = Boolean(dataListConfig?.pagination?.showPagination);

  // convert dataList into dataSource
  const dataSource = dataList.map((item, idx) => {
    return {
      key: idx.toString(),
      ...item
    };
  });

  const columns = _headers.map((header) => {
    let lowerHeader = camelCase(header.toLowerCase());
    return {
      title: header,
      dataIndex: lowerHeader,
      key: lowerHeader
    };
  });

  const tableProps: TableProps<any> = {
    bordered: true,
    expandable: config?.dataList?.expandable
      ? {
          expandedRowRender: (record: any) => <div>{record?.content}</div>,
          rowExpandable: (record: any) => Boolean(record?.content)
        }
      : undefined,
    className: 'universal-table mt-2',
    loading: config.dataList?.loading,
    pagination: showPagination
      ? {
          position: ['bottomCenter'],
          total: paginationConfig?.allAsProps.totalResults,
          pageSize: paginationConfig?.allAsProps.pageCount,
          current: paginationConfig?.allAsProps.currentPage,
          onChange: paginationConfig?.allAsProps.setCurrentPage,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          responsive: true,
          showSizeChanger: true
        }
      : undefined,
    dataSource: dataSource,
    columns: columns
  };

  return (
    <ErrorBoundary componentName="Table">
      <Table {...tableProps} />
    </ErrorBoundary>
  );
};
export default TableComponent;
