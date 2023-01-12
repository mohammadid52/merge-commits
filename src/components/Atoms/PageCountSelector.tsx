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

  const nearestNum = [10, 25, 50, 100, 500, 1000].filter((d) => d > totalResults)[0];

  const list = [
    {value: 10, name: 'show 10', id: 1},
    {value: 25, name: 'show 25', id: 2},
    {value: 50, name: 'show 50', id: 3},
    {value: 100, name: 'show 100', id: 4},
    {value: 500, name: 'show 500', id: 5},
    {value: 1000, name: 'show 1000', id: 6}
  ].filter((selector) => selector.value <= nearestNum);

  const _list = list.length > 0 ? list : [{value: 10, name: 'show 10', id: 1}];

  const [selectedItem, setSelectedItem] = useState<string>(_list[0].name);

  return (
    <div className={`w-auto`}>
      <Selector
        onChange={(val: any, name: string) => {
          setSelectedItem(name);
          setPageSize(Number(val));
        }}
        disableSort
        dropdownWidth="w-48"
        direction="topleft"
        selectedItem={selectedItem}
        list={_list}
        placeholder="Show pages"
      />
    </div>
  );
};

export default PageCountSelector;
