import {Dimensions, PixelRatio} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const width = (widthPercent: number) => {
  return PixelRatio.roundToNearestPixel((screenWidth * widthPercent) / 100);
};

const height = (heightPercent: number) => {
  return PixelRatio.roundToNearestPixel((screenHeight * heightPercent) / 100);
};

export {width, height};
