import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {loginUser } from '../../../_actions/user_action'

function LoginPage() {

    const dispatch = useDispatch();

    const [Email,setEmail] = useState("");
    const [Password,setPassword] = useState("");

    const onEmailHandler = (event) => {

        setEmail(event.target.value);
    }

    const onPasswordHandler = (event) => {

        setPassword(event.target.value);
    }

    const onSubmitHandler = (event) => {
        event.preventDefault();
        let body = {
            email:Email,
            password:Password
        }

        dispatch(loginUser(body));

    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center',alignItems: 'center',width: '100%', height:'100vh' }}>
            <form style={{ display: 'flex',flexDirection:"column"}} onSubmit={onSubmitHandler}>
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />

                <br />
                <button type='submit' >
                    Login
                </button>
            </form>
        </div>
    );
}

export default LoginPage;