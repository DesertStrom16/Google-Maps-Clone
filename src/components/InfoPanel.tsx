import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import useResponsive from '../hooks/use-responsive';
import {useAppSelector} from '../app/hooks';
import {useSelectUserQuery} from '../services/user';
import TextScaled from './TextScaled';

const InfoPanel = (props: {PANEL_CLOSED_HEIGHT: number}) => {
  const {PANEL_CLOSED_HEIGHT} = props;
  const {selectedUserArg, status} = useAppSelector(
    state => state.user,
  );
  const isSelectedUser = selectedUserArg.trim() === '';
  const {
    data: user,
  } = useSelectUserQuery(selectedUserArg, {
    skip: isSelectedUser,
  });

  const {height, width} = useResponsive();

  const fullName = user?.name.first + ' ' + user?.name.last;
  const nameCapitalized = fullName
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <View
      style={[
        styles.wrapper,
        {paddingTop: height(6), paddingHorizontal: width(6)},
      ]}>
      {status === 'loading' ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <View
            style={{height: PANEL_CLOSED_HEIGHT - height(6), width: '100%'}}>
            <TextScaled style={{fontSize: width(5.75)}}>
              {nameCapitalized}
            </TextScaled>
            <TextScaled
              style={{
                fontSize: width(4),
                color: 'grey',
                marginBottom: width(5),
                marginTop: width(0.25),
              }}>
              {user?.username}
            </TextScaled>
          </View>

          <Image
            source={{uri: user?.picture.large}}
            style={{
              width: width(50),
              height: width(50),
              marginBottom: width(3),
            }}
          />
          <TextScaled
            style={{
              fontSize: width(4.25),
              marginBottom: width(1),
            }}>
            {user?.cell}
          </TextScaled>
          <TextScaled
            style={{
              fontSize: width(4.25),
            }}>
            {user?.email}
          </TextScaled>

          {user?.username === 'silverostrich734' && (
            <View style={{marginTop: height(40), marginBottom: height(3)}}>
              <Text style={{fontSize: width(18), textAlign: 'center'}}>
                Dummy Space
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default InfoPanel;

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
});
