import {delay, objToQueryString} from '../utils';
import {Api} from '../model/api';
import RNFetchBlob from 'rn-fetch-blob';

export async function callApiGetMp3(
  text: string,
  signal: any,
  apiInfo: Api,
): Promise<any> {
  try {
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
      signal: signal,
    })
      .then(async response => {
        const json = await response.json();
        console.log(json);
        if (json.id !== undefined) {
          return json.id;
        }
        return;
      })
      .catch(err => console.log(err));
  } catch (error) {
    console.log(error);
  }
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
  signal: string,
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
  const res = await RNFetchBlob.config({
    path: RNFetchBlob.fs.dirs.DocumentDir + '/userdata/' + signal + '.wav',
    session: 'tmp_file',
    fileCache: true,
    appendExt: 'wav',
  }).fetch(apiInfo.method, apiInfo.url, header, bodyStr);
  return res.path();
}

export async function cleanTmpFileCache() {
  // list paths of a session
  // console.log(RNFetchBlob.session('tmp_file').list());
  let files: any[] = [];
  if (
    await RNFetchBlob.fs.exists(RNFetchBlob.fs.dirs.DocumentDir + '/userdata')
  ) {
    RNFetchBlob.fs
      .exists(RNFetchBlob.fs.dirs.DocumentDir + '/userdata')
      // files will an array contains filenames
      .then((files: any) => {
        files = files;
      });
    files.forEach(item =>
      RNFetchBlob.session('tmp_file').add(
        RNFetchBlob.fs.dirs.DocumentDir + '/' + item,
      ),
    );
    console.log(files);
  }
  // remove all files in a session
  RNFetchBlob.session('tmp_file')
    .dispose()
    .then(() => {
      console.log('cleaned cache');
    });
}
