import React, { FC, useEffect, useRef, useState } from 'react'
import { AppState, AppStateStatus, BackHandler, FlatList, Image, Pressable, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'

import { getDatabase } from '@react-native-firebase/database'

import { NickNameGenerator, storage } from '../../App'
import FirebaseDB from '../firebase/FirebaseDB'

import CustomTextInput from '../components/CustomTextInput'
import Loading from '../components/Loading'
import SetLimitModal from '../components/SetLimitModal'

import { sizeFont, sizeWidth } from '../utils/Size'
import { COLORS, FONTS, IMAGES, SCREENS, STRINGS } from '../utils/Strings'

interface Props {
    navigation: any,
}

const TalkSpace: FC<Props> = ({ navigation }) => {

    const [message, setMessage] = useState<any>()
    const [showMessage, setShowMessage] = useState<any[]>([])
    const [showNickname, setShowNickname] = useState<any>()
    const [isSetLimitVisible, setIsSetLimitVisible] = useState<boolean>(false)
    const [currentlyJoinedNum, setCurrentlyJoinedNum] = useState<number | null>(null)
    const [joinLimitNum, setJoinLimitNum] = useState<number | null>(null)
    const [isClearChatBool, setClearChatBool] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [nickname, setNickname] = useState<string>('')
    const [hasNavigated, setHasNavigated] = useState(false)
    const [toggledMessageId, setToggledMessageId] = useState(null)

    const chatLimitDB = storage.getNumber(STRINGS.MMKV.ChatLimit)
    const code = storage.getString(STRINGS.MMKV.Code)
    const appState = useRef(AppState.currentState)
    const nicknameDB = storage.getString(STRINGS.MMKV.NickName)

    // ------------------------------ Firebase Data Fetching starts ------------------------------

    useEffect(() => {
        const messagesRef = getDatabase().ref(`/spaces/${code}/messages`)
        messagesRef.on('value', (snapshot) => {
            const data = snapshot.val()
            if (data) {
                const messagesArray = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                }))

                const sortedMessages = messagesArray.sort((a, b) => b.id - a.id)
                const messagesToShow = sortedMessages.slice(0, chatLimitDB)
                setShowMessage(messagesToShow)
            }
        })

        return () => messagesRef.off('value')
    }, [])

    useEffect(() => {
        getDatabase().ref(`/spaces/${code}/lastMessageSentBy`)
            .on('value', snapshot => {
                setShowNickname(snapshot.val())
            })
    }, [showNickname])

    useEffect(() => {
        getDatabase().ref(`/spaces/${code}/clearChatOnLeavingSpace`)
            .on('value', snapshot => {
                setClearChatBool(snapshot.val())
            })
    }, [isClearChatBool])

    useEffect(() => {
        getDatabase().ref(`/spaces/${code}/currentlyJoined`)
            .on('value', snapshot => {
                setCurrentlyJoinedNum(snapshot.val())
            })
    }, [currentlyJoinedNum])

    useEffect(() => {
        getDatabase().ref(`/spaces/${code}/joinLimit`)
            .on('value', snapshot => {
                setJoinLimitNum(snapshot.val())
            })
    }, [joinLimitNum])

    useEffect(() => {
        const spaceRef = getDatabase().ref(`/spaces/${code}/`)
        spaceRef.on('value', snapshot => {
            if (snapshot.exists()) {
                // console.log('Space exists')
            } else {
                if (!hasNavigated) {
                    setHasNavigated(true)
                    if (navigation.canGoBack()) {
                        ToastAndroid.show('Space Got Destroyed', ToastAndroid.SHORT)
                        navigation.goBack()
                    } else {
                        navigation.navigate(SCREENS.JoinSpace)
                    }
                }
            }
        })

        return () => {
            spaceRef.off('value')
        }
    }, [hasNavigated, navigation])

    // ------------------------------ Firebase Data Fetching Ends ------------------------------

    // ------------------------------ App State Handling Starts --------------------------------

    const handleBackButtonClick = () => {
        setIsLoading(true)
        if (navigation.canGoBack()) {
            navigation.goBack()
        } else {
            navigation.navigate(SCREENS.JoinSpace)
        }
        clearChat()
        FirebaseDB.updateLimit(code, false)
        setIsLoading(false)
        return true
    }

    const clearChat = () => {
        if (isClearChatBool) {
            FirebaseDB.clearChat(code)
        }
    }

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick)
        return () => {
            BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick)
        }
    }, [navigation])

    useEffect(() => {
        const handleAppStateChange = async (nextAppState: AppStateStatus) => {
            if (appState.current.match(/active/) && nextAppState === 'background') {
                console.log('App is going to the background')
                FirebaseDB.updateLimit(code, false)
                clearChat()
                if (navigation.canGoBack()) {
                    navigation.goBack()
                } else {
                    navigation.navigate(SCREENS.JoinSpace)
                }
            } else if (appState.current.match(/background/) && nextAppState === 'active') {
                console.log('App has come back to the foreground')
                FirebaseDB.updateLimit(code, true)
                clearChat()
                if (navigation.canGoBack()) {
                    navigation.goBack()
                } else {
                    navigation.navigate(SCREENS.JoinSpace)
                }
            }
            appState.current = nextAppState
        }

        const subscription = AppState.addEventListener('change', handleAppStateChange)

        return () => {
            subscription.remove()
        }
    }, [navigation])

    // ------------------------------ App State Handling Ends ---------------------------------

    // ------------------------------ Nickname Generation Starts ------------------------------

    useEffect(() => {
        if (nicknameDB) {
            setNickname(nicknameDB)
        } else {
            NickNameGenerator()
        }
    }, [])

    // ------------------------------ Nickname Generation Ends ----------------------------------

    // ------------------------------ Handling Press Events Starts ------------------------------

    const handleSetLimitButtonPress = async (limit: number) => {
        if (limit > 50) {
            ToastAndroid.show("Maximum Limit is 50", ToastAndroid.LONG)
        } else {
            const result = await FirebaseDB.setJoinLimit(limit)
            if (result) {
                ToastAndroid.show("Limit has been updated", ToastAndroid.SHORT)
                setJoinLimitNum(limit)
                setIsSetLimitVisible(false)
            } else {
                ToastAndroid.show("Currently joined people exceed the new limit", ToastAndroid.LONG)
            }
        }
    }

    const handleCloseModal = () => {
        setIsSetLimitVisible(false)
    }

    const handleDeleteSpaceButtonPress = async () => {
        setIsLoading(true)
        try {
            await FirebaseDB.deleteSpace(code)

            if (!hasNavigated) {
                setHasNavigated(true)
                if (navigation.canGoBack()) {
                    navigation.goBack()
                } else {
                    navigation.navigate(SCREENS.JoinSpace)
                }
            }
        } catch (error) {
            console.error("Error deleting space:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleClearChatToggle = async () => {
        await FirebaseDB.clearChatToggle(code)
        if (!isClearChatBool) {
            ToastAndroid.show('Chat will be cleared on leaving', ToastAndroid.SHORT)
        }
    }

    const sendButtonPress = () => {
        if (message === '') {
            ToastAndroid.show(`Can't send empty message`, ToastAndroid.SHORT)
        } else {
            setMessage('')
            FirebaseDB.sendMessagesToChat(code, message, nickname)
        }
    }

    // ------------------------------ Handling Press Events Ends ------------------------------

    // ------------------------------ Handling Flatlist Events Starts -------------------------

    const toggleSentOn = (id: any) => {
        setToggledMessageId(toggledMessageId === id ? null : id)
    }

    return (
        <View style={styles.mainContainer}>
            <View style={styles.optionsView}>
                <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                    <TouchableOpacity style={styles.backIconButton} activeOpacity={0.7} onPress={() => handleBackButtonClick()}>
                        <Image source={IMAGES.Back} style={styles.backIcon} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.optionIconButton} activeOpacity={0.7} onPress={() => handleClearChatToggle()}>
                    <Image source={isClearChatBool ? IMAGES.Clean : IMAGES.CleanEmpty} style={styles.optionIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionIconButton} activeOpacity={0.7} onPress={() => setIsSetLimitVisible(true)}>
                    <Image source={IMAGES.Users} style={styles.optionIcon} />
                    <Text style={styles.joinStatusText}>{currentlyJoinedNum}/{joinLimitNum}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionIconButton} activeOpacity={0.7} onPress={() => handleDeleteSpaceButtonPress()}>
                    <Image source={IMAGES.Delete} style={styles.optionIcon} />
                </TouchableOpacity>
            </View>
            <View style={styles.chatTextContainer}>
                {showMessage.length > 0 ? (
                    <FlatList
                        data={showMessage}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <Pressable onPress={() => toggleSentOn(item.id)}>
                                <View style={item.sentBy === nickname ? styles.messageContainerRight : styles.messageContainer}>
                                    <Text style={item.sentBy === nickname ? styles.nicknameTextRight : styles.nicknameText}>{item.sentBy === nickname ? 'YOU' : item.sentBy}</Text>
                                    <Text style={item.sentBy === nickname ? styles.chatTextRight : styles.chatText}>{item.message}</Text>
                                </View>
                                {toggledMessageId === item.id && (
                                    <Text style={item.sentBy === nickname ? styles.sentOnTextRight : styles.sentOnText}>{item.sentOn}</Text>
                                )}
                            </Pressable>
                        )}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        inverted
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={styles.emptyChatText}>It's so empty here, Start Chatting!</Text>
                    </View>
                )}
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
                    placeholderTextColor={COLORS.Light_Gray}
                />
            </View>
            {isSetLimitVisible && <SetLimitModal visible={isSetLimitVisible} handleSetLimitButtonPress={handleSetLimitButtonPress} onClose={handleCloseModal} />}
            {isLoading && <Loading visible={isLoading} />}

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
    optionsView: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: sizeWidth(1),
        marginBottom: sizeWidth(-1),
        marginStart: sizeWidth(3)
    },
    optionIconButton: {
        width: sizeWidth(13),
        height: sizeWidth(13),
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginHorizontal: sizeWidth(2),
    },
    optionIcon: {
        width: sizeWidth(7.5),
        height: sizeWidth(7.5),
        resizeMode: 'contain',
        tintColor: COLORS.White,
    },
    backIconButton: {
        width: sizeWidth(13),
        height: sizeWidth(13),
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    backIcon: {
        width: sizeWidth(6),
        height: sizeWidth(6),
        resizeMode: 'contain',
        tintColor: COLORS.White,
    },
    joinStatusText: {
        fontFamily: FONTS.Mont_Bold,
        color: COLORS.White,
        marginHorizontal: sizeWidth(1),
        fontSize: sizeFont(3.5)
    },
    chatTextContainer: {
        flex: 1,
        backgroundColor: COLORS.White,
        margin: sizeWidth(3),
        padding: sizeWidth(3),
        borderRadius: 25,
    },
    textViewContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.Deep_Purple,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: COLORS.White,
    },
    textInput: {
        flex: 1,
        fontSize: sizeFont(4),
        fontFamily: FONTS.Mont_SemiBold,
        color: COLORS.White,
    },
    nicknameView: {
        marginTop: sizeWidth(2)
    },
    sendButtonStyle: {
        marginEnd: sizeWidth(4),
        tintColor: COLORS.White,
    },
    messageContainer: {
        paddingVertical: 10,
        paddingEnd: 20,
        paddingStart: 10,
        backgroundColor: COLORS.Purple,
        marginVertical: 5,
        maxWidth: sizeWidth(80),
        alignSelf: 'flex-start',
        borderRadius: 20,
    },
    messageContainerRight: {
        paddingVertical: 10,
        paddingEnd: 10,
        paddingStart: 20,
        backgroundColor: COLORS.Light_Purple,
        marginVertical: 5,
        borderRadius: 20,
        maxWidth: sizeWidth(80),
        alignSelf: 'flex-end'
    },
    chatText: {
        fontFamily: FONTS.Mont_SemiBold,
        color: COLORS.White,
        fontSize: sizeFont(4.3),
        textAlign: 'left',
    },
    chatTextRight: {
        fontFamily: FONTS.Mont_SemiBold,
        color: COLORS.White,
        fontSize: sizeFont(4.3),
    },
    nicknameText: {
        fontFamily: FONTS.Mont_Regular,
        color: COLORS.Light_Gray,
        fontSize: sizeFont(3),
        textAlign: 'left',
    },
    nicknameTextRight: {
        fontFamily: FONTS.Mont_Regular,
        color: COLORS.Light_Gray,
        fontSize: sizeFont(3),
        textAlign: 'right',
    },
    sentOnText: {
        color: COLORS.Dark_Gray,
        fontFamily: FONTS.Mont_SemiBold,
        fontSize: sizeFont(3),
        marginStart: sizeWidth(3),
    },
    sentOnTextRight: {
        color: COLORS.Dark_Gray,
        fontFamily: FONTS.Mont_SemiBold,
        fontSize: sizeFont(3),
        textAlign: 'right',
        marginEnd: sizeWidth(3),
    },
    itemSeparatorComponent: {
        backgroundColor: COLORS.Deep_Purple,
        height: sizeWidth(0.3),
        width: sizeWidth(5),
        borderRadius: 100
    },
    itemSeparatorComponentRight: {
        backgroundColor: COLORS.Deep_Purple,
        height: sizeWidth(0.3),
        width: sizeWidth(5),
        borderRadius: 100
    },
    emptyChatText: {
        fontFamily: FONTS.Mont_SemiBold,
        color: COLORS.Black,
        fontSize: sizeFont(4.3),
        textAlign: 'center',
    },
})
