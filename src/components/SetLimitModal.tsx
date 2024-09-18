import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { sizeWidth } from '../utils/Size';
import CustomButton from './CustomButton';
import CustomTextInput from './CustomTextInput';
import { COLORS, IMAGES } from '../utils/Strings';
import ReactNativeModal from 'react-native-modal';

interface SetLimitProps {
    visible: boolean,
    handleSetLimitButtonPress: (limit: number) => void,
    onClose: () => void,
}

const SetLimitModal: React.FC<SetLimitProps> = ({ visible, handleSetLimitButtonPress, onClose }) => {

    const [limit, setLimit] = useState<number>(2)

    const handlePress = () => {
        handleSetLimitButtonPress(limit)
    }

    return (
        <ReactNativeModal
            animationIn="fadeIn"
            animationOut="fadeOut"
            animationInTiming={500}
            animationOutTiming={500}
            isVisible={visible}
            style={{ margin: 0 }}
        >
            <View style={styles.modalBackground}>
                <View style={styles.container}>
                    <TouchableOpacity style={styles.closeIconButton} activeOpacity={0.7} onPress={onClose}>
                        <Image source={IMAGES.Close} style={styles.closeIcon} />
                    </TouchableOpacity>
                    <CustomTextInput
                        placeholder={'Set Limit'}
                        maxLength={2}
                        onChangeText={(value: number) => setLimit(value)}
                        value={limit}
                        style={{ width: sizeWidth(45) }}
                        onSubmitEditing={handlePress}
                        keyboardType='numeric'
                        placeholderTextColor={COLORS.Gray}
                    />
                    <CustomButton
                        buttonText={'Set'}
                        activeOpacity={0.7}
                        buttonStyle={{ width: sizeWidth(50) }}
                        buttonTextStyle={{ padding: 0 }}
                        onPress={handlePress}
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
    container: {
        padding: 30,
        backgroundColor: '#fff',
        borderRadius: 25,
        alignItems: 'center',
        // flexDirection: 'row',
    },
    closeIconButton: {
        width: sizeWidth(10),
        height: sizeWidth(10),
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        right: 5,
        top: 5,
        // backgroundColor: COLORS.Deep_Purple,
    },
    closeIcon: {
        width: sizeWidth(4),
        height: sizeWidth(4),
        resizeMode: 'contain',
        tintColor: COLORS.Deep_Purple,
    }
});

export default SetLimitModal;
