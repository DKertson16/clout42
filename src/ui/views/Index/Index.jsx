import React from 'react'
import Login from '../Login/Login.jsx'
import BookApp from '../BookApp/BookApp.jsx'
import { useBearStore } from '../../store/store.js'

function Index() {
  const user = useBearStore((state) => state.user)
  console.log(user)
  if (user) {
    return <BookApp />
  } else {
    return <Login />
  }
}

export default Index
