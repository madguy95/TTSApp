import {StyleSheet} from 'react-native';
import { BACKGROUND_COLOR } from '@root/constants/styles/DefaultStyle';

export const STYLE = StyleSheet.create({
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
    // overflow: 'hidden',
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
