import { CurricularStateType, curricularState } from '../state/CurricularState';

export type CurricularActions =
  | {
    type: 'SET_INITIAL_STATE';
    payload: {
      learningObjectives: any;
      topics: any;
    };
  }
  | {
    type: 'SET_LEARNING_OBJECTIVES';
    payload: any;
  }
  | {
    type: 'SET_TOPICS';
    payload: any;
  }
  | {
    type: 'ADD_TOPIC';
    payload: any;
  }
  | {
    type: 'ADD_LEARNING_OBJECTIVES';
    payload: any;
  }
  | {
    type: 'CLEANUP';
  };

export const curricularReducer = (state: CurricularStateType, action: CurricularActions) => {
  switch (action.type) {
    case 'SET_INITIAL_STATE':
      return {
        ...state,
        learningObjectives: action.payload.learningObjectives,
        topics: action.payload.topics,
      };
    case 'SET_LEARNING_OBJECTIVES':
      console.log('here', action.payload)
      return {
        ...state,
        learningObjectives: action.payload.learningObjectives
      };
    case 'SET_TOPICS':
      return {
        ...state,
        topics: action.payload
      };
    case 'ADD_TOPIC':
      return {
        ...state,
        topics: [...state.topics, action.payload],
      };
    case 'ADD_LEARNING_OBJECTIVES':
      return {
        ...state,
        learningObjectives: [...state.learningObjectives, action.payload.item],
      };
    case 'CLEANUP':
      return curricularState;
    default:
      return state;
  }
};
