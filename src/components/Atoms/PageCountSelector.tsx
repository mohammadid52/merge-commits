import React, {useState} from 'react';
import Selector from './Form/Selector';

interface CountProps {
  pageSize: number;
  setPageSize: (c: number) => void;
}
const PageCountSelector: React.FC<CountProps> = (countProps: CountProps) => {
  const {pageSize, setPageSize} = countProps;

  // ------------------------------------ FOR CUSTOM SELECTOR --------------------------------
  const list = [
    {value: 10, name: 'show 10', id: 1},
    {value: 25, name: 'show 25', id: 2},
    {value: 50, name: 'show 50', id: 3},
    {value: 100, name: 'show 100', id: 4},
  ];
  const [selectedItem, setSelectedItem] = useState<string>(list[0].name);
  return (
    <div className={`w-2/5 lg:w-1/4 mt-8 lg:mt-0 flex items-start lg:items-center`}>
      <Selector
        onChange={(val: any, name: string) => {
          setSelectedItem(name);
          setPageSize(Number(val));
        }}
        selectedItem={selectedItem}
        list={list}
        placeholder="Show pages"
      />
    </div>
  );

  // ------------------------------------ FOR DEFAULT NATIVE SELECTOR --------------------------------

  // return (
  //   <select
  //     className={`text-sm ${theme.formSelect} ${theme.outlineNone} w-auto py-3 px-4  my-5 rounded`}
  //     // value={pageSize}
  //     onChange={(e) => {
  //       setPageSize(Number(e.target.value));
  //     }}>
  //     {[10, 25, 50, 100].map((_pageSize) => (
  //       <option key={_pageSize} value={_pageSize}>
  //         Show {_pageSize}
  //       </option>
  //     ))}
  //   </select>
  // );
};

export default PageCountSelector;
