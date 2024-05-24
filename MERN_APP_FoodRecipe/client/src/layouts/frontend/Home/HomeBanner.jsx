import React from 'react'
import Banner from "../../../assets/images/header.jpg"

const HomeBanner = () => {

    return (

        <div>
            <div className='banner-text'>
                <h1>Choose from thousands of recipies</h1>
                <p>Appropriately integrate technically sound value with scalable infomediaries 
                    negotiate sustainable strategic theme areas
                </p>
            </div>
            
            <img src={Banner} alt='banner image' loading='lazy'/>
        </div>
    )
}

export default HomeBanner