import {ADD_LOG} from './ActionType';

const initState = {
  errors: [],
};

const logReducer = (state = initState, action: { type: any; payload: any; }) => {
  switch (action.type) {
    case ADD_LOG:
      const clone = [...state.errors]
      if(clone.unshift(action.payload) > 5) {
        clone.pop()
      }
      return {
        ...state,
        errors: clone,
      };
    default:
      return state;
  }
};

export default logReducer;
