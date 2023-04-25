import Highlighted from '@components/Atoms/Highlighted';

const UnitName = ({editCurrentUnit, item, searchTerm}: any) => {
  return (
    <div
      className="cursor-pointer hover:underline hover:theme-text:400"
      onClick={() => editCurrentUnit(item.id)}>
      <Highlighted text={item.name} highlight={searchTerm} />
    </div>
  );
};

export default UnitName;
