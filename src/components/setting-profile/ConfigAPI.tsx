import React, {useContext, useEffect} from 'react';
import {StyleSheet} from 'react-native';

import {Text, View} from '../Themed';

import {
  Box,
  FormControl,
  Stack,
  Input,
  Flex,
  TextArea,
  Button,
  ScrollView,
  VStack,
  HStack,
  Heading,
  Fab,
  IconButton,
  Stagger,
  useDisclose,
  Center,
} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ReferenceDataContext} from '../../storage/ReferenceDataContext';
import {Api} from '../../model/api';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {ApiDefault, ApiViettelDefault} from './config';
import Ionicons from 'react-native-vector-icons/Ionicons';

function ConfigAPI(props) {
  const {setData} = useContext(ReferenceDataContext);
  const [api, setApi] = React.useState<Api>({});

  useEffect(() => {
    loadData();
  }, [props.name]);

  const storeData = async () => {
    try {
      const configClone: any = {...props.config, ...api};
      await AsyncStorage.setItem(props.name, JSON.stringify(configClone));
    } catch (e) {
      console.log('[ConfigAPI] storeData: ' + e);
    }
  };

  const loadData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(props.name);
      let jsonObj = jsonValue != null ? JSON.parse(jsonValue) : null;
      if (jsonObj) {
        setApi(jsonObj);
      } else {
        setApi(props.config);
      }
    } catch (e) {
      console.log('[ConfigAPI] loadData: ' + e);
    }
  };

  const activeConfig = async () => {
    setData({...props.config, ...api});
    await AsyncStorage.setItem('active_code', props.name);
  };
  const {isOpen, onToggle} = useDisclose();
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} nestedScrollEnabled={true}>
        <Box>
          <FormControl isRequired>
            <Stack mx={4}>
              <Heading size="xs">Name: {props.name}</Heading>
            </Stack>
          </FormControl>
          <FormControl isRequired>
            <Stack mx={4}>
              <HStack>
                <FormControl.Label flex={1} flexGrow={1} flexBasis={0}>
                  API url
                </FormControl.Label>
                <Input
                  flex={1}
                  flexGrow={3}
                  flexBasis={0}
                  type="text"
                  value={api.url}
                  onChangeText={value => setApi({...api, url: value})}
                  placeholder="text"
                />
              </HStack>
            </Stack>
          </FormControl>
          <FormControl isRequired isInvalid>
            <Stack mx={4}>
              <HStack>
                <FormControl.Label flex={1} flexGrow={1} flexBasis={0}>
                  API Method
                </FormControl.Label>
                <Input
                  mt={1}
                  flex={1}
                  flexGrow={3}
                  flexBasis={0}
                  type="text"
                  value={api.method}
                  onChangeText={value => setApi({...api, method: value})}
                  placeholder="Valid: GET, POST, PUT"
                />
              </HStack>
            </Stack>
          </FormControl>
          {props.config.code == ApiDefault.code ? (
            <FormControl isRequired>
              <Stack mx={4}>
                <HStack>
                  <FormControl.Label flex={1} flexGrow={1} flexBasis={0}>
                    Audio url
                  </FormControl.Label>
                  <Input
                    mt={1}
                    flex={1}
                    flexGrow={3}
                    flexBasis={0}
                    width={'100%'}
                    type="text"
                    value={api.urlAudio}
                    onChangeText={value => setApi({...api, urlAudio: value})}
                    placeholder="text"
                  />
                  {/* <FormControl.HelperText>End without '/'</FormControl.HelperText> */}
                </HStack>
              </Stack>
            </FormControl>
          ) : null}
          {props.config.code == ApiViettelDefault.code ? (
            <FormControl>
              <Stack mx={4}>
                <FormControl.Label>Header</FormControl.Label>
                <TextArea
                  h={20}
                  placeholder="Header data"
                  w={{
                    base: '100%',
                  }}
                  value={api.header}
                  onChangeText={value => setApi({...api, header: value})}
                  autoCompleteType={undefined}
                />
              </Stack>
            </FormControl>
          ) : null}
          <FormControl>
            <Stack mx={4}>
                  <Stagger
                    visible={isOpen}
                    initial={{
                      opacity: 0,
                      scale: 0,
                      translateY: 34,
                    }}
                    animate={{
                      translateY: 0,
                      scale: 1,
                      opacity: 1,
                      transition: {
                        type: 'spring',
                        mass: 0.8,
                        stagger: {
                          offset: 30,
                          reverse: true,
                        },
                      },
                    }}
                    exit={{
                      translateY: 34,
                      scale: 0.5,
                      opacity: 0,
                      transition: {
                        duration: 100,
                        stagger: {
                          offset: 30,
                          reverse: true,
                        },
                      },
                    }}>
                    <IconButton
                      // mb="4"
                      variant="solid"
                      bg="indigo.500"
                      colorScheme="indigo"
                      borderRadius="full"
                      icon={
                        <Ionicons name={'save'} size={10} color={'white'} />
                      }
                    />
                  </Stagger>
                {/* <VStack alignItems="center">
                  <IconButton
                    variant="solid"
                    borderRadius="full"
                    size="lg"
                    onPress={onToggle}
                    bg="cyan.400"
                    icon={<Ionicons name={'save'} size={10} color={'white'} />}
                  />
                </VStack> */}
              <Fab
                renderInPortal={false}
                shadow={2}
                right={0}
                top={0}
                onPress={onToggle}
                placement="top-right"
                size="xs"
                icon={<Ionicons name={'save'} size={10} color={'white'} />}
                label="set default"
              />
              <FormControl.Label>Query String</FormControl.Label>
              <TextArea
                h={20}
                placeholder="URL variable"
                w={{
                  base: '100%',
                }}
                value={api.queryString}
                onChangeText={value => setApi({...api, queryString: value})}
                autoCompleteType={undefined}
              />
            </Stack>
          </FormControl>
          <FormControl>
            <Stack mx={4}>
              <FormControl.Label>Body</FormControl.Label>
              <TextArea
                h={40}
                placeholder="Text Area Placeholder"
                w={{
                  base: '100%',
                }}
                value={api.body}
                onChangeText={value => setApi({...api, body: value})}
                autoCompleteType={undefined}
              />
            </Stack>
          </FormControl>
          <FormControl isRequired isReadOnly>
            <Stack mx={4}>
              <Flex
                direction="row"
                mb="2.5"
                mt="1.5"
                _text={{
                  color: 'coolGray.800',
                }}>
                <Button
                  colorScheme="muted"
                  onPress={() => storeData()}
                  endIcon={
                    <Ionicons name={'save'} size={12} color={'white'} />
                  }>
                  Save
                </Button>
                <Button
                  colorScheme="muted"
                  ml="2.5"
                  onPress={() => activeConfig()}
                  endIcon={
                    <Ionicons name={'hammer'} size={12} color={'white'} />
                  }>
                  Active
                </Button>
              </Flex>
            </Stack>
          </FormControl>
        </Box>
      </ScrollView>
    </View>
  );
}

const mapStateToProps = state => ({
  selector: state.reducer.selector,
  nextSelector: state.reducer.nextSelector,
  limitSplit: state.reducer.limitSplit,
  nextURL: state.reducer.nextURL,
  currentURL: state.reducer.currentURL,
  loadedConfig: state.reducer.loadedConfig,
});

const ActionCreators = Object.assign({}, {});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default ConfigAPI;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF8ED',
  },
  scroll: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    // overflowY: "scroll",
  },
  view: {
    flex: 1,
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
