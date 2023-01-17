import {Text} from 'native-base';
import React from 'react';
import {
  Dimensions,
  ListRenderItemInfo,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {PlaylistItem} from '@root/model/api';
import { DEVICE_WIDTH } from '@root/constants/styles/DefaultStyle';

type MyProps = {
  data: ListRenderItemInfo<PlaylistItem>;
  idSelected: number;
  selectItem: Function;
};
class Item extends React.Component<MyProps> {
  shouldComponentUpdate?(
    nextProps: MyProps,
    nextState: Readonly<any>,
    nextContext: any,
  ) {
    if (
      this.props.data.item.id === this.props.idSelected ||
      this.props.data.item.id === nextProps.idSelected
    ) {
      //   console.log('shold change');
    }
    return (
      this.props.data.item.id === this.props.idSelected ||
      this.props.data.item.id === nextProps.idSelected ||
      this.props.data.item.title !== nextProps.data.item.title
    );
  }
  render() {
    return (
      <TouchableOpacity
        style={[
          styles.list,
          this.props.data.item.id == this.props.idSelected
            ? styles.selected
            : styles.list,
        ]}
        onPress={() => this.props.selectItem(this.props.data.item.id)}>
        <Text style={styles.lightText}>{this.props.data.item.uri}</Text>
        <Text style={styles.lightText}>
          {' '}
          {this.props.data.item.title.charAt(0).toUpperCase() +
            this.props.data.item.title.slice(1)}{' '}
        </Text>
      </TouchableOpacity>
    );
  }
}

export default Item;

const styles = StyleSheet.create({
  list: {
    paddingVertical: 5,
    height: 50,
    margin: 3,
    flexDirection: 'column',
    backgroundColor: '#192338',
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: -1,
    overflow: 'hidden',
    display: 'flex',
  },

  lightText: {
    color: '#f7f7f7',
    width: DEVICE_WIDTH,
    paddingLeft: 15,
    fontSize: 12,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textoverflow: 'ellipsis',
  },

  line: {
    height: 0.5,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  selected: {backgroundColor: '#FA7B5F'},
});
