import React from 'react';
import {StyleSheet, Text, TextProps} from 'react-native';
import {width} from '../helper/responsive';

const TextScaled: React.FC<TextProps> = props => {
  return (
    <Text style={[styles.text, props.style]} maxFontSizeMultiplier={1.5}>
      {props.children}
    </Text>
  );
};

export default TextScaled;

const styles = StyleSheet.create({
  text: {fontSize: width(5)},
});
