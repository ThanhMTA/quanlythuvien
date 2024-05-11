import React from "react";

import About from "../Components/About/About"
import WelcomeBox from '../Components/WelcomeBox/WelcomeBox'
import ImageSlider from '../Components/ImageSlider/ImageSlider.js'
import Footer from '../Components/Footer/Footer'
import Stats from '../Components/Stats/Stats'
import PopularBooks from '../Components/PopularBooks/PopularBooks'
function Home(){
    return (
        <div id="home" >
            <ImageSlider/>
            <WelcomeBox/>
            <About/>
            {/* <Stats/> */}

            <PopularBooks/>

            <Footer/>
        </div>
    )
}

export default Home