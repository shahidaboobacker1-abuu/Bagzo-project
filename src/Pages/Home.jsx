import React from 'react'
import Navbar from '../Component/Navbar'
import Banner from '../Component/Banner'
import Footer from '../Component/Footer'
import Card from '../Component/Card'

export default function Home() {
  return (
    <div>
      <Navbar/>
      <Banner/>
      <Card/>
      <Footer />
    </div>
  )
}
