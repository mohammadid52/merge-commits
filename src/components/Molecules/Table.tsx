import ErrorBoundary from '@components/Error/ErrorBoundary';
import {Table, TableProps} from 'antd';
import camelCase from 'lodash/camelCase';
import '../../style/_table.scss';
import {ListBottomBar as IListBottomBar} from '@customHooks/usePagination';

interface IDataListItem {
  [key: string]: any;
  onClick: () => void;
}

interface IConfig {
  dataList?: {
    loading?: boolean;
    expandable?: boolean;
    pagination?: {
      showPagination: boolean;
      config: {
        allAsProps: IListBottomBar;
      };
    };
  };
}

export interface ITableProps {
  config?: IConfig;
  headers: (string | false)[];
  dataList: IDataListItem[];
}

const TableComponent = ({dataList, headers, config = {}}: ITableProps) => {
  const _headers = headers.filter(Boolean) as string[];

  const dataListConfig = config?.dataList;

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
    onRow: (data: any) => ({
      onClick: () => {
        data?.onClick?.();
      }
    }),
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
          showSizeChanger: true,
          onShowSizeChange: (_, pageSize) =>
            paginationConfig?.allAsProps.setPageCount(pageSize)
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
