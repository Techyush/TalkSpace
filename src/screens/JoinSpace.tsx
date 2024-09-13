import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, Text, ToastAndroid, View } from 'react-native';
import { storage } from '../../App';
import CustomButton from '../components/CustomButton';
import CustomTextInput from '../components/CustomTextInput';
import Loading from '../components/Loading'; // Import Loading modal
import FirebaseDB from '../firebase/FirebaseDB';
import { sizeFont, sizeWidth } from '../utils/Size';
import { COLORS, FONTS, SCREENS, STRINGS } from '../utils/Strings';
import SetLimitModal from '../components/SetLimitModal';

interface Props {
  navigation: any;
}

const JoinSpace: FC<Props> = ({ navigation }) => {
  const [code, setCode] = useState<string>('')
  const [isJoinButtonDisabled, setJoinButtonDisabled] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSetLimitVisible, setIsSetLimitVisible] = useState<boolean>(false)
  const [limit, setLimit] = useState<number>(2)

  useEffect(() => {
    setJoinButtonDisabled(!code)
  }, [code])

  // useEffect(() => {
  //   if (storage.getString(STRINGS.MMKV.Code)) {
  //     navigation.navigate(SCREENS.TalkSpace)
  //   }
  // }, [])

  const handleSetLimitButtonPress = (limit: number) => {
    FirebaseDB.setJoinLimit(limit)
    ToastAndroid.show(STRINGS.SpaceCreated, ToastAndroid.SHORT)
    setCode('')
    navigation.navigate(SCREENS.TalkSpace)
  }

  const joinButtonPress = async () => {
    setIsLoading(true)

    const result = await FirebaseDB.joinOrCreateSpace(code);
    // storage.set('lastActive', '')

    if (result === 'joined') {
      storage.set(STRINGS.MMKV.Code, code)
      setCode('')
      ToastAndroid.show(STRINGS.SpaceJoined, ToastAndroid.SHORT)
      navigation.navigate(SCREENS.TalkSpace)
    } else if (result === 'created') {
      storage.set(STRINGS.MMKV.Code, code)
      setIsSetLimitVisible(true)
    } else if (result === 'full') {
      setCode('')
      ToastAndroid.show(STRINGS.SpaceFull, ToastAndroid.SHORT)
    } else {
      ToastAndroid.show(STRINGS.Failed, ToastAndroid.SHORT)
    }
    setIsLoading(false)
  }

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.titleText}>{STRINGS.CreateOrJoin}</Text>
      <View style={styles.joinSpaceContainer}>
        <View style={styles.joinSpaceView}>
          <CustomTextInput
            placeholder={'Enter Code'}
            maxLength={10}
            onChangeText={(value: string) => setCode(value)}
            value={code}
            onSubmitEditing={joinButtonPress}
          />
          <CustomButton
            buttonText={'Join'}
            activeOpacity={0.7}
            onPress={joinButtonPress}
            disabled={isJoinButtonDisabled}
            buttonStyle={isJoinButtonDisabled ? { backgroundColor: COLORS.Gray } : { backgroundColor: COLORS.Deep_Purple }}
          />
        </View>
      </View>
      {isSetLimitVisible && <SetLimitModal visible={isSetLimitVisible} handleSetLimitButtonPress={handleSetLimitButtonPress} />}
      {isLoading && <Loading visible={isLoading} />}
    </View>
  );
};

export default JoinSpace;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.Deep_Purple,
  },
  titleText: {
    fontFamily: FONTS.Mont_Bold,
    color: COLORS.White,
    fontSize: sizeFont(6),
    textAlign: 'center',
    marginTop: sizeWidth(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinSpaceContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinSpaceView: {
    backgroundColor: COLORS.White,
    padding: sizeWidth(4),
    borderRadius: 30,
    width: sizeWidth(80),
    justifyContent: 'center',
  },
  joinSpaceViewText: {
    fontFamily: FONTS.Mont_Bold,
    color: COLORS.Deep_Purple,
    fontSize: sizeFont(5.5),
    textAlign: 'center',
  },
});
