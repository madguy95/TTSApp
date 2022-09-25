import React, {useContext, useEffect, useState} from 'react';
import {ReferenceDataContext} from '../storage/ReferenceDataContext';
import {Api, ApiDefault, PlaylistItem} from '../model/api';
import {delay} from '../utils';
import {callApiGetMp3} from '../helper/APIService';

const MAX_LOAD_FILE_IN_TIME = 3;
const API_DELAY_TIME = 2000; // ms

export function DataBatch(props: {
  idSelected: number;
  playList: PlaylistItem[];
  setPlayList: any;
}) {
  const {data} = useContext(ReferenceDataContext);
  const [apiInfo, setApiInfo] = useState<Api>(ApiDefault);
  const [playList, setPlay] = useState(props.playList);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setApiInfo(data);
  }, [data]);

  useEffect(() => {
    setPlay(props.playList);
  }, [props.playList]);

  useEffect(() => {
    if (!Number.isNaN(props.idSelected) && !isLoading) {
      loadMp3();
    }
  }, [props.idSelected, playList, apiInfo, isLoading]);

  async function loadMp3() {
    let needLoadMore = false;
    let indexCurrent = 0;
    let arrPromise = new Array();
    let arrIndex = new Array();
    playList.forEach((item, index) => {
      if (item.id == props.idSelected) {
        needLoadMore = true;
      }
      // load truoc cac ban ghi tiep theo
      if (needLoadMore && indexCurrent < MAX_LOAD_FILE_IN_TIME - 1) {
        indexCurrent++;
        if (item.uri == null || item.uri == undefined || item.uri == '') {
          arrPromise.push(getMp3File(item.name, null, indexCurrent * 1000));
          arrIndex.push(index);
        }
      }
    });
    if (arrPromise.length > 0) {
      setLoading(true);
      Promise.all(arrPromise).then(values => {
        let isChange = false;
        values.forEach((id, index) => {
          if (id) {
            playList[arrIndex[index]].uri = apiInfo.urlAudio + '/' + id;
            isChange = true;
          } 
        });
        if (isChange) {
          setPlay(playList);
          props.setPlayList(playList);
        }
        setLoading(false);
      });
    }
  }

  const getMp3File = async (
    text: any,
    signal: any,
    timeNeedWait: any,
  ): Promise<any> => {
    return new Promise(resolveInner => {
      delay(timeNeedWait).then(() =>
        resolveInner(callApiGetMp3(text, signal, apiInfo)),
      );
    });
  };

  return <></>;
}
