import React, { FC } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { sizeFont, sizeWidth } from '../utils/Size'
import { COLORS, FONTS } from '../utils/Strings'

interface props {
    buttonStyle?: any,
    buttonText?: any,
    buttonTextStyle?: any,
    onPress?: any,
    ref?: any
    activeOpacity?: any,
}

const CustomButton: FC<props> = ({
    buttonStyle,
    buttonText,
    buttonTextStyle,
    activeOpacity,
    onPress,
    ref,
}) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.buttonContainer, buttonStyle]}
                onPress={onPress}
                ref={ref}
                activeOpacity={activeOpacity}
            >
                <Text style={[styles.buttonText, buttonTextStyle]}>{buttonText}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default CustomButton

const styles = StyleSheet.create({
    container: {
        marginHorizontal: sizeWidth(3),
        marginVertical: sizeWidth(2),
    },
    buttonContainer: {
        backgroundColor: COLORS.Deep_Purple,
        justifyContent: 'center',
        borderRadius: 20,
        elevation: 3,
    },
    buttonText: {
        textAlign: 'center',
        color: COLORS.White,
        fontFamily: FONTS.Mont_Bold,
        fontSize: sizeFont(5),
        marginVertical: sizeWidth(3),
    }
})