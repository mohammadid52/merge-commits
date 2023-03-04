export const setUser = (dispatch: any, userInfo: any) =>
  dispatch({
    type: 'SET_USER',
    payload: {
      id: userInfo.id,
      email: userInfo.id,
      authId: userInfo.authId,
      firstName: userInfo.preferredName || userInfo.firstName,
      lastName: userInfo.lastName,
      language: userInfo.language,
      onBoardSurvey: userInfo.onBoardSurvey ? userInfo.onBoardSurvey : false,
      role: userInfo.role,
      image: userInfo.image,
      associateInstitute: userInfo.associateInstitute,
      onDemand: userInfo?.onDemand,
      lessons: userInfo.lessons,
      lastEmotionSubmission: userInfo?.lastEmotionSubmission,
      removedFrom: userInfo?.removedFrom,
      status: userInfo?.status,
      pageState: userInfo?.pageState,
      lastPageStateUpdate: userInfo?.lastPageStateUpdate
    }
  });
