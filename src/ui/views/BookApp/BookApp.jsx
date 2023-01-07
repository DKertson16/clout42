import React, { useEffect, useState } from 'react'
import NavBar from './NavBar.jsx'
import UpcomingSports from './UpcomingSports/UpcomingSports'
import { useBearStore } from '../../store/store.js'

function BookApp() {
  const showContinueButton = useBearStore(
    (state) => state.selectedSports,
  ).length

  return (
    <>
      <NavBar showContinueButton={showContinueButton} />
      <UpcomingSports />
    </>
  )
}

export default BookApp
