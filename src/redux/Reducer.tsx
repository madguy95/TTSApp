import {CHANGE_WEB_INFO, NOTI_LOAD_NEW} from './ActionType';

const initState = {
  currentURL: 'https://truyenfull.vn/than-dao-dan-ton-606028/chuong-1/',
  nextURL: '',
  selector: '#chapter-c',
  nextSelector: '#next_chap',
  contentHTML: '',
  content: '',
  limitSplit: 500,
  arrString: [],
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case NOTI_LOAD_NEW:
      return {
        ...state,
        ...action.payload,
      };
    case CHANGE_WEB_INFO:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
