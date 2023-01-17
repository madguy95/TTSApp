import React, {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import {AnyAction, bindActionCreators, Dispatch} from 'redux';
import {cleanTmpFileCache} from '@root/helper/APIService';
import {loadNew, loadNewData, updateWebInfo} from '@root/redux/Actions';

function Cacher(props: {
  actions?: any;
  selector?: any;
  nextSelector?: any;
  limitSplit?: any;
  currentURL?: any;
  loadedConfig?: any;
}) {
  const {selector, nextSelector, limitSplit, currentURL, loadedConfig} = props;

  useEffect(() => {
    loadHistory();
    cleanTmpFileCache();
    return () => {
      saveHistory();
    };
  }, []);

  useEffect(() => {
    if (loadedConfig) {
      saveHistory();
    }
  }, [selector, nextSelector, limitSplit, currentURL, loadedConfig]);

  function updateWeb(obj: any) {
    props.actions.updateWebInfo({
      selector,
      nextSelector,
      limitSplit,
      currentURL,
      ...obj,
    });
  }

  async function loadHistory() {
    try {
      const dataConfig = await AsyncStorage.getItem('data_config');
      const config = JSON.parse(dataConfig || '');
      const copyConfig = Object.assign({loadedConfig: true}, config);
      updateWeb({...copyConfig});
      // console.log(
      //   '[CacheHandler] loading config : ' + JSON.stringify(copyConfig),
      // );
    } catch (e) {
      console.log('[CacheHandler] loadHistory: ' + e);
    }
  }

  async function saveHistory() {
    try {
      const config = {
        selector,
        nextSelector,
        limitSplit,
        currentURL,
      };
      await AsyncStorage.setItem('data_config', JSON.stringify(config));
      // console.log('[CacheHandler] Saving config: ' + JSON.stringify(config));
    } catch (e) {
      console.log('[CacheHandler] saveHistory: ' + e);
    }
  }

  return <></>;
}

const mapStateToProps = (state: {
  reducer: {
    selector: any;
    nextSelector: any;
    limitSplit: any;
    nextURL: any;
    currentURL: any;
    loadedConfig: any;
  };
}) => ({
  selector: state.reducer.selector,
  nextSelector: state.reducer.nextSelector,
  limitSplit: state.reducer.limitSplit,
  nextURL: state.reducer.nextURL,
  currentURL: state.reducer.currentURL,
  loadedConfig: state.reducer.loadedConfig,
});

const ActionCreators = Object.assign({}, {loadNew, loadNewData, updateWebInfo});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Cacher);
