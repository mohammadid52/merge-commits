import {Widget} from 'interfaces/ClassroomComponentsInterfaces';
import {AiOutlineFileZip, AiOutlinePhone} from 'react-icons/ai';
import {GoTextSize} from 'react-icons/go';
import {GrBlockQuote} from 'react-icons/gr';

function ContentCardTitle(props: {
  icon?: boolean;
  icontype?: string;
  title: string;
  theme: any;
  widgetObj: Widget;
}) {
  const iconProps = {
    size: '1rem',
    color: 'darkgrey'
  };

  const switchIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <AiOutlinePhone {...iconProps} />;
      case 'quote':
        return <GrBlockQuote {...iconProps} />;
      case 'default':
        return <GoTextSize {...iconProps} />;
      case 'file':
        return <AiOutlineFileZip {...iconProps} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <h2
        className={` flex text-sm border-b-0 border-dark-gray w-auto text-dark-gray pb-2 font-medium mb-2 text-left`}>
        {props.icon && (
          <span className={`w-auto mr-2`}>{switchIcon(props.icontype || '')}</span>
        )}
        {props.title}
      </h2>
    </div>
  );
}

export default ContentCardTitle;
