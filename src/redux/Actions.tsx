import {loadHtml} from '../helper/APIService';
import {getContentInHtml, getNextLinkInHtml, truncate} from '../utils';
import {CHANGE_WEB_INFO, NOTI_LOAD_NEW} from './ActionType';
import { URL, URLSearchParams } from 'react-native-url-polyfill';

const MAX_LENGTH_CHARACTER_TRUNC = 500;

export function loadNew(info) {
  return {type: NOTI_LOAD_NEW, payload: info};
}

export function loadNewData(currentURL, selector, nextSelector, limitSplit) {
  return async dispatch => {
    if (currentURL && selector) {
      console.log(currentURL)
      const html = await loadHtml(currentURL);
      const content = getContentInHtml(html, selector);
      let nextURL = getNextLinkInHtml(html, nextSelector);
      let domain = new URL(currentURL);
      if (nextURL && !nextURL.includes('http')) {
        nextURL = domain.protocol + '//' + domain.hostname + nextURL;
      }
      console.log(nextURL)
      if (content && content != '') {
        const arrStr = new Array();
        truncate(content, arrStr, limitSplit || MAX_LENGTH_CHARACTER_TRUNC);
        await dispatch(
          loadNew({
            currentURL: currentURL,
            selector: selector,
            nextSelector: nextSelector,
            limitSplit: limitSplit,
            nextURL: nextURL,
            contentHTML: html,
            content: content,
            arrString: arrStr,
          }),
        );
      }
    }
  };
}

export function updateWebInfo(info) {
  return {type: CHANGE_WEB_INFO, payload: {...info}};
}
