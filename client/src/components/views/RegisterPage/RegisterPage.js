import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../_actions/user_action'
import { withRouter } from 'react-router-dom'

function RegisterPage(props) {

    const dispatch = useDispatch();

    const [Email,setEmail] = useState("");
    const [Name,setName] = useState("");
    const [Password,setPassword] = useState("");
    const [ConfirmPassword,setConfirmPassword] = useState("");

    const onEmailHandler = (event) => {

        setEmail(event.target.value);
    }

    const onPasswordHandler = (event) => {

        setPassword(event.target.value);
    }

    const onNameHandler = (event) => {

        setName(event.target.value);
    }

    const onConfirmPasswordHandler = (event) => {

        setConfirmPassword(event.target.value);
    
    }

    const onSubmitHandler = (event) => {

        if(Password !== ConfirmPassword) {
            return alert('ConfirmPassword is unmatched')
        }

        event.preventDefault();
        let body = {
            email:Email,
            password:Password,
            name:Name,
        }

        dispatch(registerUser(body))
            .then(response => {
                if(response.payload.success) {
                    props.history.push('/login')
                }else{
                    alert("Failed to sign up")
                }
            })

    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center',alignItems: 'center',width: '100%', height:'100vh' }}>
            <form style={{ display: 'flex',flexDirection:"column"}} onSubmit={onSubmitHandler}>
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label>Name</label>
                <input type="text" value={Name} onChange={onNameHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />
                <label>Confirm Password</label>
                <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} />

                <br />
                <button type='submit' >
                    Register
                </button>
            </form>
        </div>
    );
}

export default withRouter(RegisterPage);