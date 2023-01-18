import React, {useContext, useEffect, useState} from 'react';
import {AnyAction, bindActionCreators, Dispatch} from 'redux';
import {connect} from 'react-redux';
import {ReferenceDataContext} from '@root/storage/ReferenceDataContext';
import {processResult, tranferTTS} from '@root/helper/APIService';
import {addLog} from '@root/redux/Actions';
import { MAX_LOAD_FILE_IN_TIME } from '@root/constants';

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
    console.log('load Mp3');
    setLoading(true);
    let needLoadMore = false;
    let indexCurrent = 0;
    let arrPromise = new Array();
    let arrIndex = new Array();
    playList.forEach(
      (
        item: {id: any; uri: string | null | undefined; name: any},
        index: any,
      ) => {
        if (item.id == props.idSelected) {
          needLoadMore = true;
        }
        // load truoc cac ban ghi tiep theo
        if (
          needLoadMore &&
          indexCurrent < MAX_LOAD_FILE_IN_TIME &&
          // load TTS synchonozied , by reason rn-fetch-blob have issue with
          // downloading parallel mutil files
          arrPromise.length < 1
        ) {
          if (item.uri == null || item.uri == undefined || item.uri == '' || item.uri == 'errorsound.mp3') {
            arrPromise.push(tranferTTS(data, item.name, index, indexCurrent * 1000));
            arrIndex.push(index);
          }
          indexCurrent++;
        }
      },
    );
    if (arrPromise.length > 0) {
      Promise.all(arrPromise).then(values => {
        console.log('get done url');
        let isChange = false;
        values.forEach((res, index) => {
          if (res?.success) {
            playList[arrIndex[index]].uri = processResult(data, res);
            isChange = true;
          } else {
            playList[arrIndex[index]].uri = 'errorsound.mp3';
            actions?.addLog(res?.message);
            props.setPlayList(playList);
          }
        });
        if (isChange) {
          console.log('call update url');
          setPlay(playList);
          props.setPlayList(playList);
          setLoading(false);
        }
      });
    } else {
      setLoading(false);
    }
  }

  return <></>;
}

const mapStateToProps = (state: {logReducer: {errors: any}}) => ({
  errors: state.logReducer.errors,
});
const ActionCreators = Object.assign({}, {addLog});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(DataBatch);
