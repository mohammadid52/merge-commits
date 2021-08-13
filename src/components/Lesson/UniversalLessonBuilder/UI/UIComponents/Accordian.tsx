import React, {useRef, useState} from 'react';
import Buttons from '../../../../Atoms/Buttons';

interface AccordionProps {
  title: React.ReactNode;
  content: {
    id: string;
    text: string;
  }[];
  onResponseSelect?: (response: any) => void;
}

export const Accordion: React.FC<AccordionProps> = ({
  title,
  onResponseSelect,
  content,
}) => {
  const [active, setActive] = useState(false);
  const [height, setHeight] = useState('0px');

  const contentSpace = useRef(null);

  function toggleAccordion() {
    setActive(active === false ? true : false);
    // @ts-ignore
    setHeight(active ? '0px' : `${contentSpace.current.scrollHeight}px`);
  }

  return (
    <div className="flex flex-col">
      <div
        className="py-6 box-border px-4 appearance-none hover:bg-gray-200 cursor-pointer focus:outline-none flex items-center justify-between"
        onClick={toggleAccordion}>
        <p className="inline-block text-lg w-auto font-medium ">{title}</p>
        <Buttons label="Add this" onClick={() => onResponseSelect(content)} />
      </div>
      <div
        ref={contentSpace}
        style={{maxHeight: `${height}`}}
        className="overflow-auto transition-max-height duration-700 ease-in-out">
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
