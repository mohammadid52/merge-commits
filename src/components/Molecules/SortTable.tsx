import {DragOutlined} from '@ant-design/icons';
import type {DragEndEvent} from '@dnd-kit/core';
import {DndContext} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {Table} from 'antd';
import type {TableProps} from 'antd/es/table';
import React from 'react';

export interface SortTableProps extends TableProps<any> {
  onDragEnd: (event: DragEndEvent) => void;
}

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}

const Row = (props: RowProps) => {
  const {attributes, listeners, setNodeRef, transform, transition, isDragging} =
    useSortable({
      id: props['data-row-key']
    });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform && {...transform, scaleY: 1}),
    transition,

    ...(isDragging ? {position: 'relative', zIndex: 9999} : {})
  };

  return <tr {...props} ref={setNodeRef} style={style} {...attributes} {...listeners} />;
};

const SortTable = (props: SortTableProps) => {
  const {dataSource, columns} = props;

  // add menu icon to the first item in columns
  if (columns && columns.length > 0) {
    columns.unshift({
      title: 'Sort',
      dataIndex: '0',
      key: 'sort',
      className: 'w-0'
    });
  }

  // add menu icon to the first item in dataSource
  if (dataSource && dataSource.length > 0) {
    dataSource.forEach((item) => {
      item['0'] = <DragOutlined />;
    });
  }

  return (
    <DndContext onDragEnd={props.onDragEnd}>
      <SortableContext
        // rowKey array
        items={props && props.dataSource ? props?.dataSource?.map((i) => i.id) : []}
        strategy={verticalListSortingStrategy}>
        <Table
          components={{
            body: {
              row: Row
            }
          }}
          rowKey="id"
          {...props}
        />
      </SortableContext>
    </DndContext>
  );
};

export default SortTable;
