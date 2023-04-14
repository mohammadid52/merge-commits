import ErrorBoundary from '@components/Error/ErrorBoundary';
import {ListBottomBar as IListBottomBar} from '@customHooks/usePagination';
import {removeQuery, setQuery} from '@utilities/urls';
import {Alert, Table, TableProps} from 'antd';
import camelCase from 'lodash/camelCase';
import '../../style/_table.scss';
import SortTable, {SortTableProps} from './SortTable';

interface IDataListItem {
  [key: string]: any;
  onClick: () => void;
}

interface IConfig {
  dataList?: {
    loading?: boolean;
    expandable?: boolean;
    sortableConfig?: {
      onSort: SortTableProps['onDragEnd'];
    };
    pagination?: {
      showPagination: boolean;
      config?: {
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

  const resetOtherQueries = () => {
    removeQuery('filter');
    removeQuery('search');
  };

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
        !isSortable && data?.onClick?.();
      },
      onDoubleClick: () => {
        isSortable && data?.onClick?.();
      }
    }),

    className: 'universal-table mt-2 overflow-x-auto',
    loading: config.dataList?.loading,

    pagination: showPagination
      ? {
          position: ['bottomCenter'],
          total: paginationConfig?.allAsProps.totalResults,
          pageSize: paginationConfig?.allAsProps.pageCount,
          current: paginationConfig?.allAsProps.currentPage,
          onChange: (page) => {
            resetOtherQueries();
            removeQuery('pageSize');
            setQuery('page', page.toString());
            paginationConfig?.allAsProps.setCurrentPage(page);
          },
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          responsive: true,
          showSizeChanger: true,
          onShowSizeChange: (_, pageSize) => {
            resetOtherQueries();
            setQuery('pageSize', pageSize.toString());
            paginationConfig?.allAsProps.setPageCount(pageSize);
          }
        }
      : undefined,
    dataSource: dataSource,
    columns: columns
  };

  //  render sortable table

  const isSortable = Boolean(dataListConfig?.sortableConfig?.onSort);

  return (
    <ErrorBoundary componentName="Table">
      {isSortable && (
        <Alert
          message="Double click on a row to view"
          type="info"
          showIcon
          className="mt-2"
          closable
        />
      )}
      {isSortable ? (
        // @ts-ignore
        <SortTable onDragEnd={dataListConfig?.sortableConfig?.onSort} {...tableProps} />
      ) : (
        <Table {...tableProps} />
      )}
    </ErrorBoundary>
  );
};
export default TableComponent;
