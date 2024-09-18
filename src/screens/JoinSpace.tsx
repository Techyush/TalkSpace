import React, { FC, useEffect, useRef, useState } from 'react'
import { Animated, Image, Keyboard, KeyboardAvoidingView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import { NickNameGenerator, storage } from '../../App'
import CustomButton from '../components/CustomButton'
import CustomTextInput from '../components/CustomTextInput'
import IntroPopupModal from '../components/IntroPopupModal'
import Loading from '../components/Loading'
import FirebaseDB from '../firebase/FirebaseDB'
import { sizeFont, sizeWidth } from '../utils/Size'
import { COLORS, FONTS, IMAGES, SCREENS, STRINGS } from '../utils/Strings'
import SettingPopupModal from '../components/SettingPopupModal'
import { animals, colors, uniqueNamesGenerator } from 'unique-names-generator'

interface Props {
  navigation: any
}

const JoinSpace: FC<Props> = ({ navigation }) => {

  const [code, setCode] = useState<string>('')
  const [isJoinButtonDisabled, setJoinButtonDisabled] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSettingVisible, setIsSettingVisible] = useState<boolean>(false)
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)

  const titleTextAnimValue = useRef(new Animated.Value(0)).current
  const joinSpaceContainerAnimValue = useRef(new Animated.Value(0)).current
  const optionsAnimValue = useRef(new Animated.Value(0)).current

  const nicknameDB = storage.getString(STRINGS.MMKV.NickName)

  useEffect(() => {
    setJoinButtonDisabled(!code)
  }, [code])

  useEffect(() => {
    if (!nicknameDB) {
      NickNameGenerator()
    }
  }, [])

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    Animated.timing(titleTextAnimValue, {
      toValue: 1,
      useNativeDriver: true,
      duration: 600,
    }).start(() => {
      Animated.timing(joinSpaceContainerAnimValue, {
        toValue: 1,
        useNativeDriver: true,
        duration: 600,
      }).start(() => {
        Animated.timing(optionsAnimValue, {
          toValue: 1,
          useNativeDriver: true,
          duration: 600,
        }).start()
      })
    })
  }, [titleTextAnimValue])

  const titleOpacity = titleTextAnimValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  })

  const optionsOpacity = optionsAnimValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  })

  const titleTranslateY = titleTextAnimValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 0],
  })

  const containerTranslateY = joinSpaceContainerAnimValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-500, 0],
  })

  const joinButtonPress = async () => {
    setIsLoading(true)

    const result = await FirebaseDB.joinOrCreateSpace(code.trim())
    // storage.set('lastActive', '')

    if (result === 'joined') {
      storage.set(STRINGS.MMKV.Code, code)
      setCode('')
      ToastAndroid.show(STRINGS.SpaceJoined, ToastAndroid.SHORT)
      navigation.navigate(SCREENS.TalkSpace)
    } else if (result === 'created') {
      storage.set(STRINGS.MMKV.Code, code)
      ToastAndroid.show(STRINGS.SpaceCreated, ToastAndroid.SHORT)
      setCode('')
      navigation.navigate(SCREENS.TalkSpace)
    } else if (result === 'full') {
      setCode('')
      ToastAndroid.show(STRINGS.SpaceFull, ToastAndroid.SHORT)
    } else {
      ToastAndroid.show(STRINGS.Failed, ToastAndroid.SHORT)
    }
    setIsLoading(false)
  }

  const isValidFirebaseKey = (key: string): boolean => {
    const invalidCharsRegex = /[.$#[\]/\u0000-\u001F\u007F]/
    return !invalidCharsRegex.test(key) && new TextEncoder().encode(key).length <= 768
  }

  const handleCloseModal = () => {
    setIsSettingVisible(false)
  }

  return (
    <View style={styles.mainContainer}>
      <Animated.Text style={[styles.titleText, { opacity: titleOpacity, transform: [{ translateY: titleTranslateY }] }]}>{'Talk Space'}</Animated.Text>
      <Animated.View style={[styles.joinSpaceContainer, { transform: [{ translateX: containerTranslateY }] }]}>
        <View style={styles.joinSpaceView}>
          <Text style={styles.subtitleText}>{STRINGS.CreateOrJoin}</Text>
          <CustomTextInput
            placeholder={'Enter Code'}
            maxLength={10}
            onChangeText={(value: string) => {
              if (isValidFirebaseKey(value)) {
                setCode(value)
              } else {
                ToastAndroid.show("Please Avoid using ., $, #, [, ], /", ToastAndroid.LONG)
              }
            }}
            value={code}
            onSubmitEditing={joinButtonPress}
            placeholderTextColor={COLORS.Gray}
          />
          <CustomButton
            buttonText={'Join'}
            activeOpacity={0.7}
            onPress={joinButtonPress}
            disabled={isJoinButtonDisabled}
            buttonStyle={isJoinButtonDisabled ? { backgroundColor: COLORS.Gray } : { backgroundColor: COLORS.Deep_Purple }}
          />
        </View>
        {!nicknameDB ? (
          <Text style={styles.createNickNameText}>{STRINGS.CreateNickname}</Text>) : null}
      </Animated.View>
      {!isKeyboardVisible ? (
        <>
          {nicknameDB ? (
            <Animated.View style={[styles.nicknameView, { opacity: optionsOpacity }]}>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} activeOpacity={0.7} onPress={() => setIsSettingVisible(true)}>
                <Image source={IMAGES.Nickname} style={styles.optionIcon} />
                <Text style={styles.nicknameText}>{nicknameDB}</Text>
              </TouchableOpacity>
            </Animated.View>
          ) : null}
          <Animated.View style={[styles.settingIconButton, { opacity: optionsOpacity }]}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => setIsSettingVisible(true)}>
              <Image source={IMAGES.Setting} style={styles.settingIcon} />
            </TouchableOpacity>
          </Animated.View>
        </>
      ) : null}
      {isLoading && <Loading visible={isLoading} />}
      <IntroPopupModal />
      {isSettingVisible && <SettingPopupModal visible={isSettingVisible} onClose={handleCloseModal} />}
    </View>
  )
}

export default JoinSpace

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.Deep_Purple,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {
    fontFamily: FONTS.Andrea_Regular,
    color: COLORS.White,
    fontSize: sizeFont(13),
    marginTop: sizeWidth(10),
  },
  subtitleText: {
    fontFamily: FONTS.Mont_Bold,
    color: COLORS.Deep_Purple,
    fontSize: sizeFont(5),
    textAlign: 'center',
    marginVertical: sizeWidth(5),
  },
  createNickNameText: {
    textAlign: 'center',
    fontFamily: FONTS.Mont_Italic,
    color: COLORS.White,
    fontSize: sizeFont(3),
    marginTop: sizeWidth(2),
  },
  joinSpaceContainer: {
    marginTop: sizeWidth(20),
    flex: 1,
  },
  joinSpaceView: {
    backgroundColor: COLORS.White,
    padding: sizeWidth(4),
    borderRadius: 30,
    width: sizeWidth(80),
    justifyContent: 'center',
    elevation: 10,
  },
  joinSpaceViewText: {
    fontFamily: FONTS.Mont_Bold,
    color: COLORS.Deep_Purple,
    fontSize: sizeFont(5.5),
    textAlign: 'center',
  },
  nicknameView: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    position: 'absolute',
    bottom: 20,
    left: 5
  },
  settingIconButton: {
    margin: sizeWidth(5),
    alignSelf: 'flex-end',
  },
  settingIcon: {
    width: sizeWidth(8),
    height: sizeWidth(8),
    resizeMode: 'center',
    tintColor: COLORS.White,
  },
  optionIcon: {
    width: sizeWidth(6),
    height: sizeWidth(6),
    resizeMode: 'center',
    tintColor: COLORS.White,
    marginEnd: sizeWidth(2),
    marginStart: sizeWidth(2),
  },
  nicknameText: {
    fontFamily: FONTS.Mont_Bold,
    color: COLORS.White,
    fontSize: sizeFont(3.5),
  },
});

