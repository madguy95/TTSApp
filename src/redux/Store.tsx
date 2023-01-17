import {createStore, combineReducers} from 'redux';
import reducer from '@root/redux/Reducer';
import {applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import logReducer from '@root/redux/LogReducer';

const rootReducer = combineReducers({
  reducer: reducer,
  logReducer: logReducer,
});

const configureStore = () => {
  return createStore(rootReducer, applyMiddleware(thunk));
};
export default configureStore;
