import {ADD_LOG} from '@root/redux/ActionType';

const initState = {
  errors: [],
};

const logReducer = (state = initState, action: {type: any; payload: any}) => {
  switch (action.type) {
    case ADD_LOG:
      const clone: Array<any> = [...state.errors];
      if (
        clone.unshift({
          date: new Date().toLocaleTimeString(),
          message: action.payload,
        }) > 5
      ) {
        clone.pop();
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
