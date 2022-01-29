import {PixelRatio, useWindowDimensions} from 'react-native';

const useResponsive = () => {
  const {height, width} = useWindowDimensions();

  const widthScaled = (widthPercent: number) => {
    return PixelRatio.roundToNearestPixel((width * widthPercent) / 100);
  };

  const heightScaled = (heightPercent: number) => {
    return PixelRatio.roundToNearestPixel((height * heightPercent) / 100);
  };

  return {
    width: widthScaled,
    height: heightScaled,
  };
};

export default useResponsive;
