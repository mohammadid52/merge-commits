import {VscFileMedia} from 'react-icons/vsc';

interface PageTileProps {
  whClass?: string;
  marginClass?: string;
}

const PageTile = (props: PageTileProps) => {
  const {whClass, marginClass} = props;

  return (
    <div
      className={`
    ${whClass ? whClass : 'w-24 h-32'}
    ${marginClass ? marginClass : 'mb-2'}
    relative 
    flex items-center bg-white shadow rounded`}>
      <VscFileMedia size="24px" className="w-auto h-auto mx-auto text-gray-400" />
    </div>
  );
};

export default PageTile;
