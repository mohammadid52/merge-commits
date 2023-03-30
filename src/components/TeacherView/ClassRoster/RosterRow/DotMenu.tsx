import Buttons from '@components/Atoms/Buttons';
import {List, Popover} from 'antd';
import React from 'react';
import {BiDotsVerticalRounded} from 'react-icons/bi';

interface IDotMenuProps {
  menuItems?: {label: string; action?: Function; danger?: boolean}[];
  extraContent?: React.ReactNode;
  children?: React.ReactNode;
}

const DotMenu = ({menuItems, extraContent, children}: IDotMenuProps) => {
  // ~~~~~~~~~~~~~~~ CONTEXT ~~~~~~~~~~~~~~~ //

  const content = (
    <List
      footer={extraContent}
      dataSource={menuItems as any[]}
      renderItem={(item) => (
        <List.Item>
          <Buttons
            className="w-full"
            size="small"
            redBtn={item?.danger}
            variant="text"
            onClick={item?.action}
            label={item?.label}
          />
        </List.Item>
      )}
    />
  );

  return (
    <Popover content={content} trigger="click">
      {children || <Buttons Icon={BiDotsVerticalRounded} variant="text" />}
    </Popover>
  );
};

export default DotMenu;
