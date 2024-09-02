import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const percentHeight = height / 100;
const percentWidth = width / 100;

export const sizeWidth = (percent: number) => {
    return percent * (percentWidth < percentHeight ? percentWidth : percentHeight);
};

export const sizeHeight = (percent: number) => {
    return percent * (percentWidth > percentHeight ? percentWidth : percentHeight);
};

export const sizeFont = (percent: number) => {
    return percent * (percentWidth < percentHeight ? percentWidth : percentHeight);
};

export const isPortrait = () => {
    const dim = Dimensions.get('screen');
    return dim.height >= dim.width;
};

export const isLandscape = () => {
    const dim = Dimensions.get('screen');
    return dim.width >= dim.height;
};

export const DEVICE_WIDTH = Dimensions.get('window').width;
export const DEVICE_HEIGHT = Dimensions.get('window').height;