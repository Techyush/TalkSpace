import { getDatabase } from "@react-native-firebase/database";
import { storage } from "../../App";
import { STRINGS } from "../utils/Strings";
export default class FirebaseDB {

    static async joinOrCreateSpace(code: any): Promise<"joined" | "created" | "failed" | "full"> {

        const joinLimit = await FirebaseDB.getJoinLimit(code)

        const currentDate = new Date();
        const formattedDate = currentDate.getDate() + "/"
            + (currentDate.getMonth() + 1).toString().padStart(2, '0') + "/"
            + currentDate.getFullYear() + " at "
            + currentDate.getHours().toString().padStart(2, '0') + ":"
            + currentDate.getMinutes().toString().padStart(2, '0') + ":"
            + currentDate.getSeconds().toString().padStart(2, '0')

        try {
            const existanceResult = await FirebaseDB.checkSpaceExistance(code)
            if (existanceResult) {
                let currentlyJoined: any
                await getDatabase().ref(`/spaces/${code}/currentlyJoined`).once('value').then(snapshot => {
                    currentlyJoined = snapshot.val()
                })
                if (currentlyJoined < joinLimit) {
                    await getDatabase().ref(`/spaces/${code}`).update({
                        lastSpaceOpenedOn: formattedDate,
                        currentlyJoined: currentlyJoined + 1,
                    })
                    return "joined"
                } else if (currentlyJoined >= joinLimit) {
                    return "full"
                }
            } else {
                await getDatabase().ref(`/spaces/${code}`).set({
                    code: code,
                    joinLimit: 2,
                    createdOn: formattedDate,
                    lastMessageSentOn: '',
                    currentlyJoined: 1,
                    lastMessageSentBy: '',
                    clearChatOnLeavingSpace: false,
                })
                return "created"
            }
        } catch (error) {
            console.error("Error joining or creating space: ", error)
            return "failed"
        }

        return "failed"
    }

    static async checkSpaceExistance(code: any): Promise<boolean> {
        try {
            const snapshot = await getDatabase().ref(`/spaces/${code}`).once('value')
            return snapshot.exists()
        } catch (error) {
            console.error("Error checking space existence: ", error)
            return false
        }
    }

    static async sendMessagesToChat(code: any, message: any, nickname: any): Promise<boolean> {
        const currentDate = new Date();
        const formattedDate = currentDate.getDate() + "/"
            + (currentDate.getMonth() + 1).toString().padStart(2, '0') + "/"
            + currentDate.getFullYear() + " at "
            + currentDate.getHours().toString().padStart(2, '0') + ":"
            + currentDate.getMinutes().toString().padStart(2, '0') + ":"
            + currentDate.getSeconds().toString().padStart(2, '0');

        try {
            const messageCounterRef = getDatabase().ref(`/spaces/${code}/messageCounter`)
            const messageCounterSnapshot = await messageCounterRef.once('value')
            let messageCounter = messageCounterSnapshot.val() || 0

            messageCounter += 1

            const newMessageId = `message_${messageCounter}`

            const messageData = {
                id: messageCounter,
                message: message.trim(),
                sentOn: formattedDate,
                sentBy: nickname,
            }

            const messagesRef = getDatabase().ref(`/spaces/${code}/messages/${newMessageId}`)
            await messagesRef.set(messageData)

            await messageCounterRef.set(messageCounter)

            await getDatabase().ref(`/spaces/${code}`).update({
                lastMessageSentOn: formattedDate,
                lastMessageSentBy: nickname,
            })

            return true
        } catch (error: any) {
            console.error('Error sending message: ', error)
            return false
        }
    }

    static async updateLimit(code: any, add: boolean) {
        let currentlyJoined: any
        await getDatabase().ref(`/spaces/${code}/currentlyJoined`).once('value').then(snapshot => {
            currentlyJoined = snapshot.val()
        })
        await getDatabase().ref(`/spaces/${code}`).update({
            currentlyJoined: add ? currentlyJoined + 1 : currentlyJoined - 1,
        })
    }

    static async setJoinLimit(limit: number): Promise<boolean> {
        const code = storage.getString(STRINGS.MMKV.Code)

        const currentlyJoinedFn = await this.getCurrentlyJoined(code)

        if (currentlyJoinedFn <= limit) {
            await getDatabase().ref(`/spaces/${code}`).update({
                joinLimit: Number(limit),
            })
            return true
        } else {
            return false
        }
    }

    static async getJoinLimit(code: any) {
        const snapshot = await getDatabase().ref(`/spaces/${code}/joinLimit`).once('value')
        return snapshot.val()
    }

    static async getCurrentlyJoined(code: any) {
        const snapshot = await getDatabase().ref(`/spaces/${code}/currentlyJoined`).once('value')
        return snapshot.val()
    }

    static async getLastNickName(code: any) {
        const snapshot = await getDatabase().ref(`/spaces/${code}/lastMessageSentBy`).once('value')
        return snapshot.val()
    }

    static async clearChat(code: any) {
        const snapshot = await getDatabase().ref(`/spaces/${code}/`).once('value')
        if (snapshot.exists()) {
            await getDatabase().ref(`/spaces/${code}/messageCounter`).remove()
            await getDatabase().ref(`/spaces/${code}/messages`).remove()
        } else {
            console.log(`Space with code ${code} does not exist.`)
        }
    }

    static async clearChatToggle(code: any) {
        try {
            const snapshot = await getDatabase().ref(`/spaces/${code}/clearChatOnLeavingSpace`).once('value')
            if (snapshot.exists()) {
                const clearChatBool = snapshot.val()
                await getDatabase().ref(`/spaces/${code}/`).update({ clearChatOnLeavingSpace: !clearChatBool })
            }
        } catch (error) {
            console.error('Error toggling clearChat:', error);
        }
    }

    static async deleteSpace(code: any) {
        const snapshot = await getDatabase().ref(`/spaces/${code}/`).once('value')
        if (snapshot.exists()) {
            const spaceData = snapshot.val()
            await getDatabase().ref(`/deletedSpaces/${code}`).set(spaceData)
            await getDatabase().ref(`/spaces/${code}/`).remove()
        } else {
            console.log(`Space with code ${code} does not exist.`)
        }
    }


}
