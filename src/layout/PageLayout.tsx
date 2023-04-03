import {Card} from 'antd';
import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  extra?: React.ReactNode;
}

const PageLayout = ({children, extra, title, subtitle}: PageLayoutProps) => {
  return (
    <Card title={title} extra={extra}>
      {children}
    </Card>
  );
};

export default PageLayout;
