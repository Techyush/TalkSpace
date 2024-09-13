import React, { useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { sizeWidth } from '../utils/Size';
import CustomButton from './CustomButton';
import CustomTextInput from './CustomTextInput';

interface SetLimitProps {
    visible: boolean,
    handleSetLimitButtonPress: (limit: number) => void,
}

const SetLimitModal: React.FC<SetLimitProps> = ({ visible, handleSetLimitButtonPress }) => {

    const [limit, setLimit] = useState<number>(2)

    const handlePress = () => {
        handleSetLimitButtonPress(limit)
    }

    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={visible}
        >
            <View style={styles.modalBackground}>
                <View style={styles.container}>
                    {/* <Text>Set Limit</Text> */}
                    <CustomTextInput
                        placeholder={'Set Limit'}
                        maxLength={1}
                        onChangeText={(value: number) => setLimit(value)}
                        value={limit}
                        style={{ width: sizeWidth(45) }}
                        onSubmitEditing={handlePress}
                        keyboardType='numeric'
                    />
                    <CustomButton
                        buttonText={'Set'}
                        activeOpacity={0.7}
                        buttonStyle={{ width: sizeWidth(50) }}
                        buttonTextStyle={{ padding: 0 }}
                        onPress={handlePress}
                    // disabled={isJoinButtonDisabled}
                    // buttonStyle={isJoinButtonDisabled ? { backgroundColor: COLORS.Gray } : { backgroundColor: COLORS.Deep_Purple }}
                    />
                </View>
            </View>
        </Modal>
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
});

export default SetLimitModal;
