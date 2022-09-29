import React, {useContext, useEffect, useState} from 'react';
import {ReferenceDataContext} from '../storage/ReferenceDataContext';
import {Api, PlaylistItem} from '../model/api';
import {delay} from '../utils';
import {callApiGetMp3, downloadFile} from '../helper/APIService';
import { ApiDefault } from './setting-profile/config';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addLog } from '../redux/Actions';

const MAX_LOAD_FILE_IN_TIME = 3;
const API_DELAY_TIME = 2000; // ms

function DataBatch(props: { playList?: any; idSelected?: any; setPlayList?: any; actions?: any; }) {
  const {data} = useContext(ReferenceDataContext);
  const {actions} = props
  const [playList, setPlay] = useState(props.playList);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setPlay(props.playList);
  }, [props.playList]);

  useEffect(() => {
    if (!Number.isNaN(props.idSelected) && !isLoading) {
      loadMp3();
    }
  }, [props.idSelected, playList, data, isLoading]);

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
          arrPromise.push(getMp3File(item.name, index, indexCurrent * 1000));
          arrIndex.push(index);
        }
      }
    });
    if (arrPromise.length > 0) {
      setLoading(true);
      Promise.all(arrPromise).then(values => {
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
      delay(timeNeedWait).then(() => {
        if (data.code === ApiDefault.code) {
          resolveInner(callApiGetMp3(text, signal, data));
        } else {
          resolveInner(downloadFile(text,signal, data));
        }
      });
    });
  };

  return <></>;
}

const mapStateToProps = (state) => ({
  errors: state.logReducer.errors
});
const ActionCreators = Object.assign({}, {addLog});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(DataBatch);