import React, { useState } from 'react';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import Userpool from './Userpool';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmit = (event)=>{
        event.preventDefault();

        const user = new CognitoUser({
            Username: email,
            Pool: Userpool
        });

        const authDetails = new AuthenticationDetails({
            Username: email,
            Password: password
        });

        user.authenticateUser(authDetails, {
            onSuccess: (data)=>{
                console.log('onSuccess:', data);
            },
            onFailure: (err)=>{
                console.error('onFailure:', err);
            },
            newPasswordRequired: (data)=>{
                console.log('newPasswordRequired:', data);
            }
        });
    };

    return (
        <div>
            <h2>Signup</h2>
            <form onSubmit={onSubmit}>
                <label>Email</label>
                <input type="email" value={email} onChange={(event)=>setEmail(event.target.value)} required />
                <label>Password</label>
                <input type="password" value={password} onChange={(event)=>setPassword(event.target.value)} required />
                <button type="submit">Login</button>
            </form>
        </div>
    )};