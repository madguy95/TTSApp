import {delay, objToQueryString} from '../utils';
import {Api} from '../model/api';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {Platform} from 'react-native';
import _ from 'lodash';

const HTTP_STRING = {
  '200': 'OK',
  '201': 'Created',
  '202': 'Accepted',
  '203': 'Non-Authoritative Information',
  '204': 'No Content',
  '205': 'Reset Content',
  '206': 'Partial Content',
  '300': 'Multiple Choices',
  '301': 'Moved Permanently',
  '302': 'Found',
  '303': 'See Other',
  '304': 'Not Modified',
  '305': 'Use Proxy',
  '306': 'Unused',
  '307': 'Temporary Redirect',
  '400': 'Bad Request',
  '401': 'Unauthorized',
  '402': 'Payment Required',
  '403': 'Forbidden',
  '404': 'Not Found',
  '405': 'Method Not Allowed',
  '406': 'Not Acceptable',
  '407': 'Proxy Authentication Required',
  '408': 'Request Timeout',
  '409': 'Conflict',
  '410': 'Gone',
  '411': 'Length Required',
  '412': 'Precondition Required',
  '413': 'Request Entry Too Large',
  '414': 'Request-URI Too Long',
  '415': 'Unsupported Media Type',
  '416': 'Requested Range Not Satisfiable',
  '417': 'Expectation Failed',
  '418': "I'm a teapot",
  '429': 'Too Many Requests',
  '500': 'Internal Server Error',
  '501': 'Not Implemented',
  '502': 'Bad Gateway',
  '503': 'Service Unavailable',
  '504': 'Gateway Timeout',
  '505': 'HTTP Version Not Supported',
};

export function appendValueToKey(key, value, obj, ...fields) {
  fields.forEach(field => {
    if (obj[field] && _.isString(obj[field])) {
      obj[field] = obj[field].replace(key, value);
    }
  });
}
export async function callApiGetMp3(
  text: string,
  signal: any,
  apiInfo: Api,
): Promise<any> {
  const queryString = apiInfo.queryString
    ? objToQueryString(
        JSON.parse(
          apiInfo.queryString
            .replace(/(\r\n|\n|\r)/gm, '')
            .replace('${textsearch}', text.replace(/['"]+/g, '')),
        ),
      )
    : '';
  const bodyStr = apiInfo.body
    ? JSON.parse(
        apiInfo.body
          .replace(/(\r\n|\n|\r)/gm, '')
          .replace('${textsearch}', text.replace(/['"]+/g, '')),
      )
    : {};
  console.log('call api fetch');
  return fetch(`${apiInfo.url}?${queryString}`, {
    method: apiInfo.method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: bodyStr,
    // signal: signal,
  })
    .then(async response => {
      if (!response.ok) {
        const error = {
          status: response.status,
          statusText: response.statusText || HTTP_STRING[response.status],
        };
        return {
          success: false,
          message: error,
        };
      }
      const json = await response.json();
      if (json.id !== undefined) {
        return {
          success: true,
          id: json.id,
        };
      }
      return {
        success: false,
        message: json,
      };
    })
    .catch(err => {
      return {success: false, message: err};
    });
}

export async function loadHtml(linkCurrent?: string): Promise<string> {
  if (!linkCurrent) {
    return '';
  }
  const response = await fetch(linkCurrent);
  const text = await response.text();
  return text;
}

const FOLDER_FILE =
  Platform.OS === 'ios'
    ? ReactNativeBlobUtil.fs.dirs.DocumentDir
    : ReactNativeBlobUtil.fs.dirs.DownloadDir;

export async function downloadFile(
  text: string,
  id: string,
  apiInfo: {
    token: string;body: string; header: string; method: string; url: string
},
) {
  // console.log(RNFetchBlob.fs.dirs.DocumentDir);
  const bodyStr = apiInfo.body
    ? apiInfo.body
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace('${textsearch}', text.replace(/['"]+/g, ''))
    : '';
    
  if (apiInfo.header?.includes("${token}") && apiInfo.token) {
    apiInfo.header = apiInfo.header.replace('${token}', apiInfo.token);
  }
  const header = JSON.parse(apiInfo.header) || {
    //headers...
    'Content-Type': 'application/json',
    token: '',
  };
  console.log(header);
  let ext = 'mp3';
  const body = JSON.parse(apiInfo.body);
  if (body?.tts_return_option == 2) {
    ext = 'wav';
  }
  // removeFileIfExist(FOLDER_FILE + '/' + id + '.' + ext);
  const res = await ReactNativeBlobUtil.config({
    path: FOLDER_FILE + '/' + id + '.' + ext,
  }).fetch(apiInfo.method, apiInfo.url, header, bodyStr);
  if (res.info().status !== 200) {
    removeFileIfExist(res.path());
    return {success: false, message: res.json()};
  }
  return {success: true, id: res.path()};
}

export async function removeFileIfExist(path) {
  if (await ReactNativeBlobUtil.fs.exists(path)) {
    await ReactNativeBlobUtil.fs.unlink(path);
    console.log('deleted {}', path);
  }
}

export async function cleanTmpFileCache() {
  // list paths of a session
  if (await ReactNativeBlobUtil.fs.exists(FOLDER_FILE)) {
    ReactNativeBlobUtil.fs
      .ls(FOLDER_FILE)
      // files will an array contains filenames
      .then((files: any) => {
        files.forEach(item =>
          ReactNativeBlobUtil.fs.unlink(FOLDER_FILE + '/' + item),
        );
      });
    // console.log(filesArr);
  }
}
