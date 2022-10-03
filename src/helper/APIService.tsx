import {delay, objToQueryString} from '../utils';
import {Api} from '../model/api';
import ReactNativeBlobUtil from 'react-native-blob-util'
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
  '418': 'I\'m a teapot',
  '429': 'Too Many Requests',
  '500': 'Internal Server Error',
  '501': 'Not Implemented',
  '502': 'Bad Gateway',
  '503': 'Service Unavailable',
  '504': 'Gateway Timeout',
  '505': 'HTTP Version Not Supported',
};
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
      if(!response.ok) {
        const error =  {
          status: response.status,
          statusText: response.statusText || HTTP_STRING[response.status],
        }
        return {
          success: false,
          message: error,
        }
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

export async function downloadFile(
  text: string,
  id: string,
  apiInfo: {body: string; header: string; method: string; url: string},
) {
  // console.log(RNFetchBlob.fs.dirs.DocumentDir);
  const bodyStr = apiInfo.body
    ? apiInfo.body
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace('${textsearch}', text.replace(/['"]+/g, ''))
    : '';
  const header = JSON.parse(apiInfo.header) || {
    //headers...
    'Content-Type': 'application/json',
    token: '',
  };
  let ext = 'mp3';
  const body = JSON.parse(apiInfo.body);
  if (body?.tts_return_option == 2) {
    ext = 'wav';
  }
  const res = await ReactNativeBlobUtil.config({
    path: ReactNativeBlobUtil.fs.dirs.CacheDir + '/userdata/' + id + '.' + ext,
    session: 'tmp_file',
    fileCache: true,
    appendExt: ext,
  }).fetch(apiInfo.method, apiInfo.url, header, bodyStr);
  return {success: true, id: res.path()};
}

export async function cleanTmpFileCache() {
  // list paths of a session
  // console.log(RNFetchBlob.session('tmp_file').list());
  let files: any[] = [];
  if (
    await ReactNativeBlobUtil.fs.exists(ReactNativeBlobUtil.fs.dirs.CacheDir + '/userdata')
  ) {
    ReactNativeBlobUtil.fs
      .exists(ReactNativeBlobUtil.fs.dirs.CacheDir + '/userdata')
      // files will an array contains filenames
      .then((files: any) => {
        files = files;
      });
    files.forEach(item =>
      ReactNativeBlobUtil.session('tmp_file').add(
        ReactNativeBlobUtil.fs.dirs.CacheDir + '/' + item,
      ),
    );
    console.log(files);
  }
  // remove all files in a session
  ReactNativeBlobUtil.session('tmp_file')
    .dispose()
    .then(() => {
      console.log('cleaned cache');
    });
}
