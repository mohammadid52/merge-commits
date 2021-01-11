import React, { useContext, useEffect, useState } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { useCookies } from 'react-cookie';
import InstructionsBlock from './InstructionBlock';
import Banner from './Banner';
import Modules from './Modules';
import InstructionsPopup from '../../../Popup/InstructionsPopup';
import TChartForm from './TChartForm';

interface TChartState {
  list: string;
  list2: string;
}

const TChart = () => {
  const { state, dispatch } = useContext(LessonContext);
  const [cookies, setCookie] = useCookies(['tchart']);
  const inputs = state.data.lesson.warmUp.inputs;
  const video = state.data.lesson.warmUp.instructions.link;
  const [openPopup, setOpenPopup] = useState(false);

  useEffect(() => {
    if (!cookies.tchart && !state.componentState.tchart) {
      let tempObj: TChartState = {
        list: '',
        list2: '',
      };

      dispatch({
        type: 'SET_INITIAL_COMPONENT_STATE',
        payload: {
          name: 'tchart',
          content: tempObj,
        },
      });

      setCookie('tchart', tempObj);
    }

    if (cookies.tchart) {
      dispatch({
        type: 'SET_INITIAL_COMPONENT_STATE',
        payload: {
          name: 'tchart',
          content: cookies.tchart,
        },
      });
    }
  }, []);

  return (
    <>
      <InstructionsPopup video={video} open={openPopup} setOpen={setOpenPopup} />
      <div className="w-full h-full flex flex-col justify-between items-center">
        <Banner />
        <div className="w-full h-8.8/10 flex flex-col items-center md:flex-row md:justify-between">
          <div className="md:w-4/10 h-full flex flex-col justify-between items-center">
            <InstructionsBlock />
            {/*{inputs.additionalInputs.length > 0 ? (*/}
            {/*  <Modules*/}
            {/*    // breakdownProps={breakdownProps}*/}
            {/*    // setBreakdownProps={setBreakdownProps}*/}
            {/*    inputs={inputs.additionalInputs}*/}
            {/*  />*/}
            {/*) : null}*/}
          </div>
          <div className="md:w-5.9/10 h-full flex flex-col items-center">
            <TChartForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default TChart;
