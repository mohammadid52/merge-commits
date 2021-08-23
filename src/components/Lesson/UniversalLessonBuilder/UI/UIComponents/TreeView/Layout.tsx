import React from "react";
import "../tailwind.output.css";

interface ILayoutProps{
  children: React.ReactNode
}

const Layout = ({children}: ILayoutProps): JSX.Element => {
  return <div className="px-20 py-10">{children}</div>;
};

export default Layout;
