import React, { useState } from 'react';
import Userpool from './Userpool';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmit = (event)=>{
        event.preventDefault();

        Userpool.signUp(email, password, [], null, (err, data)=>{
            if (err) console.error(err);
            console.log(data);
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
                <button type="submit">Signup</button>
            </form>
        </div>
    )};