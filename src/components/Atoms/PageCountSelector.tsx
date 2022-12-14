import React, {useState} from 'react';
import Selector from 'atoms/Form/Selector';

interface CountProps {
  pageSize: number;
  setPageSize: (c: number) => void;
  totalResults: number;
}
const PageCountSelector: React.FC<CountProps> = (countProps: CountProps) => {
  const {totalResults = 101, setPageSize} = countProps;

  // ------------------------------------ FOR CUSTOM SELECTOR --------------------------------

  const nearestNum = [10, 25, 50, 100].filter((d) => d > totalResults)[0];

  const list = [
    {value: 10, name: 'show 10', id: 1},
    {value: 25, name: 'show 25', id: 2},
    {value: 50, name: 'show 50', id: 3},
    {value: 100, name: 'show 100', id: 4}
  ].filter((selector) => selector.value <= nearestNum);

  const [selectedItem, setSelectedItem] = useState<string>(list[0].name);

  return (
    <div className={`w-auto`}>
      <Selector
        onChange={(val: any, name: string) => {
          setSelectedItem(name);
          setPageSize(Number(val));
        }}
        dropdownWidth="w-48"
        style={{left: '-5rem'}}
        selectedItem={selectedItem}
        list={list}
        placeholder="Show pages"
      />
    </div>
  );
};

export default PageCountSelector;
