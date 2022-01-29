import React, {memo, useState} from 'react';
import {
  StyleSheet,
  View,
  LayoutChangeEvent,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppSelector, useAppDispatch} from '../app/hooks';
import {useSelectUserQuery} from '../services/user';
import MapboxGL from '@react-native-mapbox-gl/maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useResponsive from '../hooks/use-responsive';
import {fetchGeo} from '../store/userSlice';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDecay,
  Easing,
  withTiming,
  cancelAnimation,
  useAnimatedGestureHandler,
  interpolate,
  useAnimatedReaction,
} from 'react-native-reanimated';
import SearchInputPlain from '../components/SearchInputPlain';
import InfoPanel from '../components/InfoPanel';
type RootStackParamList = {
  Map: undefined;
  Search: undefined;
};
type MapScreenNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  'Map'
>;
const latitude = 41.878113;
const longitude = -87.629799;
const MapView = (props: MapScreenNavigationProp) => {
  const {route, navigation} = props;
  const {selectedUserArg, activeCoord, status} = useAppSelector(
    state => state.user,
  );
  const isSelectedUser = selectedUserArg.trim() !== '';
  const {data} = useSelectUserQuery(selectedUserArg, {
    skip: isSelectedUser,
  });
  const [panelHeight, setPanelHeight] = useState(0);

  const {height, width} = useResponsive();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const latMap = activeCoord.lat !== 0 ? activeCoord.lat : latitude;
  const lngMap = activeCoord.lng !== 0 ? activeCoord.lng : longitude;
  const showMarker =
    latMap !== latitude && lngMap !== longitude && status !== 'loading';

  const PANEL_CLOSED_HEIGHT = height(16) + 2;
  const PANEL_OPEN_HEIGHT = height(32) + 2;
  const SCREEN_HEIGHT = height(100) - insets.top;
  const PANEL_END_POSITION = -SCREEN_HEIGHT + PANEL_CLOSED_HEIGHT;
  const PANEL_AUTO_CLOSE_BUFFER = height(20);
  const PANEL_OPEN_BUFFER = PANEL_END_POSITION / 20;
  const PANEL_CLOSE_BUFFER = PANEL_END_POSITION - PANEL_END_POSITION / 20;
  const PANEL_HEIGHT =
    panelHeight > SCREEN_HEIGHT
      ? -panelHeight + PANEL_CLOSED_HEIGHT
      : PANEL_END_POSITION;

  const TOP_INSET_OPACITY = SCREEN_HEIGHT - height(6) - PANEL_CLOSED_HEIGHT;

  const isOpen = useSharedValue(false);
  const pan = useSharedValue(0);
  const opacityTopInset = useSharedValue(0);
  const seachInputPos = useSharedValue(0);

  const panelAnimatedStyles = useAnimatedStyle(() => {
    const translateVertical = interpolate(
      pan.value,
      [PANEL_HEIGHT * 2, PANEL_HEIGHT, 0],
      [PANEL_HEIGHT * 1.25, PANEL_HEIGHT, 0],
    );

    return {
      transform: [
        {
          translateY: translateVertical,
        },
      ],
    };
  });

  const topInsetAnimatedStyles = useAnimatedStyle(() => {
    return {
      opacity: opacityTopInset.value,
    };
  });

  const searchInputAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: seachInputPos.value,
        },
      ],
    };
  });

  const swipeBarAnimatedStyles = useAnimatedStyle(() => {
    const swipeBarOpacity = interpolate(
      pan.value,
      [
        PANEL_HEIGHT,
        PANEL_HEIGHT + PANEL_HEIGHT * -0.04,
        PANEL_HEIGHT + PANEL_HEIGHT * -0.0925,
        0,
      ],
      [0, 0, 1, 1],
    );

    return {
      opacity: swipeBarOpacity,
    };
  });

  const panGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {y: number}
  >({
    onStart: (_, context) => {
      context.y = pan.value;
      cancelAnimation(pan);
    },
    onActive: (e, context) => {
      pan.value = e.translationY + context.y;
    },
    onEnd: e => {
      if (isOpen.value) {
        // Panel Open
        if (e.translationY < 0) {
          // Swipe up

          if (pan.value > PANEL_HEIGHT) {
            // Not at max limit, withDecay upward
            pan.value = withDecay({
              velocity: e.velocityY,
              clamp: [PANEL_HEIGHT, 0],
            });
          } else {
            // At max height limit, withSpring back to max height
            pan.value = withSpring(PANEL_HEIGHT, {overshootClamping: true});
          }
        } else {
          // Swipe down
          if (e.velocityY > 0) {
            // Weak Swipe
            if (pan.value > PANEL_END_POSITION) {
              // Below default open panel position
              if (pan.value < PANEL_CLOSE_BUFFER) {
                // Above close buffer, return to Open
                pan.value = withTiming(PANEL_END_POSITION, {
                  duration: 100,
                  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                });
              } else {
                // Below close buffer, return to Zero
                pan.value = withTiming(0, {
                  duration: 350,
                  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                });
                isOpen.value = false;
              }
            } else {
              // Above default open panel position

              if (pan.value > PANEL_END_POSITION - PANEL_AUTO_CLOSE_BUFFER) {
                // Close to boundary, withTiming to default open position
                pan.value = withTiming(PANEL_END_POSITION, {
                  duration: 50,
                  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                });
              } else {
                // withDecay down, clamp at default panel open position
                pan.value = withDecay({
                  velocity: e.velocityY,
                  clamp: [0, PANEL_END_POSITION],
                });
              }
            }
          } else {
            // Strong Swipe
            // Return to Zero
            pan.value = withTiming(0, {
              duration: 350,
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            });
            isOpen.value = false;
          }
        }
      } else {
        // Panel Closed
        if (pan.value < PANEL_OPEN_BUFFER) {
          // Closed, swipe up success, set to Open
          pan.value = withTiming(PANEL_END_POSITION, {
            duration: 350,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          });
          isOpen.value = true;
        } else {
          // Closed, swipe up failed, return to close
          pan.value = withTiming(0, {
            duration: 100,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          });
        }
      }
    },
  });

  // TopBar Opacity
  useAnimatedReaction(
    () => {
      return pan.value < -TOP_INSET_OPACITY;
    },
    data => {
      opacityTopInset.value = withTiming(data ? 1 : 0, {
        duration: 200,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    },
  );

  // Search Input height is height(7) + insets.top, heigher value is for spring animation increase
  const SEARCH_INPUT_HIDDEN = -height(16) - insets.top;
  const SEARCH_INPUT_BUFFER = -SCREEN_HEIGHT + PANEL_OPEN_HEIGHT + height(24);

  // SearchInput Position
  useAnimatedReaction(
    () => {
      return pan.value < SEARCH_INPUT_BUFFER;
    },
    data => {
      seachInputPos.value = withSpring(data ? SEARCH_INPUT_HIDDEN : 0, {
        overshootClamping: true,
      });
    },
  );

  React.useEffect(() => {
    if (isSelectedUser) {
      dispatch(fetchGeo());
    }
  }, [selectedUserArg]);

  const panelOnLayoutHandler = (e: LayoutChangeEvent) => {
    setPanelHeight(e.nativeEvent.layout.height);
  };

  const closeButtonHandler = () => {
    pan.value = withTiming(0, {
      duration: 350,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    isOpen.value = false;
  };

  return (
    <>
      <MapboxGL.MapView
        logoEnabled={false}
        attributionPosition={{
          right: 8,
          bottom: isSelectedUser ? 10 : insets.bottom,
        }}
        style={{
          flex: 1,
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: isSelectedUser ? height(100) - height(7) : height(100),
        }}>
        <MapboxGL.Camera centerCoordinate={[lngMap, latMap]} zoomLevel={11} />
        {showMarker && (
          <MapboxGL.PointAnnotation id="marker" coordinate={[lngMap, latMap]} />
        )}
      </MapboxGL.MapView>

      <Animated.View
        style={[
          styles.blurHeader,
          {height: insets.top + height(6), backgroundColor: 'white'},
          topInsetAnimatedStyles,
        ]}></Animated.View>

      <View
        style={{
          height: height(8),
          width: width(6),
          zIndex: 99,
          top: insets.top,
          left: width(5),
        }}>
        <TouchableWithoutFeedback
          onPress={closeButtonHandler}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}>
          <Icon name="keyboard-arrow-down" size={width(8.5)} color="#000000" />
        </TouchableWithoutFeedback>
      </View>

      <Animated.View
        style={[
          {
            position: 'absolute',
            top: insets.top,
            left: width(5),
            zIndex: 99,
            backgroundColor: 'grey',
            borderRadius: width(6),
          },
          searchInputAnimatedStyles,
        ]}>
        <SearchInputPlain />
      </Animated.View>

      {isSelectedUser && (
        <PanGestureHandler onGestureEvent={panGestureEvent}>
          <Animated.View
            onLayout={panelOnLayoutHandler}
            style={[
              styles.menuWrapper,
              {
                top: height(100) - PANEL_CLOSED_HEIGHT,
                minHeight: SCREEN_HEIGHT,
              },
              panelAnimatedStyles,
            ]}>
            <View style={styles.panelContent}>
              <View
                style={[
                  styles.overflowBackground,
                  {height: SCREEN_HEIGHT, top: PANEL_HEIGHT * -1},
                ]}></View>
              <Animated.View
                style={[
                  styles.swipeBar,
                  {height: width(2), top: height(1)},
                  swipeBarAnimatedStyles,
                ]}></Animated.View>
              <InfoPanel PANEL_CLOSED_HEIGHT={PANEL_CLOSED_HEIGHT} />
            </View>
          </Animated.View>
        </PanGestureHandler>
      )}
    </>
  );
};
export default memo(MapView);
const styles = StyleSheet.create({
  blurHeader: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 99,
    backgroundColor: 'white',
  },
  menuWrapper: {
    width: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: 'white',
    position: 'absolute',
    left: 0,
  },
  panelContent: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  swipeBar: {
    width: '20%',
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C3C3C3',
    position: 'absolute',
    left: '40%',
  },
  overflowBackground: {
    width: '100%',
    position: 'absolute',
    left: 0,
    backgroundColor: 'white',
  },
});
