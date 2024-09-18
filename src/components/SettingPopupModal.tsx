import { Alert, Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import ReactNativeModal from 'react-native-modal'
import { COLORS, FONTS, IMAGES, STRINGS } from '../utils/Strings'
import { NickNameGenerator, storage } from '../../App'
import { animals, colors, uniqueNamesGenerator } from 'unique-names-generator'
import { sizeFont, sizeWidth } from '../utils/Size'

interface SettingProps {
    visible: boolean,
    onClose: () => void,
}

const SettingPopupModal: FC<SettingProps> = ({ visible, onClose }) => {

    const [nickname, setNickname] = useState<string>('dumb_panda')
    const [messageLimit, setMessageLimit] = useState<number>(5)
    const [isClearChat, setIsClearChat] = useState<boolean>(false)

    const nicknameDB = storage.getString(STRINGS.MMKV.NickName)
    const chatLimitDB = storage.getNumber(STRINGS.MMKV.ChatLimit)

    // ------------------------------ Chat Limit useEffects Starts ------------------------------

    useEffect(() => {
        if (chatLimitDB) {
            setMessageLimit(chatLimitDB)
        } else {
            setMessageLimit(10)
            storage.set(STRINGS.MMKV.ChatLimit, 10)
        }
    }, [])

    useEffect(() => {
        storage.set(STRINGS.MMKV.ChatLimit, messageLimit)
    }, [messageLimit])

    // ------------------------------ Chat Limit useEffects Ends ------------------------------

    // ------------------------------ Plus Minus Functions Starts ------------------------------

    const increaseLimit = () => {
        setMessageLimit(prevLimit => prevLimit + 1)
    }

    const decreaseLimit = () => {
        if (messageLimit > 1) {
            setMessageLimit(prevLimit => prevLimit - 1)
        }
    }

    // ------------------------------ Plus Minus Functions Ends -------------------------------

    // ------------------------------ Nickname Generation Starts ------------------------------

    useEffect(() => {
        if (nicknameDB) {
            setNickname(nicknameDB)
        } else {
            generateNewNickName()
        }
    }, [])

    const generateNewNickName = () => {
        const generatedName = NickNameGenerator()
        setNickname(generatedName)
    }

    // ------------------------------ Nickname Generation Ends ----------------------------------

    return (
        <ReactNativeModal
            animationIn="slideInUp"
            animationInTiming={500}
            animationOut={"slideInDown"}
            animationOutTiming={500}
            isVisible={visible}
            onBackButtonPress={onClose}
            onBackdropPress={onClose}
            style={styles.modalView}
        >
            <View style={styles.mainContainerView}>
                <Text style={styles.modalText}>{STRINGS.SettingModalTitle}</Text>
                <View style={styles.optionsView}>
                    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                        <Image source={IMAGES.Nickname} style={styles.optionIcon} />
                        <Text style={styles.nicknameText}>{nickname}</Text>
                        <TouchableOpacity style={[styles.optionIconButton, styles.optionIconRightButton, { flex: 1 }]} activeOpacity={0.7} onPress={() => generateNewNickName()}>
                            <Image source={IMAGES.Reload} style={styles.optionIcon} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.optionsView}>
                    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                        <Image source={IMAGES.Chat} style={styles.optionIcon} />
                        <Text style={styles.nicknameText}>{STRINGS.SetLimit}</Text>
                    </View>
                    <View style={styles.plusMinusView}>
                        <TouchableOpacity style={[styles.optionIconButton]} activeOpacity={0.7} onPress={() => decreaseLimit()}>
                            <Image source={IMAGES.Minus} style={styles.optionIcon} />
                        </TouchableOpacity>
                        <Text style={styles.messageLimitText}>{messageLimit}</Text>
                        <TouchableOpacity style={[styles.optionIconButton, styles.optionIconRightButton]} activeOpacity={0.7} onPress={() => increaseLimit()}>
                            <Image source={IMAGES.Plus} style={styles.optionIcon} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ReactNativeModal >
    )
}

export default SettingPopupModal

const styles = StyleSheet.create({
    modalView: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    mainContainerView: {
        backgroundColor: 'white',
        borderTopEndRadius: 25,
        borderTopStartRadius: 25,
        paddingTop: 20,
        alignItems: 'center',
        elevation: 5,
        paddingBottom: 10,
    },
    modalText: {
        marginBottom: sizeWidth(5),
        textAlign: 'center',
        fontFamily: FONTS.Mont_Bold,
        fontSize: sizeFont(4.5),
        color: COLORS.Gray,
    },
    optionsView: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: sizeWidth(1),
        marginStart: sizeWidth(3)
    },
    optionIconButton: {
        width: sizeWidth(13),
        height: sizeWidth(13),
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionIconRightButton: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginEnd: sizeWidth(3),
        alignItems: 'center'
    },
    optionIcon: {
        width: sizeWidth(6),
        height: sizeWidth(6),
        resizeMode: 'center',
        tintColor: COLORS.Deep_Purple,
        marginEnd: sizeWidth(2),
        marginStart: sizeWidth(2),
    },
    nicknameText: {
        fontFamily: FONTS.Mont_Bold,
        color: COLORS.Black,
        marginHorizontal: sizeWidth(1),
        fontSize: sizeFont(3.5),
        justifyContent: 'center'
    },
    plusMinusView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    messageLimitText: {
        fontFamily: FONTS.Mont_Bold,
        color: COLORS.Black,
        marginHorizontal: sizeWidth(1),
        fontSize: sizeFont(4),
        textAlign: 'center',
    },
})