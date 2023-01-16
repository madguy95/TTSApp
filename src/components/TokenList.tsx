import React from 'react';
import {
  Button,
  Center,
  Modal,
  ScrollView,
  Text,
  TextArea,
  VStack,
} from 'native-base';

function ModalToken(props) {
  const { saveData } = props
  const [modalVisible, setModalVisible] = React.useState(false);
  const [size, setSize] = React.useState('md');
  const [data, setData] = React.useState('');

  const handleSizeClick = newSize => {
    setSize(newSize);
    setModalVisible(!modalVisible);
  };

  const save = () => {
    setModalVisible(false);
    saveData([...new Set(data.split(/\n|\r|^--/m).filter(element => element))]);
  };

  return (
    <>
      <Modal isOpen={modalVisible} onClose={setModalVisible} size={size}>
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
                onPress={() => {
                  setModalVisible(false);
                }}>
                Cancel
              </Button>
              <Button onPress={save}>Save</Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      <VStack space={2} w={40}>
        {['full'].map(size => {
          return (
            <Button
              colorScheme={'gray'}
              onPress={() => handleSizeClick(size)}
              key={size}>{`Import Tokens`}</Button>
          );
        })}
      </VStack>
    </>
  );
}

export default ModalToken;
