import React from 'react';
import axios from 'axios';

function LadingPage(){


    React.useEffect(() => {
        axios.get('/api/hello')
            .then(response => console.log(response))
    }, [])
    return(
        <div style={{ display: 'flex', justifyContent: 'center',alignItems: 'center',width: '100%', height:'100vh' }}>
            <h2>
                시작 페이지
            </h2>
        </div>
    )
}

export default LadingPage