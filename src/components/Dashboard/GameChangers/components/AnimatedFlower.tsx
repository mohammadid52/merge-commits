import React, {useEffect, useState} from 'react';

const AnimatedFlower = () => {
  const Circle = ({id, className = ''}: {id: string; className?: string}) => {
    const [config, setConfig] = useState({h: 0, w: 0});

    useEffect(() => {
      const wrapper = $('#main-outer-wrapper');
      const height = wrapper.height();
      const width = wrapper.width();
      setConfig({h: height, w: width});
    }, []);

    return (
      <div id={id} className={className}>
        <div
          className="rounded-full bg-opacity-50 absolute top-0 left-0 bg-teal-400"
          style={{height: config.h / 2, width: config.w / 2}}
          id="circle1"></div>
        <div
          className={`rounded-full bg-opacity-50 absolute top-0 right-0 bg-teal-400`}
          style={{height: config.h / 2, width: config.w / 2}}
          id="circle2"></div>
        <div
          className="rounded-full bg-opacity-50 absolute   bg-teal-400"
          style={{
            height: config.h / 2,
            width: config.w / 2,
            left: '25%',
            bottom: '7%',
          }}
          id="circle3"></div>
      </div>
    );
  };

  return (
    <div id="main-outer-wrapper" className="mt-12 relative h-24 w-24  ">
      <Circle id="first-round" />
      <Circle id="second-round" className="transform rotate-90" />
    </div>
  );
};

export default AnimatedFlower;
