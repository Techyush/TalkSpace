import { Animated, AppState, AppStateStatus, BackHandler, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import React, { FC, useEffect, useRef, useState } from 'react'
import { COLORS, FONTS, IMAGES, STRINGS } from '../utils/Strings'
import { sizeFont, sizeWidth } from '../utils/Size'
import CustomTextInput from '../components/CustomTextInput'
import FirebaseDB from '../firebase/FirebaseDB'
import { storage } from '../../App'
import { getDatabase } from '@react-native-firebase/database'


interface Props {
    navigation: any,
}

const TalkSpace: FC<Props> = ({ navigation }) => {

    const [message, setMessage] = useState<any>()
    const [showMessage, setShowMessage] = useState<any>()
    const code = storage.getString(STRINGS.MMKV.Code)
    const appState = useRef(AppState.currentState)

    // FirebaseDB.getJoinLimit(code)

    useEffect(() => {
        // const restartCount = storage.getNumber('restartCount') // Remove 0 if doesn't work like before
        // console.log('restartCount from Talk space', restartCount)

        // if (restartCount > 1) {
        //     console.log('App was restarted more than once, resetting restartCount to 0')
        //     storage.set('restartCount', 0)
        // }

        const handleBackButtonClick = () => {
            // storage.set('restartCount', 1)
            navigation.goBack()
            FirebaseDB.updateLimit(code, false)
            return true
        }

        BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick)

        return () => {
            BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick)
        }
    }, [])

    useEffect(() => {
        // storage.set('lastActive', new Date().toISOString())

        const handleAppStateChange = async (nextAppState: AppStateStatus) => {
            if (appState.current.match(/active/) && nextAppState === 'background') {
                // storage.set('restartCount', 1)
                console.log('App is going to the background')
                FirebaseDB.updateLimit(code, false)
                navigation.goBack()
            } else if (appState.current.match(/background/) && nextAppState === 'active') {
                // storage.set('restartCount', 1)
                console.log('App has come back to the foreground')
                FirebaseDB.updateLimit(code, true)
                navigation.goBack()
            }
            appState.current = nextAppState
        }

        const subscription = AppState.addEventListener('change', handleAppStateChange)

        return () => {
            subscription.remove()
        }
    }, [])

    useEffect(() => {
        getDatabase().ref(`/spaces/${code}/message`)
            .on('value', snapshot => {
                setShowMessage(snapshot.val())
            })
    }, [showMessage])

    const sendButtonPress = () => {
        if (message === '') {
            ToastAndroid.show(`Can't send empty message`, ToastAndroid.SHORT)
        } else {
            setMessage('')
            FirebaseDB.sendMessage(code, message)
        }
    }

    return (
        <View style={styles.mainContainer}>
            <View style={{ flex: 1 }}>
                <View style={styles.chatTextContainer}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end', backgroundColor: COLORS.White }} showsVerticalScrollIndicator={false}>
                        {showMessage ? (
                            <Animated.Text style={styles.chatText}>
                                {showMessage}
                            </Animated.Text>
                        ) : (
                            <Text style={styles.chatText}>
                                It's so empty here!
                            </Text>
                        )}
                    </ScrollView>
                </View>
                <View>
                    <CustomTextInput
                        placeholder={STRINGS.PlaceHolder}
                        onChangeText={(message: any) => setMessage(message)}
                        value={message}
                        style={styles.textInput}
                        multiline
                        rightIconSource={IMAGES.Send}
                        rightIconStyle={styles.sendButtonStyle}
                        rightIconPress={() => sendButtonPress()}
                        onSubmitEditing={() => sendButtonPress()}
                        textViewContainerStyle={styles.textViewContainer}
                    />
                </View>
            </View>

        </View>
    )
}

export default TalkSpace

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: COLORS.Deep_Purple,
    },
    privacyView: {
        flex: 1,
        backgroundColor: COLORS.Deep_Purple,
        alignItems: 'center',
        justifyContent: 'center',
    },
    privacyViewText: {
        fontFamily: FONTS.Mont_SemiBold,
        color: COLORS.White,
        fontSize: sizeFont(5),
    },
    chatTextContainer: {
        flex: 1,
        backgroundColor: COLORS.White,
        margin: sizeWidth(3),
        padding: sizeWidth(3),
        borderRadius: 25,
    },
    chatText: {
        fontFamily: FONTS.Mont_SemiBold,
        color: COLORS.Black,
        fontSize: sizeFont(5),
    },
    textViewContainer: {
        flexDirection: 'row',
    },
    textInput: {
        flex: 1,
        fontSize: sizeFont(4),
        fontFamily: FONTS.Mont_SemiBold,
    },
    sendButtonStyle: {
        marginEnd: sizeWidth(4)
    }
})

function showSecurityScreenFromAppState(nextAppState: string) {
    throw new Error('Function not implemented.')
}
