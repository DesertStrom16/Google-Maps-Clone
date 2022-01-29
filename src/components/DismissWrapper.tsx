import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
  ViewProps,
} from 'react-native';

const DismissWrapper = (props: {children?: React.ReactNode} & ViewProps) => (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View {...props} style={[{flex: 1}, props.style]}>
      {props.children}
    </View>
  </TouchableWithoutFeedback>
);

export default DismissWrapper;
