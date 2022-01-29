import React, {memo} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useAppDispatch} from '../app/hooks';
import {setSelectedUser} from '../store/userSlice';
import PeopleBasic from 'models/peopleBasic';
import TextScaled from '../components/TextScaled';
import {height, width} from '../helper/responsive';

const SearchItem = (props: {user: PeopleBasic; inputRef: any}) => {
  const {user, inputRef} = props;
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();

  const handlePress = () => {
    inputRef.current?.blur();
    navigation.navigate('Map');
    dispatch(setSelectedUser(user.username));
  };

  return (
    <TouchableOpacity style={styles.wrapper} onPress={handlePress}>
      <Image
        source={{uri: user?.thumbnail}}
        style={{
          width: width(14),
          height: width(14),
          borderRadius: width(7),
          backgroundColor: 'grey',
        }}
      />
      <View style={styles.textWrapper}>
        <TextScaled style={styles.text}>
          {user.name.first} {user.name.last}
        </TextScaled>
        <TextScaled style={styles.username}>{user.username}</TextScaled>
      </View>
    </TouchableOpacity>
  );
};

export default SearchItem;

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: width(6),
    paddingVertical: width(4),
  },
  textWrapper: {
    paddingLeft: width(1.5),
  },
  text: {
    lineHeight: width(6),
    marginBottom: height(0.2),
    textTransform: 'capitalize',
  },
  username: {
    fontSize: width(4),
    fontWeight: '300',
  },
});
