import React, {useEffect} from 'react';
import {
  Button,
  Flex,
  Input,
  Stack,
  TextArea,
  ScrollView,
  HStack,
  Box,
} from 'native-base';
import {Platform} from 'react-native';
import {StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import {Text, View} from '../components/Themed';
import {useRef} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {loadNew, loadNewData, updateWebInfo} from '../redux/Actions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

function DataRaw(props) {
  const {content} = props;
  const {selector, nextSelector, limitSplit, nextURL, currentURL} = props;
  const [inputURL, setInputURl] = React.useState(currentURL);
  const gridIframe = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = React.useState(false);

  const webViewRef = useRef<any>(null);

  useEffect(() => {
    setLoading(false);
  }, [content]);

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

  const onClickLoad = () => {
    setLoading(true);
    props.actions.loadNewData(inputURL, selector, nextSelector, limitSplit);
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
              <Text>Query selector</Text>
              <Stack>
                <HStack>
                  <Input
                    flex={1}
                    type="text"
                    value={selector}
                    onChangeText={value => updateWeb({selector: value})}
                    placeholder="css selector get content"
                  />
                  <Input
                    ml={1}
                    flex={1}
                    type="text"
                    value={nextSelector}
                    onChangeText={value => updateWeb({nextSelector: value})}
                    placeholder="css selector get href next link"
                  />
                </HStack>
              </Stack>

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
              <Button
                isLoading={loading}
                isLoadingText="Loading"
                colorScheme={'muted'}
                onPress={() => onClickLoad()}
                leftIcon={
                  <Ionicons name={'reload-circle'} size={15} color={'white'} />
                }>
                Load
              </Button>
              <TextArea
                // isDisabled={true}
                isReadOnly={true}
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
              mt={1}
              isDisabled={true}
              isReadOnly={true}
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
            <ScrollView style={styles.scroll} >
            <View style={styles.webview}>
              {currentURL ? (
                <WebView
                  ref={webViewRef}
                  source={{uri: currentURL}}
                  style={{
                    marginTop: 22,
                    flex: 1,
                    margin: 'auto',
                    width: '100%',
                    height: '100%',
                  }}
                  allowsFullscreenVideo={false}
                  onNavigationStateChange={({url, canGoBack}) => {
                    setInputURl(url);
                  }}
                  scrollEnabled={true}
                  nestedScrollEnabled
                  useWebKit={true}
                  originWhitelist={['*']}
                  allowsInlineMediaPlayback={true}
                />
              ) : null}
              
            </View>
            </ScrollView>
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
    height: 600,
    backgroundColor: '#FFF8ED',
  },
  scroll: {
    width: '100%',
    height: '100%',
    overflow: 'hidden'
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
