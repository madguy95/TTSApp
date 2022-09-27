import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';

import {Text, View} from '../components/Themed';

import {
  Box,
  FormControl,
  Stack,
  Flex,
  Button,
  ScrollView,
  Badge,
  VStack,
  Heading,
} from 'native-base';
import {CONFIG_LIST} from '../components/setting-profile/config';
import {ReferenceDataContext} from '../storage/ReferenceDataContext';
import ConfigAPI from '../components/setting-profile/ConfigAPI';
import Ionicons from 'react-native-vector-icons/Ionicons';

function Sett() {
  const {data} = useContext(ReferenceDataContext);
  const [opt, setOpt] = useState();

  useEffect(() => {
    CONFIG_LIST.map(item => {
      if (data.code === item.code) {
        setOpt(item);
      }
    });
  }, [data]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} >
        <Box>
          <FormControl isRequired>
            <Stack mx={4}>
              <Heading size="xs">List Config</Heading>
              <Flex
                direction="row"
                mb="2.5"
                mt="1.5"
                _text={{
                  color: 'coolGray.800',
                }}>
                {CONFIG_LIST.map((item, i) => {
                  return (
                    <VStack key={'btn' + i}>
                      <Button
                        colorScheme={'muted'}
                        bg={opt?.code === item.code ? 'gray.600' : 'gray.400'}
                        mr="2.5"
                        onPress={() => setOpt(item)}
                        endIcon={
                          data.code === item.code && (
                            <Ionicons
                              name={'checkmark-circle'}
                              size={12}
                              color={'white'}
                            />
                          )
                        }>
                        {item.code}
                      </Button>
                    </VStack>
                  );
                })}
              </Flex>
            </Stack>
          </FormControl>
        </Box>
        <Box>{opt && <ConfigAPI name={opt?.code} config={opt?.config} />}</Box>
      </ScrollView>
    </View>
  );
}

export default function Setting() {
  return (
    <View style={styles.container}>
      <Sett />
    </View>
  );
}

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
    // overflow: 'hidden',
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
