import { Helmet } from "react-helmet";
import React, { useState } from "react";
import { Link } from "react-router-dom";

import { useDispatch } from "react-redux";
import { Navigate, useLocation } from "react-router";
import { useAppSelector } from "../../store/hooks";
import { APPLICATION } from "../../global/ConstantsRegistry";
import { authenticationRoutes } from "../../routes/authRoutes";
import { DeviceInfo, classNames } from "../../lib/modules/HelperFunctions";
import { firebaseAuthActions, firebaseSSO_SignIn, resetAuth0 } from "../../store/auth/firebaseAuthActions";

export const SignIn = () => {
    const [state, setstate] = useState({
        posting: false,
        auth0User: 'Not Authenticated',
    })

    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });

    const location = useLocation()
    const dispatch: any = useDispatch();

    const locationState: any = location.state
    const auth0: any = useAppSelector(state => state.auth0)

    const signUpRoute: any = (authenticationRoutes.find((routeName) => routeName.name === 'AUTH_SIGN_UP'))?.path

    React.useEffect(() => {
        /* 
        * On refresh or load of the Sign In page
        * reset the redux state to come a fresh
        */
        dispatch(resetAuth0())
    }, [])

    const passwordSignInFormHandler = (e: any) => {
        e.preventDefault();

        if (!auth0.processing) {
            dispatch(resetAuth0())
            const signInProps = {
                identity: 'password',
                credentials: credentials,
                deviceInfo: DeviceInfo(),
                locationState: locationState
            }

            dispatch(firebaseSSO_SignIn(signInProps))
        }
    };

    const signInWithGoogle = () => {
        if (!auth0.processing) {
            dispatch(resetAuth0())
            const signInProps = {
                identity: 'google',
                credentials: credentials,
                deviceInfo: DeviceInfo(),
                locationState: locationState
            }

            console.log('DEVICE', signInProps.deviceInfo);
            

            dispatch(firebaseAuthActions(signInProps))
        }
    }

    if (auth0.authenticated) {
        // onAuthStateChanged(firebaseAuth, authenticatedUser => {
        //     if (authenticatedUser !== null) {
        //         console.log('Logged in', authenticatedUser);
        //         setstate({
        //             ...state, auth0User: 'Authenticated'
        //         })
        //     } else {
        //         console.log('No user');
        //         setstate({
        //             ...state, auth0User: 'Not Authenticated'
        //         })
        //     }
        // })
    }

    if (auth0.authenticated) {
        const state = {
            from: locationState?.from,
            postAuth: true
        }

        const redirectRoute = locationState?.from === undefined ? '/home' : locationState?.from
        return <Navigate state={state} replace to={redirectRoute} />;
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>Sign In</title>
            </Helmet>

            <div className="flex flex-col">
                <div className="wrapper flex-grow">
                    <section className="gx-container">
                        <div className="md:px-10 px-4">
                            <header className="landing-header">
                                <div className="landing pl-3 mb-0 text-left">
                                    <h2 className="odyssey text-left text-purple-500 nunito">{APPLICATION.NAME}</h2>
                                    <span className="text-sm block text-left mt-0 mb-3">Account Sign In</span>

                                    <span className="text-stone-500 text-sm block">
                                        <span>Don't have an account?</span>
                                        <Link to={signUpRoute} className="text-purple-600 underline ml-1">Sign Up</Link>
                                    </span>
                                </div>
                            </header>

                            <form className="space-y-3 shadow-none px-2 mb-3" onSubmit={passwordSignInFormHandler}>
                                <div className="shadow-none space-y-px mb-4">
                                    <label htmlFor="email" className="block text-sm leading-6 text-stone-700 mb-1">Email:</label>

                                    <div className="relative mt-2 rounded shadow-sm">
                                        <input type="email" name="email" id="email" placeholder="you@social.com" autoComplete="off"
                                            className={classNames(
                                                'text-stone-900 ring-slate-300 placeholder:text-stone-500 focus:border-0 focus:outline-none focus:ring-purple-600 focus:outline-purple-500 hover:border-stone-400 border border-stone-300',
                                                'block w-full rounded-md py-2 pl-3 pr-8  text-sm'
                                            )} onChange={(e) => setCredentials({ ...credentials, email: e.target.value })} value={credentials.email} required />

                                    </div>

                                    {
                                        auth0.error && (
                                            <span className='invalid-feedback text-xs text-red-600 pl-0'>
                                                {auth0.error}
                                            </span>
                                        )
                                    }
                                </div>

                                <div className="shadow-none space-y-px mb-">
                                    <label htmlFor="password" className="block text-sm leading-6 text-stone-700 mb-1">Password:</label>

                                    <div className="relative mt-2 rounded shadow-sm">
                                        <input type="password" name="password" id="password" placeholder="********" autoComplete="off"
                                            className={classNames(
                                                'text-stone-900 ring-slate-300 placeholder:text-stone-500 focus:border-0 focus:outline-none focus:ring-purple-600 focus:outline-purple-500 hover:border-stone-400 border border-stone-300',
                                                'block w-full rounded-md py-2 pl-3 pr-8  text-sm'
                                            )} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} value={credentials.password} required />
                                    </div>
                                </div>

                                <div className="text-sm">
                                    <a href="/auth/forgot-password" className="text-right block text-stone-500 hover:text-stone-600">
                                        <span className="font-small">
                                            Forgot password?
                                        </span>
                                    </a>
                                </div>

                                <div className="pb-3 pt-3 flex justify-center">
                                    <button className="bg-purple-600 relative w-40 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-purple-700 focus:outline-none focus:ring-0 focus:ring-offset-2 focus:bg-purple-700" type="submit">
                                        {
                                            auth0.processing ? (
                                                    <div className="flex justify-center items-center gap-3 py-2">
                                                        <i className="fad fa-spinner-third fa-xl fa-spin"></i>
                                                    </div>
                                            ) : (
                                                <div className="flex justify-center items-center gap-3">
                                                    <i className="fa-solid fa-lock fa-xl"></i>
                                                    Sign In
                                                </div>
                                            )
                                        }
                                    </button>
                                </div>
                            </form>

                            <div className="flex flex-row justify-center items-center align-middle">
                                <div className="flex-grow border-b"></div>
                                <span className="flex-none text-stone-600 px-4">or</span>
                                <div className="flex-grow border-b"></div>
                            </div>

                            <div className="px-3 py-4 text-sm">
                                <div className="flex items-center pt-1 justify-center dark:bg-gray-800">
                                    <button type="button" onClick={signInWithGoogle} className="px-4 py-2 border flex gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-stone-700 dark:text-stone-200 hover:border-stone-400 hover:text-slate-900 dark:hover:text-slate-300 transition duration-150">
                                        <img className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />
                                        <span className="pl-2">Sign in with Google</span>
                                    </button>
                                </div>
                            </div>

                            <div className="mx-auto py-3 text-center">
                                <p className="text-sm">
                                    © {new Date().getFullYear()}. Elevated Acts of Appreciation, <span className="text-purple-600 block">Tip by Tip.</span>
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </React.Fragment>
    )
}