import React, {memo} from 'react';
import {
  StyleSheet,
  View,
  Text,
  BackHandler,
  Keyboard,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {useFocusEffect} from '@react-navigation/native';
import {useAppSelector} from '../app/hooks';
import {useFetchUsersQuery} from '../services/user';
import SearchItem from '../components/SearchItem';
import {height, width} from '../helper/responsive';
import DismissWrapper from '../components/DismissWrapper';
import SearchInput from '../components/SearchInput';

const Search = () => {
  const {queryArg} = useAppSelector(state => state.user);
  const {
    data: users = [],
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useFetchUsersQuery(queryArg, {skip: queryArg.trim() === ''});
  const inputRef = React.useRef<any>(null);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        inputRef.current?.blur();
        return false;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  React.useEffect(() => {
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      inputRef.current?.blur();
    });

    return () => {
      hideSubscription.remove();
    };
  }, []);

  const ListSeperator = <View style={styles.seperator}></View>;
  const loading = isLoading || isFetching;
  const queryEmpty = queryArg.trim() === '';

  return (
    <>
      <SearchInput inputRef={inputRef} />
      <KeyboardAvoidingView
        style={styles.wrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {!loading && users.length > 0 ? (
          queryArg.trim() === '' ? (
            <DismissWrapper />
          ) : (
            <FlatList
              ItemSeparatorComponent={() => ListSeperator}
              ListHeaderComponent={() => ListSeperator}
              ListFooterComponent={() => ListSeperator}
              ListFooterComponentStyle={{marginBottom: height(5)}}
              keyboardShouldPersistTaps="handled"
              data={users}
              renderItem={({item}) => (
                <SearchItem
                  key={item.username}
                  user={item}
                  inputRef={inputRef}
                />
              )}
              keyExtractor={item => item.username}
            />
          )
        ) : (
          <DismissWrapper>
            {loading ? (
              <ActivityIndicator
                style={styles.loadingSpinner}
                size="large"
                color="#0000ff"
              />
            ) : queryEmpty ? null : (
              <Text style={{textAlign: 'center'}}>No results found</Text>
            )}
          </DismissWrapper>
        )}
      </KeyboardAvoidingView>
    </>
  );
};

export default memo(Search);

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: height(16),
    flex: 1,
  },
  loadingSpinner: {paddingTop: width(2)},
  seperator: {
    height: height(0.05),
    backgroundColor: '#C3C3C3',
  },
});
