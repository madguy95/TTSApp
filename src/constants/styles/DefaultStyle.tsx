import {Dimensions} from 'react-native';

export const DISABLED_OPACITY = 0.5;

export const BACKGROUND_COLOR = '#E8E8E8';
export const FONT_SIZE = 14;
export const {width: DEVICE_WIDTH, height: DEVICE_HEIGHT} =
  Dimensions.get('window');

export const VIDEO_CONTAINER_HEIGHT =
  (DEVICE_HEIGHT * 2.0) / 5.0 - FONT_SIZE * 2;
