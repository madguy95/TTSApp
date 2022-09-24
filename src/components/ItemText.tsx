import {Text, FlatList} from 'native-base';
import React, {memo} from 'react';
import {Dimensions, StyleSheet, TouchableOpacity} from 'react-native';
import {PlaylistItem} from '../model/api';

class Item extends React.Component {
  shouldComponentUpdate?(
    nextProps: Readonly<P>,
    nextState: Readonly<S>,
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
      this.props.data.item.id === nextProps.idSelected
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

const {width: DEVICE_WIDTH, height: DEVICE_HEIGHT} = Dimensions.get('window');
const styles = StyleSheet.create({
  list: {
    paddingVertical: 5,
    height: 50,
    margin: 3,
    flexDirection: 'row',
    backgroundColor: '#192338',
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: -1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
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
