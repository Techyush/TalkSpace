import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../utils/Strings';
import ReactNativeModal from 'react-native-modal';

interface LoadingProps {
    visible: boolean;
}

const Loading: React.FC<LoadingProps> = ({ visible }) => {
    return (
        <ReactNativeModal
            animationIn="fadeIn"
            animationOut="fadeOut"
            isVisible={visible}
            style={{ margin: 0 }}
        >
            <View style={styles.modalBackground}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.Deep_Purple} />
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
    loadingContainer: {
        padding: 30,
        backgroundColor: '#fff',
        borderRadius: 25,
        alignItems: 'center',
    },
});

export default Loading;
