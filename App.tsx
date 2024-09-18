import React from 'react'
import { MMKV } from 'react-native-mmkv'
import AppRouter from './src/routes/AppRouter'
import { animals, colors, uniqueNamesGenerator } from 'unique-names-generator'
import { STRINGS } from './src/utils/Strings'

export const storage = new MMKV()

export const NickNameGenerator = () => {
  const generatedName = uniqueNamesGenerator({
    dictionaries: [colors, animals],
    length: 2,
    separator: '_',
    style: 'upperCase',
  })
  storage.set(STRINGS.MMKV.NickName, generatedName)
  return generatedName
}

const App = () => {

  return (
    <AppRouter />
  )
}

export default App