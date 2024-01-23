/* 
 * Firebase Account Sign Up
 * Using Email and Password 
 * 
 * */

import React, { useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth";

import { firebaseAuth } from "../../firebase/firebaseConfigs";
import { useDispatch } from "react-redux";
import { DeviceInfo } from "../../lib/modules/HelperFunctions";
import { firebaseAuthActions } from "../../store/auth/firebaseAuthActions";

export const FB_SignUpPassword = () => {

    const dispatch: any = useDispatch();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');

    const [state, setstate] = useState({
        input: {
            email: '',
            password: '',
        }, errors: {
            email: '',
            password: '',
        }
    })

    const onFormSubmitHandler = (e: any) => {
        e.preventDefault()

        const props = {
            identity: 'password',
            credentials: {
                email: email,
                password: password,
            },
            deviceInfo: DeviceInfo(),
        }

        dispatch(firebaseAuthActions(props))
    }

    const firebaseAuthentication = async () => {
        await createUserWithEmailAndPassword(firebaseAuth, email, password)
            .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;
                // ...
            console.log('FB_SER', user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
                console.error('FB_ERR', errorMessage);
            });
    }

    return (
        <React.Fragment>
            <h1> FocusApp </h1>
            <form>
                <div>
                    <label htmlFor="email-address">
                        Email address
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Email address"
                    />
                </div>

                <div>
                    <label htmlFor="password">
                        Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Password"
                    />
                </div>

                <button
                    type="submit"
                    onClick={onFormSubmitHandler}
                >
                    Sign up
                </button>

            </form>
        </React.Fragment>
    )
}