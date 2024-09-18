import PropTypes from 'prop-types'
import React, { FC } from 'react'
import { Image, Pressable, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import { COLORS, FONTS } from '../utils/Strings'
import { sizeFont, sizeWidth } from '../utils/Size'

interface props {
    rightIconSource?: any,
    leftIconSource?: any,
    placeholder?: any,
    style?: any,
    secureTextEntry?: boolean,
    returnKeyType?:
    'done' | 'go' | 'next' | 'search' | 'send' | //Basic
    'none' | 'previous' | //Android
    'default' | 'google' | 'join' | 'route' | 'yahoo' | 'emergency-call', //IOS
    value?: any,
    onChangeText?: any,
    onSubmitEditing?: any,
    inputRef?: any,
    placeholderTextColor?: any,
    maxLength?: number,
    keyboardType?:
    'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad' | 'url' | //Android
    'ascii-capable' | 'numbers-and-punctuation' | 'name-phone-pad' | 'twitter' | 'web-search', //IOS
    autoCorrect?: boolean,
    error?: any,
    customButton?: any,
    autoFocus?: boolean,
    multiline?: boolean,
    dualTextInput?: any,
    onBlur?: any,
    rightIconStyle?: any,
    rightIconPress?: any,
    textViewContainerStyle?: any,
}

const CustomTextInput: FC<props> = ({
    rightIconSource,
    leftIconSource,
    placeholder,
    style,
    secureTextEntry = false,
    returnKeyType = 'done',
    value,
    onChangeText,
    onSubmitEditing,
    inputRef,
    placeholderTextColor,
    maxLength,
    keyboardType,
    autoCorrect,
    error,
    customButton,
    autoFocus,
    multiline,
    dualTextInput,
    onBlur,
    rightIconStyle,
    rightIconPress,
    textViewContainerStyle
}) => {
    return (
        <View style={styles.container}>
            <View style={[styles.textView, textViewContainerStyle]}>
                {leftIconSource ? (<Image source={leftIconSource} style={styles.icon} />) : null}
                {
                    dualTextInput ? (
                        dualTextInput
                    ) : null
                }
                <TextInput
                    placeholder={placeholder}
                    style={[styles.textInput, style]}
                    secureTextEntry={secureTextEntry}
                    returnKeyType={returnKeyType}
                    value={value}
                    onChangeText={onChangeText}
                    onSubmitEditing={onSubmitEditing}
                    ref={inputRef}
                    placeholderTextColor={placeholderTextColor}
                    maxLength={maxLength}
                    keyboardType={keyboardType}
                    autoCorrect={autoCorrect}
                    autoFocus={autoFocus}
                    multiline={multiline}
                    onBlur={onBlur}
                />
                {
                    rightIconSource ? (
                        <TouchableOpacity style={{ alignSelf: 'center' }} activeOpacity={0.7} onPress={rightIconPress}>
                            <Image source={rightIconSource} style={[styles.icon, rightIconStyle]} />
                        </TouchableOpacity>
                    ) : null
                }
                {
                    customButton ? (
                        <View style={{ position: 'absolute', right: 0, bottom: 0 }}>
                            {customButton}
                        </View>
                    ) : null
                }
            </View>
            {error ? (<Text style={styles.error} numberOfLines={3}>{error}</Text>) : null}
        </View>
    )
}

CustomTextInput.propTypes = {
    placeholder: PropTypes.any,
    style: PropTypes.any,
    secureTextEntry: PropTypes.bool,
    returnKeyType: PropTypes.any,
    value: PropTypes.any,
    onChangeText: PropTypes.any,
    onSubmitEditing: PropTypes.any,
    inputRef: PropTypes.any,
    placeholderTextColor: PropTypes.any,
    maxLength: PropTypes.number,
    keyboardType: PropTypes.any,
    rightIconSource: PropTypes.any,
    leftIconSource: PropTypes.any,
    autoCorrect: PropTypes.bool,
    error: PropTypes.any,
    autoFocus: PropTypes.bool,
    multiline: PropTypes.bool,
    onBlur: PropTypes.any,
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    textView: {
        height: sizeWidth(18),
        backgroundColor: COLORS.White,
        marginHorizontal: 10,
        paddingStart: 10,
        justifyContent: 'center',
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#213789',
    },
    icon: {
        height: sizeWidth(7),
        width: sizeWidth(7),
        alignSelf: 'center',
        tintColor: COLORS.Deep_Purple,
        resizeMode: 'center',
    },
    textInput: {
        marginHorizontal: 10,
        fontSize: sizeFont(5),
        fontFamily: FONTS.Mont_Bold,
        color: COLORS.Black,
    },
    error: {
        color: 'red',
        fontSize: 18,
        marginHorizontal: 20,
    },
})

export default CustomTextInput