import React, {useContext, useEffect, useState} from 'react';
import {
  Button,
  Flex,
  FormControl,
  Input,
  Stack,
  TextArea,
  ScrollView,
  HStack,
} from 'native-base';
import {Platform} from 'react-native';
import {StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import {Text, View} from '../components/Themed';
import {useRef} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {loadNew, loadNewData, updateWebInfo} from '../redux/Actions';
import {connect, useSelector} from 'react-redux';
import {bindActionCreators} from 'redux';

function DataRaw(props) {
  const {content} = props;
  const {selector, nextSelector, limitSplit, nextURL, currentURL} = props;
  const [inputURL, setInputURl] = React.useState(currentURL);
  const gridIframe = useRef<HTMLIFrameElement>(null);

  const webViewRef = useRef<any>(null);

  useEffect(() => {
    loadHistory();
    console.log('load 1 time')
  }, []);

  function updateWeb(obj) {
    props.actions.updateWebInfo({
      selector,
      nextSelector,
      limitSplit,
      nextURL,
      currentURL,
      ...obj,
    });
  }

  async function loadHistory() {
    try {
      const uriC = await AsyncStorage.getItem('uriweb');
      let obj = {}
      if (uriC) {
        obj.currentURL = uriC;
      }
      const selectorC = await AsyncStorage.getItem('selector');
      if (selectorC) {
        obj.selector = selectorC;
      }
      updateWeb({...obj});
      console.log('loading' + uriC + ' ' + selectorC);
    } catch (e) {
      console.log('saving error: ' + e);
    }
  }

  async function saveHistory() {
    try {
      if (currentURL) {
        await AsyncStorage.setItem('uriweb', currentURL);
      }
      if (selector) {
        await AsyncStorage.setItem('selector', selector);
      }
      console.log('Saving' + currentURL + ' ' + selector);
    } catch (e) {
      console.log('saving error: ' + e);
    }
  }

  const onClickLoad = () => {
    props.actions.loadNewData(currentURL, selector, nextSelector, limitSplit);
    saveHistory();
  };
  const goback = () => {
    webViewRef.current.goBack();
  };

  const goForward = () => {
    webViewRef.current.goForward();
  };

  const reload = () => {
    webViewRef.current.reload();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          // overflowY: "scroll",
        }}>
        <View style={styles.subContainer}>
          <Stack mx="4">
            {/* <HStack space={3} alignItems="center"> */}
            <Flex
              flexWrap="wrap"
              // flexWrap={'wrap'}
              mb="2.5"
              mt="1.5"
              _text={{
                color: 'coolGray.800',
              }}>
              <Text>Query selector {props.needLoad ? 'true' : 'false'}</Text>
              <Input
                type="text"
                value={selector}
                onChangeText={value => updateWeb({selector: value})}
                placeholder="css selector get content"
              />
              <Input
                type="text"
                value={nextSelector}
                onChangeText={nextSelector => updateWeb({nextSelector: value})}
                placeholder="css selector get href next link"
              />
              <Text>Max length</Text>
              <Input
                keyboardType="numeric"
                type="text"
                value={limitSplit.toString()}
                onChangeText={value => updateWeb({limitSplit: parseInt(value)})}
                placeholder="limit string length to split"
              />
            </Flex>
            {/* </HStack> */}
          </Stack>
          <Stack mx="4">
            <Flex
              direction="row"
              mb="2.5"
              mt="1.5"
              _text={{
                color: 'coolGray.800',
              }}>
              <Button onPress={() => onClickLoad()}>
                <Ionicons name={'reload-circle'} size={15}>
                  Load
                </Ionicons>
              </Button>
              <TextArea
                readonly
                h={20}
                placeholder="Text Area Placeholder"
                w={{
                  base: '100%',
                }}
                value={content}
                autoCompleteType={undefined}
              />
            </Flex>
          </Stack>
          <Stack mx="4"></Stack>
          <Stack mx="4">
            <Text>Trang web url</Text>
            <Input
              type="text"
              value={inputURL}
              onChangeText={value => setInputURl(value)}
              onSubmitEditing={event => {
                updateWeb({currentURL: inputURL});
              }}
              placeholder="Current url load web"
            />
            <Input
              readonly
              type="text"
              value={nextURL}
              placeholder="Next url: can be empty"
            />
          </Stack>
        </View>
        {Platform.OS === 'web' ? (
          <iframe
            id="iframe"
            ref={gridIframe}
            src={currentURL}
            height={'100%'}
            width={'100%'}
          />
        ) : (
          <View style={styles.webview}>
            <View style={styles.subContainer}>
              <Flex
                direction="row"
                ml="5"
                // mb="2.5"
                // mt="1.5"
                _text={{
                  color: 'coolGray.800',
                }}>
                <Ionicons
                  name={'arrow-back-outline'}
                  size={40}
                  color="grey"
                  onPress={goback}
                />
                <Ionicons
                  name={'arrow-forward-outline'}
                  size={40}
                  color="grey"
                  onPress={goForward}
                />
                <Ionicons
                  name={'refresh-outline'}
                  size={35}
                  color="grey"
                  onPress={reload}
                />
              </Flex>
            </View>
            <WebView
              ref={webViewRef}
              source={{uri: currentURL}}
              style={{
                marginTop: 22,
                flex: 1,
                margin: 'auto',
                // width: 200,
                // height: 200,
              }}
              allowsFullscreenVideo={false}
              onNavigationStateChange={({url, canGoBack}) => {
                setInputURl(url)
              }}
              // scrollEnabled={false}
              useWebKit={true}
              originWhitelist={['*']}
              allowsInlineMediaPlayback={true}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const mapStateToProps = state => ({
  needLoad: state.reducer.needLoad,
  content: state.reducer.content,
  selector: state.reducer.selector,
  nextSelector: state.reducer.nextSelector,
  limitSplit: state.reducer.limitSplit,
  nextURL: state.reducer.nextURL,
  currentURL: state.reducer.currentURL,
});

const ActionCreators = Object.assign({}, {loadNew, loadNewData, updateWebInfo});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(DataRaw);

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF8ED',
  },
  subContainer: {
    // flex: 1,
    // width: '100%',
    // height: 800,
    backgroundColor: '#FFF8ED',
  },
  webview: {
    display: 'flex',
    width: '100%',
    height: 800,
    backgroundColor: '#FFF8ED',
  },
  view: {
    display: 'flex',
    width: '100%',
    height: '100%',
    backgroundColor: '#FFF8ED',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
