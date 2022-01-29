import React from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Platform,
  Pressable,
} from 'react-native';
import {useNavigation, useNavigationState} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useAppDispatch, useAppSelector} from '../app/hooks';
import useDebounce from '../hooks/use-debounce';
import {useFetchUsersQuery, useSelectUserQuery} from '../services/user';
import {width, height} from '../helper/responsive';
import {setQueryArg} from '../store/userSlice';

const SearchInput = (props: {inputRef: any}) => {
  const {inputRef} = props;
  const [hasFocused, setHasFocused] = React.useState(false);
  const navigation = useNavigation<any>();
  const state = useNavigationState(state => state?.index);

  const {queryArg, selectedUserArg, status} = useAppSelector(
    state => state.user,
  );
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  const {value: text, setValue: setText} = useDebounce(value =>
    dispatch(setQueryArg(value)),
  );

  const {data} = useFetchUsersQuery(queryArg, {skip: queryArg.trim() === ''});
  const {data: selectedUser} = useSelectUserQuery(selectedUserArg, {
    skip: selectedUserArg.trim() === '',
  });

  React.useLayoutEffect(() => {
    if (selectedUser) {
      let fullName = selectedUser?.name.first + ' ' + selectedUser?.name.last;
      let nameCapitalized = fullName
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      setText(nameCapitalized);
    }
  }, [selectedUser, state]);

  const handleBack = () => {
    navigation.goBack();
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setText('');
  };

  return (
    <View
      style={{
        ...styles.wrapper,
        ...styles.wrapperIos,
        top: insets.top,
        borderWidth: width(0.25),
        borderColor: '#000000',
      }}>
      {Platform.OS === 'ios' && (
        <Pressable
          style={styles.backButton}
          onPress={handleBack}
          hitSlop={width(1)}>
          <Icon name="arrow-forward-ios" size={width(8.5)} color="#000000" />
        </Pressable>
      )}

      <TextInput
        ref={inputRef}
        autoFocus
        maxFontSizeMultiplier={1.5}
        style={styles.inputIos}
        onFocus={() => {
          if (!hasFocused) {
            setHasFocused(true);
          }
          navigation.navigate('Search');
        }}
        onChangeText={setText}
        value={text}
        placeholder="Search here"
      />
      {text.trim() !== '' && (
        <Pressable
          style={Platform.OS === 'ios' ? {} : {marginLeft: 'auto'}}
          onPress={handleClear}
          hitSlop={width(1)}>
          <Icon name="highlight-off" size={width(8.5)} color="black" />
        </Pressable>
      )}
    </View>
  );
};

export default SearchInput;

const styles = StyleSheet.create({
  wrapper: {
    width: width(90),
    zIndex: 99,
    position: 'absolute',
    left: width(5),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: width(6),
    paddingHorizontal: width(3),
  },
  wrapperIos:
    Platform.OS === 'ios'
      ? {
          height: height(6),
        }
      : {
          height: height(8.5),
          paddingTop: 15,
          paddingBottom: 10,
        },
  backButton: {
    transform: [{rotateY: '180deg'}],
  },
  exitButton: {},
  inputIos: {
    width: '80%',
    height: '100%',
    color: 'black',
    marginLeft: width(1),
    fontSize: width(4),
  },
});
