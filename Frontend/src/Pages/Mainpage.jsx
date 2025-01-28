import React from 'react'
import Nav from '../Components/Nav'
import LandingPage from './LandingPage'
import FeaturedProducts from './FeaturedProducts'
import Category from './Category'
import Brands from './Brands'
import Newsletter from './Newsletter'
import Touch from './Touch'
import Footer from './Footer'

const Mainpage = () => {
  return (
    <div>

      <Nav />
      <LandingPage />
      <FeaturedProducts />
      <Category />
      <Brands />
      <Newsletter />
      <Footer />
    </div>
  )
}

export default Mainpage