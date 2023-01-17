import React, {useContext, useEffect, useState} from 'react';
import {View} from '@root/components/Themed';

import {
  Box,
  FormControl,
  Stack,
  Flex,
  Button,
  ScrollView,
  VStack,
  Heading,
} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CONFIG_LIST} from '@root/constants';
import {ReferenceDataContext} from '@root/storage/ReferenceDataContext';
import ConfigAPI from '@root/components/setting-profile/ConfigAPI';
import {SettingStyle as styles} from '@root/constants/styles';

export default function Setting() {
  const {data} = useContext(ReferenceDataContext);
  const [opt, setOpt] = useState<any>();

  useEffect(() => {
    CONFIG_LIST.map(item => {
      if (data.code === item.code) {
        setOpt(item);
      }
    });
  }, [data]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll}>
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
                          data.code === item.code ? (
                            <Ionicons
                              name={'checkmark-circle'}
                              size={12}
                              color={'white'}
                            />
                          ) : undefined
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
