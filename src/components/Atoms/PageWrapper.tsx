import { setPageTitle } from "@utilities/functions";
import React, { useEffect } from "react";

interface PageWrapperProps {
  children: React.ReactNode;
  wrapClass?: string;
  defaultClass?: string;
  pageName?: string;
}

const PageWrapper: React.FC<PageWrapperProps> = (
  pageWrapperProps: PageWrapperProps
) => {
  const {
    children,
    wrapClass,
    defaultClass = "px-4 white_back theme-card-shadow overflow-hidden",
    pageName,
  } = pageWrapperProps;

  useEffect(() => {
    pageName && setPageTitle(pageName);

    return () => {
      setPageTitle("");
    };
  }, [pageName]);

  return (
    <div
      className={`w-full py-8 ${defaultClass} relative mb-0 ${
        wrapClass ? wrapClass : ""
      }`}
    >
      {children}
    </div>
  );
};

export default PageWrapper;
