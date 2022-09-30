import {Box, Button, Popover} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Text} from '../Themed';

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
        <Popover.Content
          accessibilityLabel="Delete Customerd"
          w="sm"
          backgroundColor={'black'}>
          {/* <Popover.Arrow /> */}
          <Popover.CloseButton />
          {/* <Popover.Header>Logs</Popover.Header> */}
          <Popover.Body bgColor={'black'}>
            {errors && errors.length > 0 ? (
              errors.map((item, i) => {
                return (
                  <Text style={{color: 'cornsilk'}} key={i}>
                    $ {item.date}{' '}
                    {item && Object.keys(item.message).length !== 0
                      ? JSON.stringify(item.message)
                      : item?.message?.toString()}
                  </Text>
                );
              })
            ) : (
              <Text style={{color: 'cornsilk'}}>'Nothing...'</Text>
            )}
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
