import React, {useContext, useEffect, useState} from 'react';
import {ReferenceDataContext} from '../storage/ReferenceDataContext';
import {Api, PlaylistItem} from '../model/api';
import {delay} from '../utils';
import {callApiGetMp3, downloadFile} from '../helper/APIService';
import {ApiDefault} from './setting-profile/config';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {addLog} from '../redux/Actions';

const MAX_LOAD_FILE_IN_TIME = 3;
const API_DELAY_TIME = 2000; // ms

function DataBatch(props: {
  playList?: any;
  idSelected?: any;
  setPlayList?: any;
  actions?: any;
}) {
  const {data} = useContext(ReferenceDataContext);
  const {actions} = props;
  const [playList, setPlay] = useState(props.playList);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setPlay(props.playList);
  }, [props.playList]);

  useEffect(() => {
    setLoading(false);
  }, [props.idSelected, playList, data]);

  useEffect(() => {
    if (!Number.isNaN(props.idSelected) && !isLoading) {
      loadMp3();
    }
  }, [props.idSelected, playList, data, isLoading]);

  async function loadMp3() {
    console.log("load Mp3")
    setLoading(true);
    let needLoadMore = false;
    let indexCurrent = 0;
    let arrPromise = new Array();
    let arrIndex = new Array();
    playList.forEach((item, index) => {
      if (item.id == props.idSelected) {
        needLoadMore = true;
      }
      // load truoc cac ban ghi tiep theo
      if (
        needLoadMore &&
        indexCurrent < MAX_LOAD_FILE_IN_TIME - 1 &&
        // load TTS synchonozied , by reason rn-fetch-blob have issue with 
        // downloading parallel mutil files
        arrPromise.length < 1
      ) {
        indexCurrent++;
        if (item.uri == null || item.uri == undefined || item.uri == '') {
          arrPromise.push(getMp3File(item.name, index, indexCurrent * 1000));
          arrIndex.push(index);
        }
      }
    });
    if (arrPromise.length > 0) {
      Promise.all(arrPromise).then(values => {
        console.log('get done url')
        let isChange = false;
        values.forEach((id, index) => {
          if (id?.success) {
            if (data.code === ApiDefault.code) {
              playList[arrIndex[index]].uri = data.urlAudio + '/' + id.id;
            } else {
              playList[arrIndex[index]].uri = id.id;
            }
            isChange = true;
          } else {
            actions?.addLog(id?.message);
          }
        });
        if (isChange) {
          console.log('call update url')
          setPlay(playList);
          props.setPlayList(playList);
          setLoading(false);
        }
      });
    } else {
      setLoading(false);
    }
  }

  const getMp3File = (
    text: any,
    signal: any,
    timeNeedWait: any,
  ): Promise<any> => {
    console.log('call getmp3')
    return new Promise(resolveInner => {
      delay(timeNeedWait).then(() => {
        if (data.code === ApiDefault.code) {
          resolveInner(callApiGetMp3(text, signal, data));
        } else {
          resolveInner(downloadFile(text, signal, data));
        }
      });
    });
  };

  return <></>;
}

const mapStateToProps = state => ({
  errors: state.logReducer.errors,
});
const ActionCreators = Object.assign({}, {addLog});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(DataBatch);
