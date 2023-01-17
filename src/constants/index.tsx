import {ICON_LOOP_ALL_BUTTON, ICON_LOOP_ONE_BUTTON} from '@root/constants/Icon';
import {PlaylistItem} from '@root/model/api';

export const PlAYLIST = [
  new PlaylistItem(
    0,
    'Comfort Fit - “Sorry”',
    'https://s3.amazonaws.com/exp-us-standard/audio/playlist-example/Comfort_Fit_-_03_-_Sorry.mp3',
    false,
  ),
  new PlaylistItem(
    1,
    'Mildred Bailey – “All Of Me”',
    'https://ia800304.us.archive.org/34/items/PaulWhitemanwithMildredBailey/PaulWhitemanwithMildredBailey-AllofMe.mp3',
    false,
  ),
  new PlaylistItem(
    2,
    'Podington Bear - “Rubber Robot”',
    'https://s3.amazonaws.com/exp-us-standard/audio/playlist-example/Podington_Bear_-_Rubber_Robot.mp3',
    false,
  ),
];

export const LOADING_STRING = '... loading ...';
export const LOOPING_TYPE_ALL = 0;
export const LOOPING_TYPE_ONE = 1;
export const LOOPING_TYPE_ICONS = {
  0: ICON_LOOP_ALL_BUTTON,
  1: ICON_LOOP_ONE_BUTTON,
};
export const RATE_SCALE = 3.0;

import { Api } from '@root/model/api';

// {
//   "Language":"vi-VN",
//   "Voice":"vi-VN-Standard-A",
//   "TextMessage":"${textsearch}",
//   "type":0
// }
export const ApiDefault: Api = {
  id: 0,
  code: 'FreeTTS',
  url: 'https://freetts.com/Home/PlayAudio',
  urlAudio: 'https://freetts.com/audio',
  queryString: JSON.stringify({
    Language: 'vi-VN',
    Voice: 'vi-VN-Standard-A',
    TextMessage: '${textsearch}',
    type: 0,
  }),
  body: '',
  method: 'POST',
  content: [],
  token: '',
  tokens: [],
  header: JSON.stringify({
    'Content-Type': 'application/json',
    token: '',
  }),
};

// {
//     "text": "${textsearch}",
//     "voice": "hn-quynhanh",
//     "id": "2",
//     "without_filter": false,
//     "speed": 1.0,
//     "tts_return_option": 2
// }
export const ApiViettelDefault: Api = {
  id: 0,
  code: 'Viettel',
  url: 'https://viettelgroup.ai/voice/api/tts/v1/rest/syn',
  queryString: '',
  header: JSON.stringify({
    'Content-Type': 'application/json',
    token: '${token}',
  }),
  body: JSON.stringify({
    text: '${textsearch}',
    voice: 'hn-quynhanh',
    id: '2',
    without_filter: false,
    speed: 1.0,
    tts_return_option: 2,
  }),
  method: 'POST',
  content: [],
  token: '',
  tokens: [],
  urlAudio: ''
};

export const CONFIG_LIST = [
  {
    code: ApiViettelDefault.code,
    config: ApiViettelDefault,
  },
  {
    code: ApiDefault.code,
    config: ApiDefault,
  },
];

export const MAX_LOAD_FILE_IN_TIME = 2;
