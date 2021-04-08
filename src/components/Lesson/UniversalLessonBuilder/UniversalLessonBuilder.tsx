import React, { useContext, useEffect } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';

const UniversalLessonBuilder = () => {
  const {state, dispatch} = useContext(GlobalContext)

  //  INITIALIZE CURRENT PAGE LOCATION
  useEffect(()=>{
    if(state.user.role === 'TR'|| state.user.role === 'FLW'){
      dispatch({type: 'UPDATE_CURRENTPAGE', payload: {data: 'universal-lesson-builder'}})
    }
  },[state.user.role])

  return (
    <h1>UNIVERSAL LESSON BUILDER PAGE</h1>
  )
}

export default UniversalLessonBuilder;