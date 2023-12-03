import React from 'react'
import { useHistory } from 'react-router-dom'

export default function Logo() {
    const history = useHistory()
    function home () {
        history.push('/')
    }
    return (
        <div className='LogoContainer' onClick={home}>
            {/* <img className="spotifrog-logo" src="https://spotifrogmp3.s3.us-west-1.amazonaws.com/IMG_0034-1.png" alt="Spotifrog Logo"/> */}
            <h1>Basana</h1>
        </div>
    )
}
