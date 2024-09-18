import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { storage } from '../../App'
import { sizeFont, sizeWidth } from '../utils/Size'
import { COLORS, FONTS, STRINGS } from '../utils/Strings'
import CustomButton from './CustomButton'
import ReactNativeModal from 'react-native-modal'
import { animals, colors, uniqueNamesGenerator } from 'unique-names-generator'

const IntroPopupModal = () => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const checkFirstLaunch = () => {
            try {
                const hasSeenIntro = storage.getBoolean(STRINGS.MMKV.HasSeenIntro)
                if (!hasSeenIntro) {
                    setIsVisible(true)
                }
            } catch (error) {
                console.error('Error checking intro status:', error)
            }
        }
        checkFirstLaunch()
    }, [])

    const handleClose = () => {
        storage.set(STRINGS.MMKV.HasSeenIntro, true)
        setIsVisible(false)
    }

    return (
        <ReactNativeModal
            isVisible={isVisible}
            onBackButtonPress={handleClose}
            onBackdropPress={handleClose}
            animationIn="fadeIn"
            animationInTiming={500}
            animationOutTiming={500}
            animationOut="fadeOut"
            style={{ margin: 0 }}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Text style={styles.introMessage}>
                        🌟 Welcome to TalkSpace! 🌟{'\n\n'}
                        This app is designed for seamless and secure conversations.{'\n\n'}
                        🔐 Create a unique and hard-to-guess space code to ensure that only those you invite can join.{'\n\n'}
                        🛠️ You'll learn more about the app's features and how it works when you create your first space.{'\n\n'}
                        Enjoy your private chats and stay connected with peace of mind! 😊
                    </Text>
                    <CustomButton
                        buttonText={'Got it'}
                        activeOpacity={0.7}
                        buttonStyle={{ width: sizeWidth(50) }}
                        buttonTextStyle={{ padding: 0 }}
                        onPress={handleClose}
                    />
                </View>
            </View>
        </ReactNativeModal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: sizeWidth(90),
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 25,
        alignItems: 'center',
    },
    introMessage: {
        fontSize: sizeFont(4),
        fontFamily: FONTS.Mont_SemiBold,
        marginBottom: 20,
        textAlign: 'left',
        color: COLORS.Gray,
    },
});

export default IntroPopupModal;
