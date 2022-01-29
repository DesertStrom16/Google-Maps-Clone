import React from 'react';
import {
  StyleSheet,
} from 'react-native';
import {useNavigation, useNavigationState} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useAppDispatch, useAppSelector} from '../app/hooks';
import useDebounce from '../hooks/use-debounce';
import {useFetchUsersQuery, useSelectUserQuery} from '../services/user';
import {width, height} from '../helper/responsive';
import {setQueryArg} from '../store/userSlice';
import TextScaled from './TextScaled';

const SearchInputPlain = () => {
  const navigation = useNavigation<any>();
  const state = useNavigationState(state => state?.index);

  const {queryArg, selectedUserArg, status} = useAppSelector(
    state => state.user,
  );
  const dispatch = useAppDispatch();

  const {value: text, setValue: setText} = useDebounce(value =>
    dispatch(setQueryArg(value)),
  );

  const {data} = useFetchUsersQuery(
    queryArg,
    {skip: queryArg.trim() === ''},
  );
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

  const textEmpty = text.trim() === '';

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Search')}
      activeOpacity={0.95}
      style={{
        ...styles.wrapper,
        ...styles.wrapperIos,
        backgroundColor: 'white',
        shadowColor: '#C9C9C9',
        shadowOffset: {
          width: width(0),
          height: height(1),
        },
        shadowOpacity: 0.6,
        shadowRadius: height(1),
      }}>
      <TextScaled
        style={{
          color: textEmpty ? 'grey' : 'black',
          marginLeft: width(2),
          fontSize: width(4),
        }}>
        {textEmpty ? 'Search here' : text}
      </TextScaled>
    </TouchableOpacity>
  );
};

export default SearchInputPlain;

const styles = StyleSheet.create({
  wrapper: {
    width: width(90),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: width(4),
  },
  wrapperIos:
  {
    height: height(6),
    paddingHorizontal: width(3),
    borderRadius: width(6),
    elevation: 6,
  },
  backButton: {
    transform: [{rotateY: '180deg'}],
  },
  inputIos: {
    width: '90%',
    height: '100%',
    color: 'black',
    marginLeft: width(1),
    backgroundColor: 'white',
  },
  input: {
    width: '85%',
    backgroundColor: 'white',
    color: 'black',
    borderRadius: 3,
    elevation: 6,
  },
});
