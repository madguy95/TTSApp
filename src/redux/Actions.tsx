import { loadHtml } from '../helper/APIService';
import { getContentInHtml, getNextLinkInHtml, truncate } from '../utils';
import { CHANGE_WEB_INFO, NOTI_LOAD_NEW } from './ActionType';
import { URL } from 'react-native-url-polyfill';

const MAX_LENGTH_CHARACTER_TRUNC = 500;

export function loadNew(info: {
	currentURL: any;
	selector: any;
	nextSelector: any;
	limitSplit: any;
	nextURL: any;
	contentHTML: string;
	content: any;
	arrString: any[];
}) {
	return { type: NOTI_LOAD_NEW, payload: info };
}

export function loadNewData(currentURL: string | undefined, selector: string, nextSelector: string, limitSplit: any) {
	return async (dispatch: (arg0: { type: string; payload: any }) => any) => {
		if (currentURL && selector) {
			const html = await loadHtml(currentURL);
			const content = getContentInHtml(html, selector);
			let nextURL = getNextLinkInHtml(html, nextSelector);
			let domain = new URL(currentURL);
			if (nextURL && !nextURL.includes('http')) {
				nextURL = domain.protocol + '//' + domain.hostname + nextURL;
			}
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

export function updateWebInfo(info: any) {
	return { type: CHANGE_WEB_INFO, payload: { ...info } };
}
