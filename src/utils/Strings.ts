export const SCREENS = {
    JoinSpace: 'Join Space Screen',
    TalkSpace: 'Talk Space Screen',
}

export const COLORS = {
    Yellow: '#FFD51D',
    Dark_Yellow: '#EFC303',
    Black: '#000000',
    Dark_Green: '#006940',
    Green: '#03BF76',
    Red: '#ef5350',
    White: '#FFF',
    Dark_Gray: '#424242',
    Light_Gray: '#bdbdbd',
    Gray: '#757575',
    Deep_Purple: '#4527a0',
    Purple: '#4527a0',
    Light_Purple: '#7757d6',
    Blue: '#1565c0',
    Teal: '#00695c',
    Orange: '#ff8f00',
}

export const STRINGS = {
    //For JoinSpace Screen
    CreateOrJoin: 'CREATE OR JOIN SPACE',
    SpaceJoined: 'Space Joined',
    SpaceCreated: 'Space Created',
    SpaceFull: 'Space is full, You can not join',
    Failed: 'Failed Create or Join the space',
    CreateNickname: `*Open Setting to Create Nickname or 
    It'll be Generated😉 `,

    //For TalkSpace Screen
    PlaceHolder: 'Write a message',

    //For Settings Modal
    SettingModalTitle: 'SETTINGS',
    SetLimit: 'SET MESSAGE LIMIT',
    ClearChat: 'CLEAR CHAT ON LEAVING SPACE',

    //For MMKV Storage
    MMKV: {
        Code: 'SpaceCode',
        AppState: 'CurrentAppState',
        HasSeenIntro: 'HasSeenIntro',
        NickName: 'Nickname',
        ChatLimit: 'ChatLimit',
        ClearChat: 'ClearChatOnLeavingSpace'
    },

    DefaultMessage: `👋 Welcome to Your Private Chat Space!

You've entered a secure, private space where you can chat freely. Please keep these important points in mind:

🔒 This space is private, and for your safety, only ONE MESSAGE will be visible at a time.

🏠 If you click Back, Home or open your Recent apps you'll automatically leave the space to protect your privacy. You'll need to join again if you want to continue chatting.

👥 The default space allows up to two participants, but you can increase this limit if needed.

🗑️ You can easily delete this space when you're done chatting to keep things clean and secure.

Start Chatting 😊👇    


- Made with 🧠 by AD`,

}

export const FONTS = {
    Mont_Regular: 'Montserrat-Regular',
    Mont_Italic: 'Montserrat-Italic',
    Mont_Light: 'Montserrat-Light',
    Mont_Bold: 'Montserrat-Bold',
    Mont_BoldItalic: 'Montserrat-BoldItalic',
    Mont_SemiBold: 'Montserrat-SemiBold',
    Andrea_Regular: 'Andrea-Bellarosa-Regular',
}

export const IMAGES = {
    Send: require('../resources/images/send.png'),
    SetLimit: require('../resources/images/adjust_limit.png'),
    Delete: require('../resources/images/delete.png'),
    Users: require('../resources/images/users.png'),
    Nickname: require('../resources/images/nickname.png'),
    Close: require('../resources/images/close.png'),
    Setting: require('../resources/images/settings.png'),
    Reload: require('../resources/images/reload.png'),
    Chat: require('../resources/images/chat.png'),
    Plus: require('../resources/images/plus.png'),
    Minus: require('../resources/images/minus.png'),
    Back: require('../resources/images/back.png'),
    Checked: require('../resources/images/checkFilled.png'),
    Unchecked: require('../resources/images/checkUnfilled.png'),
    Clean: require('../resources/images/clean.png'),
    CleanEmpty: require('../resources/images/cleanEmpty.png'),
}