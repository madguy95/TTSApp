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
import {getContentInHtml, truncate} from '../utils';
import {loadHtml} from '../helper/APIService';
import {ReferenceDataContext} from '../storage/ReferenceDataContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const DEFAULT_PAGE = "https://reactjs.org/";
const DEFAULT_PAGE = 'https://truyenfull.vn/than-dao-dan-ton-606028/chuong-1/';
// const CSS_SELECTOR = "#js-read__content";
const CSS_SELECTOR = '#chapter-c';
const MAX_LENGTH_CHARACTER_TRUNC = 500;
export default function DataRaw() {
  const {data, setData} = useContext(ReferenceDataContext);

  const [inputURL, setInputURl] = React.useState(DEFAULT_PAGE);
  const [info, setInfo] = React.useState(DEFAULT_PAGE);

  const [limitSplit, setLimitSplit] = React.useState(
    MAX_LENGTH_CHARACTER_TRUNC,
  );
  const [remoteData, setRemoteData] = React.useState();
  const [selector, setSelector] = React.useState(CSS_SELECTOR);

  const gridIframe = useRef<HTMLIFrameElement>(null);
  const [iframeItem, setIframeItem] = React.useState<any>();

  const webViewRef = useRef<any>(null);
  // const [html, setHtml] = React.useState<any>("<p>Here I am</p>");

  const handleIframe = () => {
    // const url = gridIframe.current.contentWindow.location.href;
    // if (gridIframe) {
    //   setIframeItem(gridIframe?.current);
    //   var y = (gridIframe?.current.contentWindow || gridIframe?.current.contentDocument);
    //   console.log(y.location.href)
    // }
  };

  useEffect(() => {
    loadHistory();
    return () => {
      saveHistory()
    }
  }, []);

  async function loadHistory() {
    try {
      const uriC = await AsyncStorage.getItem('uriweb');
      if (uriC) {
        setInputURl(uriC);
        setInfo(uriC);
      }
      const selectorC = await AsyncStorage.getItem('selector');
      if (selectorC) {
        setSelector(selectorC);
      }
      console.log('loading' + uriC + " " + selectorC);
    } catch (e) {
      console.log('saving error: ' + e);
    }
  }

  async function saveHistory() {
    try {
      if (inputURL) {
        await AsyncStorage.setItem('uriweb', inputURL);
      }
      if (selector) {
        await AsyncStorage.setItem('selector', selector);
      }
      console.log('Saving' + inputURL + " " + selector);
    } catch (e) {
      console.log('saving error: ' + e);
    }
  }
  
  useEffect(() => {
    if (iframeItem) {
      let arrStr = new Array();
      var y = iframeItem.contentWindow || iframeItem.contentDocument;
      console.log(y);
      // truncate(iframeItem.contentWindow.document.getElementById('#chapter-c'), arrStr, 200)
    }
  }, [iframeItem]);

  async function load() {
    // console.log(inputURL + selector);
    if (inputURL && selector) {
      loadHtml(inputURL).then(html => {
        const content = getContentInHtml(html, selector);
        if (content && content != '') {
          setRemoteData(content);
          const arrStr = new Array();
          truncate(content, arrStr, limitSplit || MAX_LENGTH_CHARACTER_TRUNC);
          setData({...data, content: arrStr});
          saveHistory();
        }
      });
    }
  }

  const goback = () => {
    webViewRef.current.goBack();
  };

  const goForward = () => {
    webViewRef.current.goForward();
  };

  const reload = () => {
    setInfo(inputURL);
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
              <Text>Query selector</Text>
              <Input
                type="text"
                value={selector}
                onChangeText={value => setSelector(value)}
                placeholder="text"
              />
              <Text>Max length</Text>
              <Input
                keyboardType="numeric"
                type="text"
                value={limitSplit.toString()}
                onChangeText={value => setLimitSplit(parseInt(value))}
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
              <Button onPress={() => load()}>
                <Ionicons name={'reload-circle'} size={15}>
                  Load
                </Ionicons>
              </Button>
              <TextArea
                h={20}
                placeholder="Text Area Placeholder"
                w={{
                  base: '100%',
                }}
                value={remoteData}
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
              onChangeText={inputURL => setInputURl(inputURL)}
              onSubmitEditing={event => {
                setInfo(inputURL);
                // setHtml(loadHtml(inputURL));
              }}
              placeholder="text"
            />
          </Stack>
        </View>
        {Platform.OS === 'web' ? (
          <iframe
            id="iframe"
            ref={gridIframe}
            onLoad={handleIframe}
            src={info}
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
              source={{uri: info}}
              style={{
                marginTop: 22,
                flex: 1,
                margin: 'auto',
                // width: 200,
                // height: 200,
              }}
              allowsFullscreenVideo={false}
              onNavigationStateChange={({url, canGoBack}) => {
                // console.log("url>>>>>>>>", url);
                setInputURl(url);
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
