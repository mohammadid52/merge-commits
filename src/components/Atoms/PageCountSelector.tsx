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
    {value: 10, label: '10 / page'},
    {value: 25, label: '25 / page'},
    {value: 50, label: '50 / page'},
    {value: 100, label: '100 / page'},
    {value: 500, label: '500 / page'},
    {value: 1000, label: '1000 / page'}
  ].filter((selector) => selector.value <= nearestNum);

  const _list =
    list.length > 0
      ? list.map((d) => ({...d, value: d.value.toString()}))
      : [{value: '10', label: '10 / page'}];

  const [selectedItem, setSelectedItem] = useState<string>(_list[0].label);

  return (
    <div className="ml-8">
      <Selector
        size="middle"
        onChange={(val: any) => {
          setSelectedItem(val);
          setPageSize(Number(val));
        }}
        disableSort
        selectedItem={selectedItem}
        list={_list}
        placeholder="pages"
      />
    </div>
  );
};

export default PageCountSelector;
