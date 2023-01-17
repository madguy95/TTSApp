import React from 'react';
import {
  Button,
  Center,
  IconButton,
  Modal,
  ScrollView,
  Text,
  TextArea,
  View,
  VStack,
} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import _ from 'lodash';

function ModalToken(props) {
  const {saveData} = props;
  const [modalVisible, setModalVisible] = React.useState(false);
  const [size, setSize] = React.useState('md');
  const [data, setData] = React.useState(
    _.isArray(props.data) ? _.join(props.data, '\n') : '',
  );

  const handleSizeClick = newSize => {
    setSize(newSize);
    setModalVisible(!modalVisible);
  };

  const save = () => {
    setModalVisible(false);
    saveData([...new Set(data.split(/\n|\r|^--/m).filter(element => element))]);
  };

  const close = () => {
    setModalVisible(false);
    setData(_.isArray(props.data) ? _.join(props.data, '\n') : '')
  }

  return (
    <View {...props}>
      <Modal
        isOpen={modalVisible}
        onClose={close}
        size={size}>
        <Modal.Content maxH="420">
          <Modal.CloseButton />
          <Modal.Header>List Token</Modal.Header>
          <Modal.Body>
            <ScrollView>
              <TextArea
                value={data}
                onChangeText={value => setData(value)}
                autoCompleteType={undefined}
              />
            </ScrollView>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={close}>
                Cancel
              </Button>
              <Button colorScheme={'gray'} onPress={save}>
                Save
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      <VStack space={2}>
        {['full'].map(size => {
          return (
            <IconButton
              size={'sm'}
              variant="solid"
              _icon={{
                as: Ionicons,
                name: 'download-outline',
              }}
              colorScheme={'gray'}
              onPress={() => handleSizeClick(size)}
              key={size}
            />
          );
        })}
      </VStack>
    </View>
  );
}

export default ModalToken;
