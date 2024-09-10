import { StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { COLORS, FONTS, SCREENS, STRINGS } from '../utils/Strings'
import { sizeFont, sizeWidth } from '../utils/Size'
import CustomTextInput from '../components/CustomTextInput'
import CustomButton from '../components/CustomButton'
import FirebaseDB from '../firebase/FirebaseDB'
import { storage } from '../../App'

interface Props {
  navigation: any,
}

const JoinSpace: FC<Props> = ({ navigation }) => {

  const [code, setCode] = useState<any>()
  const [isJoinButtonDisabled, setJoinButtonDisabled] = useState<boolean>(true)

  useEffect(() => {
    if (code) {
      setJoinButtonDisabled(false)
    } else {
      setJoinButtonDisabled(true)
    }
  }, [code])

  const joinButtonPress = async () => {
    const result = await FirebaseDB.joinOrCreateSpace(code)
    if (result === "joined") {
      storage.set(STRINGS.MMKV.Code, code)
      ToastAndroid.show(STRINGS.SpaceJoined, ToastAndroid.SHORT)
      navigation.navigate(SCREENS.TalkSpace)
    } else if (result === "created") {
      storage.set(STRINGS.MMKV.Code, code)
      ToastAndroid.show(STRINGS.SpaceCreated, ToastAndroid.SHORT)
      navigation.navigate(SCREENS.TalkSpace)
    } else if (result === "full") {
      ToastAndroid.show(STRINGS.SpaceFull, ToastAndroid.SHORT)
    } else {
      ToastAndroid.show(STRINGS.Failed, ToastAndroid.SHORT)
    }
  }

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.titleText}>{STRINGS.CreateOrJoin}</Text>
      <View style={styles.joinSpaceContainer}>
        <View style={styles.joinSpaceView}>
          <CustomTextInput
            placeholder={'Enter Code'}
            maxLength={10}
            onChangeText={(value: any) => setCode(value)}
            value={code}
            onSubmitEditing={() => joinButtonPress()}
          />
          <CustomButton
            buttonText={'Join'}
            activeOpacity={0.7}
            onPress={() => joinButtonPress()}
            disabled={isJoinButtonDisabled}
            buttonStyle={isJoinButtonDisabled ? { backgroundColor: COLORS.Gray } : { backgroundColor: COLORS.Deep_Purple }}

          />
        </View>
      </View>
    </View>
  )
}

export default JoinSpace

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
})