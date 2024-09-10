import { AppState, AppStateStatus, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { COLORS, FONTS, IMAGES, STRINGS } from '../utils/Strings'
import { sizeFont, sizeWidth } from '../utils/Size'
import CustomTextInput from '../components/CustomTextInput'
import FirebaseDB from '../firebase/FirebaseDB'
import { storage } from '../../App'
import { getDatabase } from '@react-native-firebase/database'

const TalkSpace = () => {

    const [message, setMessage] = useState<any>()
    const [showMessage, setShowMessage] = useState<any>()
    const code = storage.getString(STRINGS.MMKV.Code)
    const appState = useRef(AppState.currentState)

    useEffect(() => {
        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            if (appState.current.match(/active/) && nextAppState === 'background') {
                FirebaseDB.updateLimit(code)
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
            <View style={styles.chatTextContainer}>
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }} showsVerticalScrollIndicator={false}>
                    {showMessage ? (
                        <Text style={styles.chatText}>
                            {showMessage}
                        </Text>
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
    )
}

export default TalkSpace

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: COLORS.Deep_Purple,
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
        color: COLORS.Gray,
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