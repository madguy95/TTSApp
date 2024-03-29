import React, {useContext, useEffect} from 'react';
import {StyleSheet} from 'react-native';

import {
  Box,
  FormControl,
  Stack,
  Input,
  Flex,
  TextArea,
  Button,
  ScrollView,
  HStack,
  Heading,
  IconButton,
  Stagger,
  useDisclose,
  Select,
  CheckIcon,
} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  ApiDefault,
  ApiViettelDefault,
} from '@root/constants';
import ModalToken from '@root/components/TokenList';
import {View} from '@root/components/Themed';
import {ReferenceDataContext} from '@root/storage/ReferenceDataContext';
import {Api} from '@root/model/api';
import { BACKGROUND_COLOR } from '@root/constants/styles/DefaultStyle';

function StaggerCop(props: any) {
  const {isOpen, onToggle} = useDisclose();
  return (
    <>
      <Box {...props}>
        <HStack justifyContent="center">
          <IconButton
            variant="solid"
            borderRadius="full"
            mt={1}
            size="xs"
            onPress={onToggle}
            colorScheme="gray"
            icon={
              <Ionicons
                name={props.icon || 'information-circle-sharp'}
                size={10}
                color={'white'}
              />
            }
          />
        </HStack>
      </Box>
      <Box alignItems="center">
        <Stagger visible={isOpen} {...(propsStagger as any)}>
          <IconButton
            mt={1}
            variant="solid"
            colorScheme="muted"
            borderRadius="full"
            size={'xs'}
            onPress={props.onPress}
            icon={
              <Ionicons name={'arrow-down-outline'} size={10} color={'white'} />
            }
          />
        </Stagger>
      </Box>
    </>
  );
}
function ConfigAPI(props: {name: any; config: any}) {
  const {setData} = useContext(ReferenceDataContext);
  const [api, setApi] = React.useState<Api>({} as Api);

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

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} nestedScrollEnabled={true}>
        <Box>
          <FormControl isRequired>
            <Stack mx={4}>
              <Flex direction="row">
                <Heading size="xs">Name: {props.name}</Heading>
                <StaggerCop
                  ml={1}
                  mb={1}
                  icon="clipboard-outline"
                  onPress={() =>
                    setApi({...api, ...props.config})
                  }></StaggerCop>
              </Flex>
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
            <>
              <FormControl>
                <Stack mx={4}>
                  <Flex direction="row">
                    <FormControl.Label>Header</FormControl.Label>
                    <StaggerCop
                      ml={1}
                      onPress={() =>
                        setApi({...api, header: props.config.header})
                      }></StaggerCop>
                  </Flex>
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
              <FormControl>
                <Stack mx={4}>
                  <Flex direction="row">
                    <FormControl.Label>List Token</FormControl.Label>
                    <ModalToken
                      m={1}
                      data={api.tokens}
                      saveData={(data: any) =>
                        setApi({...api, tokens: data})
                      }></ModalToken>
                  </Flex>
                  <Select
                    minWidth="200"
                    accessibilityLabel="Choose token"
                    placeholder="Choose token"
                    selectedValue={api.token}
                    onValueChange={value => {
                      setApi({...api, token: value});
                    }}
                    _selectedItem={{
                      bg: 'teal.600',
                      endIcon: <CheckIcon size={5} />,
                    }}
                    mt="1">
                    {api.tokens?.map(
                      (x: string, idx: React.Key | null | undefined) => {
                        return (
                          <Select.Item
                            key={idx}
                            label={`${idx} - ${x}`}
                            value={x}
                          />
                        );
                      },
                    )}
                  </Select>
                </Stack>
              </FormControl>
            </>
          ) : null}
          <FormControl>
            <Stack mx={4}>
              <Flex direction="row">
                <FormControl.Label>Query String</FormControl.Label>
                <StaggerCop
                  ml={1}
                  onPress={() =>
                    setApi({...api, queryString: props.config.queryString})
                  }></StaggerCop>
              </Flex>
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
              <Flex direction="row">
                <FormControl.Label>Body</FormControl.Label>
                <StaggerCop
                  ml={1}
                  onPress={() =>
                    setApi({...api, body: props.config.body})
                  }></StaggerCop>
              </Flex>
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

export default ConfigAPI;

const propsStagger = {
  initial: {
    opacity: 0,
    scale: 0,
    translateY: 34,
  },
  animate: {
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
  },
  exit: {
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
  },
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BACKGROUND_COLOR,
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
    backgroundColor: BACKGROUND_COLOR,
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
