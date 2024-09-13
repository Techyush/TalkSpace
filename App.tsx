import React from 'react'
import { MMKV } from 'react-native-mmkv'
import AppRouter from './src/routes/AppRouter'

export const storage = new MMKV()

const App = () => {

  // useEffect(() => {
  //   const checkIfAppKilled = () => {
  //     const lastActive = storage.getString('lastActive') // Get the lastActive when chat screen was opened
  //     let restartCount = storage.getNumber('restartCount') ?? 0 // Initialize with 0 on first run
  //     console.log('restartCount App log', restartCount)
  //     let code = storage.getString(STRINGS.MMKV.Code)

  //     if (lastActive) {
  //       const timeDifference = (new Date().getTime() - new Date(lastActive).getTime()) / 1000

  //       if (timeDifference > 1) { 
  //         if (restartCount === 1) {
  //           console.log('First app restart detected')
  //           storage.set('restartCount', 2)
  //           console.log('First restart, setting restartCount to 1')
  //           FirebaseDB.updateLimit(code, false)
  //           storage.delete(STRINGS.MMKV.Code)
  //         } else {
  //           console.log('App restarted again, incrementing restart count')
  //           storage.set('restartCount', restartCount + 1)
  //         }
  //       }
  //     }
  //   }

  //   checkIfAppKilled()

  // }, [])



  return (
    <AppRouter />
  )
}

export default App