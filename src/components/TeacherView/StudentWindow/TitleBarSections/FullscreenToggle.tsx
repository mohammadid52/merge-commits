import {FaCompress, FaExpand} from 'react-icons/fa';

interface IFullscreenToggleProps {
  fullscreen?: boolean;
  handleFullscreen?: () => void;
}

const FullscreenToggle = ({fullscreen, handleFullscreen}: IFullscreenToggleProps) => {
  return (
    <div title="Show/Hide fullscreen" className="w-8 flex flex-col content-between ">
      <div
        className={`text-medium  hover:iconoclast:text-500 hover:curate:text-500 cursor-pointer`}
        onClick={handleFullscreen}>
        {fullscreen ? (
          <FaCompress size="1.5rem" className="z-[50]" />
        ) : (
          <FaExpand size="1.5rem" className="z-[50]" />
        )}
      </div>
    </div>
  );
};

export default FullscreenToggle;
