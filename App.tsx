import { View, Text, AppState } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import AppRouter from './src/routes/AppRouter'
import { MMKV } from 'react-native-mmkv'
import { STRINGS } from './src/utils/Strings'

export const storage = new MMKV()

const App = () => {

  const appState = useRef(AppState.currentState)
  const [appStateVisible, setAppStateVisible] = useState(appState.current)

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      appState.current = nextAppState
      setAppStateVisible(appState.current)
      console.log('AppState', appState.current)
      storage.set(STRINGS.MMKV.AppState, appState.current)
    })

    return () => {
      subscription.remove()
    }
  }, [])

  return (
    <AppRouter />
  )
}

export default App