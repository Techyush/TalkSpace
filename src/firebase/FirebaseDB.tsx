import { getDatabase } from "@react-native-firebase/database"
export default class FirebaseDB {

    static async joinOrCreateSpace(code: any): Promise<"joined" | "created" | "failed" | "full"> {

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
                if (currentlyJoined < 2) {
                    await getDatabase().ref(`/spaces/${code}`).update({
                        lastSpaceOpenedOn: formattedDate,
                        currentlyJoined: currentlyJoined + 1,
                    })
                    return "joined"
                } else if (currentlyJoined >= 2) {
                    return "full"
                }
            } else {
                await getDatabase().ref(`/spaces/${code}`).set({
                    code: code,
                    joinLimit: 2,
                    createdOn: formattedDate,
                    message: '',
                    lastMessageSentOn: '',
                    currentlyJoined: 1,
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

    static async sendMessage(code: any, message: any): Promise<boolean> {
        const currentDate = new Date()
        const formattedDate = currentDate.getDate() + "/"
            + (currentDate.getMonth() + 1).toString().padStart(2, '0') + "/"
            + currentDate.getFullYear() + " at "
            + currentDate.getHours().toString().padStart(2, '0') + ":"
            + currentDate.getMinutes().toString().padStart(2, '0') + ":"
            + currentDate.getSeconds().toString().padStart(2, '0')

        try {
            await getDatabase().ref(`/spaces/${code}`).update({
                message: message,
                lastMessageSentOn: formattedDate,
            })
            return true
        } catch (error: any) {
            console.error('Error sending message: ', error)
            return false
        }
    }

    static async updateLimit(code: any) {
        let currentlyJoined: any
        await getDatabase().ref(`/spaces/${code}/currentlyJoined`).once('value').then(snapshot => {
            currentlyJoined = snapshot.val()
        })
        await getDatabase().ref(`/spaces/${code}`).update({
            currentlyJoined: currentlyJoined - 1,
        })
    }
}
