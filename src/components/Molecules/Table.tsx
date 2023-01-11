import ErrorBoundary from '@components/Error/ErrorBoundary';
import {isEmpty} from 'lodash';
import camelCase from 'lodash/camelCase';
import map from 'lodash/map';
import React, {forwardRef} from 'react';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import '../../style/atoms/_table.scss';

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
    droppable?: {
      isDroppable: boolean;
      onDragEnd: (result: any) => void;
      droppableId: string;
    };
    bgColor?: string;
    pattern?: string;
    patternConfig?: {firstColor?: string; secondColor?: string};
  };
}
interface IDroppableList {
  config: IConfig;
  dataList: IDataListItem[];
  customWidth?: {[key: string]: any};
  headers: string[];
  droppableConfig: IConfig['dataList']['droppable'];
}

interface IListItem {
  config: IConfig;
  idx: number;
  headers: string[];
  customWidth?: {[key: string]: any};
  item: IDataListItem;
}

const DroppableList = ({
  dataList,
  headers,
  config,
  customWidth,
  droppableConfig
}: IDroppableList) => {
  return (
    <DragDropContext onDragEnd={droppableConfig.onDragEnd}>
      <Droppable droppableId={droppableConfig.droppableId}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {dataList.map((item: any, idx: number) => (
              <Draggable key={item.id} draggableId={item.id} index={idx}>
                {(provided) => (
                  <ListItem
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    key={idx}
                    idx={idx}
                    config={config}
                    item={item}
                    headers={headers}
                    customWidth={customWidth}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const LoadingItem = ({headers, config, customWidth, idx}: any) => {
  return (
    <div
      className={`flex justify-between ${
        config?.dataList?.bgColor
          ? config?.dataList?.bgColor
          : config?.dataList?.pattern === 'striped'
          ? idx % 2 === 0
            ? `${config?.dataList?.patternConfig.firstColor}`
            : `${config?.dataList?.patternConfig.secondColor}`
          : 'bg-transparent'
      }`}>
      {map(headers, (header, idx: number) => {
        let lowerHeader = camelCase(header.toLowerCase());

        const _customWidth = customWidth[lowerHeader];

        const className = `${config?.dataList?.textColor || 'text-gray-500'} px-6 py-4 ${
          _customWidth ||
          (config?.isFirstIndex && idx === 0
            ? 'w-20'
            : idx === 0
            ? 'w-72'
            : config?.isLastAction && idx === headers.length - 1
            ? 'w-20'
            : '')
        } animate-pulse`;

        return (
          <td key={header} className={className}>
            <div className="bg-gray-400 h-4 flex "></div>
          </td>
        );
      })}
    </div>
  );
};

const ListItem = forwardRef<any, IListItem>(
  ({config, idx, headers, item, customWidth, ...rest}, ref) => {
    return (
      <tr
        key={idx}
        {...rest}
        ref={ref}
        className={`flex justify-between ${
          config?.dataList?.bgColor
            ? config?.dataList?.bgColor
            : config?.dataList?.pattern === 'striped'
            ? idx % 2 === 0
              ? `${config?.dataList?.patternConfig.firstColor}`
              : `${config?.dataList?.patternConfig.secondColor}`
            : 'bg-transparent'
        }`}>
        {map(headers, (header, _idx) => {
          let lowerHeader = camelCase(header.toLowerCase());

          let _item = item[lowerHeader];
          const _customWidth = customWidth[lowerHeader];

          const className = `${
            config?.dataList?.textColor || 'text-gray-500'
          } px-6 py-4 ${
            _customWidth ||
            (config?.isFirstIndex && _idx === 0
              ? 'w-20'
              : _idx === 0
              ? 'w-72'
              : config?.isLastAction && _idx === headers.length - 1
              ? 'w-20'
              : '')
          } text-sm`;
          if (typeof _item === 'string') {
            return (
              <td
                key={item.id + '-' + header}
                className={className}
                dangerouslySetInnerHTML={{
                  __html: _item
                }}></td>
            );
          } else {
            return (
              <td key={item.id + '-' + header} className={className}>
                {_item}
              </td>
            );
          }
        })}
      </tr>
    );
  }
);

const Table = ({
  dataList,
  headers,
  config = {dark: true, dataList: {customWidth: {}}}
}: {
  config?: IConfig;
  headers: string[];
  dataList: IDataListItem[];
}) => {
  const _headers = headers.filter(Boolean);

  const dataListConfig = config.dataList || {};
  const droppableConfig = dataListConfig.droppable;
  const _customWidth = config?.dataList?.customWidth || {};

  const goodForDroppable =
    !isEmpty(droppableConfig) &&
    droppableConfig.isDroppable &&
    droppableConfig.droppableId &&
    typeof droppableConfig.onDragEnd === 'function';

  return (
    <ErrorBoundary fallback={<div className="hidden"></div>} componentName="Table">
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="py-2 align-middle inline-block min-w-full">
            <div
              className={` overflow-hidden border-0 ${
                config?.dark ? 'border-gray-700' : 'border-gray-200'
              } sm:rounded-lg`}>
              <table className="min-w-full divide-y-0 divide-gray-700">
                <thead className={`${config?.headers?.bgColor || 'theme-bg'} `}>
                  <tr className="flex justify-between">
                    {map(_headers, (header, idx) => {
                      let lowerHeader = camelCase(header.toLowerCase());

                      const customWidth = _customWidth[lowerHeader];

                      const className = `${
                        config?.headers?.textColor || 'text-gray-500'
                      } px-6 py-3 ${
                        customWidth ||
                        (config?.isFirstIndex && idx === 0
                          ? 'w-20'
                          : idx === 0
                          ? 'w-72'
                          : config?.isLastAction && idx === _headers.length - 1
                          ? 'w-20'
                          : '')
                      } text-left text-xs font-medium  uppercase tracking-wider`;
                      return (
                        <th key={header} scope="col" className={className}>
                          {header}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody
                  className={`${
                    dataListConfig?.maxHeight || 'max-h-88 '
                  } overflow-y-auto ${config.dark ? 'dark-scroll' : ''} `}>
                  {dataListConfig.loading ? (
                    [0, 1, 2, 3].map((item: any, idx: number) => (
                      <LoadingItem
                        idx={item}
                        headers={_headers}
                        customWidth={_customWidth}
                        config={config}
                      />
                    ))
                  ) : dataList.length === 0 ? (
                    <p className="text-center text-base w-full h-24 text-gray-500 flex items-center justify-center">
                      {dataListConfig.emptyText}
                    </p>
                  ) : goodForDroppable ? (
                    <DroppableList
                      droppableConfig={droppableConfig}
                      headers={_headers}
                      customWidth={_customWidth}
                      config={config}
                      dataList={dataList}
                    />
                  ) : (
                    dataList.map((item: any, idx: number) => (
                      <ListItem
                        key={idx}
                        idx={idx}
                        config={config}
                        item={item}
                        headers={_headers}
                        customWidth={_customWidth}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};
export default Table;
