import React from 'react';
import { useDispatch } from 'react-redux'
import { auth } from '../_actions/user_action'

export default function (SpecificComponent,option,adminRoute = null) {
    function AuthenticationCheck(props){

        const dispatch = useDispatch();
        React.useEffect(() => {
            dispatch(auth()).then(response => {
                console.log(response);

                if(!response.payload.isAuth) {
                    if(option === true) {
                        props.history.push('/login');
                    }
                }else{
                    if(adminRoute&&!response.payload.isAdmin) {
                        props.history.push('/')
                    }else{
                        if(option === false) {
                            props.history.push('/')
                        }
                    }
                }
            })
           
        },[])
        return (
            <SpecificComponent />
        )
    }
    return AuthenticationCheck
}