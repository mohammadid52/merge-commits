import React, {useEffect, useRef, useState} from 'react';
import Buttons from '../../../../Atoms/Buttons';
import Tooltip from '../../../../Atoms/Tooltip';

interface AccordionProps {
  title: React.ReactNode;
  className?: string;
  content: {
    id: string;
    text: string;
  }[];
  onResponseSelect?: (response: any) => void;
  overrideBool?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({
  title,
  onResponseSelect,
  content,
  overrideBool,
}) => {
  const [active, setActive] = useState(false);
  const [height, setHeight] = useState('0px');

  const contentSpace = useRef(null);

  function toggleAccordion() {
    setActive(active === false ? true : false);

    setHeight(active ? '0px' : `${contentSpace.current.scrollHeight}px`);
  }
  useEffect(() => {
    if (overrideBool) {
      // collapse true
      setActive(false);
    } else {
      // collapse false
      setActive(true);
    }
    setHeight(overrideBool ? '0px' : `${contentSpace.current.scrollHeight}px`);
  }, [overrideBool]);

  return (
    <div className="flex flex-col mr-6 mt-2 rounded-md">
      {/* <Tooltip text={`Click me to see options`} placement={'bottom'}> */}
      <div
        className="py-6 box-border px-4 appearance-none hover:bg-gray-200 cursor-pointer focus:outline-none flex items-center justify-between"
        onClick={toggleAccordion}>
        <p className="inline-block text-lg w-auto font-medium ">{title}</p>
        <Buttons label="Add this" onClick={() => onResponseSelect(content)} />
      </div>
      {/* </Tooltip> */}
      <div
        ref={contentSpace}
        style={{maxHeight: `${height}`}}
        className="overflow-auto transition-all duration-300 ease-in-out mt-4">
        <ul className="pb-5 list-disc px-8">
          {content.map((item) => (
            <li className="" key={item.id}>
              {item.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
