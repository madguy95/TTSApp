import ConfigAPI from './ConfigAPI';

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
    token: '',
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
