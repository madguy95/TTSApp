import {createStore, combineReducers} from 'redux';
import reducer from './Reducer';
import {applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import logReducer from './LogReducer';

const rootReducer = combineReducers({
  reducer: reducer,
  logReducer: logReducer,
});

const configureStore = () => {
  return createStore(rootReducer, applyMiddleware(thunk));
};
export default configureStore;
