import {Box, Button, Popover} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Text } from '../Themed';

function ButtonHeader(props) {
  const {errors} = props;
  return (
    <Box>
      <Popover
        trigger={triggerProps => {
          return (
            <Button
              colorScheme="gray"
              mr="2.5"
              borderRadius={'full'}
              {...triggerProps}>
              <Ionicons name={'bug-outline'} size={12} color={'white'} />
            </Button>
          );
        }}>
        <Popover.Content accessibilityLabel="Delete Customerd" w="lg">
          <Popover.Arrow />
          <Popover.CloseButton />
          {/* <Popover.Header>Logs</Popover.Header> */}
          <Popover.Body>
            {errors && errors.length > 0 ? errors.map((item, i) => {
                return (<Text key={i}>$ {item && Object.keys(item).length !== 0 ? JSON.stringify(item) : item?.toString()}</Text>)
            }) : 'Nothing...'}
          </Popover.Body>
        </Popover.Content>
      </Popover>
    </Box>
  );
}

const mapStateToProps = state => ({
  errors: state.logReducer.errors,
});

const ActionCreators = Object.assign({}, {});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ButtonHeader);
