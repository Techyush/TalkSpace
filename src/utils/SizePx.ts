import { Dimensions } from 'react-native'
import DeviceInfo from "react-native-device-info"

const { width, height } = Dimensions.get('window')

const percentHeight = height / 100
const percentWidth = width / 100

let isTablet = DeviceInfo.isTablet()

// Default width and height are given based on the orientation given on the XD file
const defaultWidth = !isTablet ? 375 : 1024
const defaultHeight = !isTablet ? 812 : 768

export const sizeWidthPx = (pixels: number) => {
    const percent = pixels / (defaultWidth / 100)
    return percent * (percentWidth < percentHeight ? percentWidth : percentHeight)
}

export const sizeHeightPx = (pixels: number) => {
    const percent = pixels / (defaultHeight / 100)
    return percent * (percentWidth > percentHeight ? percentWidth : percentHeight)
}

export const sizeFontPx = (pixels: number) => {
    const percent = pixels / (defaultWidth / 100)
    return percent * (percentWidth < percentHeight ? percentWidth : percentHeight)
}

export const isPortrait = () => {
    const dim = Dimensions.get('screen')
    return dim.height >= dim.width
}

export const isLandscape = () => {
    const dim = Dimensions.get('screen')
    return dim.width >= dim.height
}

export const DEVICE_WIDTH = Dimensions.get('window').width
export const DEVICE_HEIGHT = Dimensions.get('window').height