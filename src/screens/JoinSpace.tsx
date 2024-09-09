import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { COLORS, FONTS, STRINGS } from '../utils/Strings'
import { sizeFont, sizeWidth } from '../utils/Size'
import CustomTextInput from '../components/CustomTextInput'
import CustomButton from '../components/CustomButton'

const JoinSpace = () => {
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.titleText}>{STRINGS.CreateOrJoin}</Text>
      <View style={styles.joinSpaceContainer}>
        <View style={styles.joinSpaceView}>
          <Text style={styles.joinSpaceViewText}>{STRINGS.EnterCode}</Text>
          <CustomTextInput
            placeholder={'Enter Code'}
            maxLength={7}
          />
          <CustomButton
            buttonText={'Join'}
            activeOpacity={0.7}
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
    marginTop: sizeWidth(4),
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