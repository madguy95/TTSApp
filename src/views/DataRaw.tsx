import React, {useEffect} from 'react';
import {
  Button,
  Flex,
  Input,
  Stack,
  TextArea,
  ScrollView,
  HStack,
} from 'native-base';
import {Platform} from 'react-native';
import {WebView} from 'react-native-webview';
import {useRef} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import {AnyAction, bindActionCreators, Dispatch} from 'redux';
import _ from 'lodash';

import {loadNew, loadNewData, updateWebInfo} from '@root/redux/Actions';
import {DataRawStyle as styles} from '@root/constants/styles';
import {Text, View} from '@root/components/Themed';

function DataRaw(props: {
  actions?: any;
  content?: any;
  selector?: any;
  nextSelector?: any;
  limitSplit?: any;
  nextURL?: any;
  currentURL?: any;
}) {
  const {content} = props;
  const {selector, nextSelector, limitSplit, nextURL, currentURL} = props;
  const [inputURL, setInputURl] = React.useState(currentURL);
  const gridIframe = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = React.useState(false);
  const [limit, setLimit] = React.useState<string>(limitSplit + '');
  const webViewRef = useRef<any>(null);

  useEffect(() => {
    setLoading(false);
  }, [content, inputURL, selector, nextSelector, limitSplit]);

  useEffect(() => {
    setLimit(limitSplit);
    // console.log(limitSplit)
  }, [limitSplit]);
  
  function updateWeb(obj: {
    selector?: string;
    nextSelector?: string;
    limitSplit?: number;
    currentURL?: any;
  }) {
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
              <Text style={styles.text}>Query selector</Text>
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

              <Text style={styles.text}>Max length</Text>
              <Input
                keyboardType="numeric"
                type="text"
                value={limit}
                onChangeText={value => setLimit(value)}
                onSubmitEditing={() => {
                  updateWeb({
                    limitSplit: _.isNumber(limit) ? parseInt(limit) : 500,
                  });
                }}
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
            <Text style={styles.text}>Trang web url</Text>
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
            <ScrollView style={styles.scroll}>
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

const mapStateToProps = (state: {
  reducer: {
    needLoad: any;
    content: any;
    selector: any;
    nextSelector: any;
    limitSplit: any;
    nextURL: any;
    currentURL: any;
  };
}) => ({
  needLoad: state.reducer.needLoad,
  content: state.reducer.content,
  selector: state.reducer.selector,
  nextSelector: state.reducer.nextSelector,
  limitSplit: state.reducer.limitSplit,
  nextURL: state.reducer.nextURL,
  currentURL: state.reducer.currentURL,
});

const ActionCreators = Object.assign({}, {loadNew, loadNewData, updateWebInfo});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(DataRaw);
