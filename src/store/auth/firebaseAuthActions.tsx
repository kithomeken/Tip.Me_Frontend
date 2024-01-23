import { isMobile } from 'react-device-detect';
import {
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    getRedirectResult,
    signInWithEmailAndPassword,
    signInWithPopup,
    signInWithRedirect
} from "firebase/auth";

import { firebaseAuth } from "../../firebase/firebaseConfigs";
import { AUTH_ } from "../../global/ConstantsRegistry";
import AxiosServices from "../../services/AxiosServices";
import { AUTH } from "../../api/API_Registry";

interface FirebaseProps {
    identity: any,
    deviceInfo: any,
    credentials: any,
    locationState?: any,
}

export function firebaseAuthActions(propsIn: FirebaseProps) {
    return (dispatch: (arg0: { type: string; response: any }) => void) => {
        const firebaseProps = { ...propsIn }

        dispatch({
            type: AUTH_.PROCESSING,
            response: {
                redirect: false,
            },
        });

        if (firebaseProps.identity === 'password') {
            emailPasswordSignUp(dispatch, firebaseProps)
        } else {
            if (isMobile) {
                // For mobile devices, redirect
                googleProviderSignInWithRedirect(dispatch, firebaseProps)
            } else {
                googleProviderSignInWithPopUp(dispatch, firebaseProps)
            }
        }
    }
}

async function googleProviderSignInWithPopUp(dispatch: any, firebaseProps: any) {
    const provider = new GoogleAuthProvider();
    firebaseAuth.useDeviceLanguage();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

    signInWithPopup(firebaseAuth, provider)
        .then((result) => {
            const firebaseUser = result.user;

            dispatch({
                type: AUTH_.FIREBASE_TOKEN,
                response: firebaseUser,
            });

            generateSanctumToken(dispatch, firebaseUser, firebaseProps)
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            console.error('FB_ERR', errorMessage);
            console.error('FB_ERR_CODE', errorCode);           

            dispatch({
                type: AUTH_.FIREBASE_EXCEPTION,
                response: errorMessage,
            });
        });

}

async function googleProviderSignInWithRedirect(dispatch: any, firebaseProps: any) {
    const provider = new GoogleAuthProvider();
    firebaseAuth.useDeviceLanguage();
    signInWithRedirect(firebaseAuth, provider);
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

    getRedirectResult(firebaseAuth)
        .then((result) => {
            const firebaseUser = result.user;

            dispatch({
                type: AUTH_.FIREBASE_TOKEN,
                response: firebaseUser,
            });

            generateSanctumToken(dispatch, firebaseUser, firebaseProps)
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            dispatch({
                type: AUTH_.FIREBASE_EXCEPTION,
                response: errorMessage,
            });
        });

    signInWithPopup(firebaseAuth, provider)
        .then((result) => {
            const firebaseUser = result.user;

            dispatch({
                type: AUTH_.FIREBASE_TOKEN,
                response: firebaseUser,
            });

            generateSanctumToken(dispatch, firebaseUser, firebaseProps)
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            dispatch({
                type: AUTH_.FIREBASE_EXCEPTION,
                response: errorMessage,
            });
        });

}

async function emailPasswordSignIn(dispatch: any, firebaseProps: any) {
    /* 
     * Firebase Authentication:
     * Authentication using email and password
     * 
    */
    const credentials = firebaseProps.credentials

    await signInWithEmailAndPassword(firebaseAuth, credentials.email, credentials.password)
        .then((userCredential: any) => {
            const firebaseUser = userCredential.user;

            dispatch({
                type: AUTH_.FIREBASE_TOKEN,
                response: firebaseUser,
            });

            generateSanctumToken(dispatch, firebaseUser, firebaseProps)
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            dispatch({
                type: AUTH_.FIREBASE_EXCEPTION,
                response: errorMessage,
            });
        });
}

async function emailPasswordSignUp(dispatch: any, firebaseProps: any) {
    /* 
     * Firebase Authentication:
     * Authentication using email and password
     * 
    */
    const credentials = firebaseProps.credentials

    await createUserWithEmailAndPassword(firebaseAuth, credentials.email, credentials.password)
        .then((userCredential: any) => {
            const firebaseUser = userCredential.user;

            dispatch({
                type: AUTH_.FIREBASE_TOKEN,
                response: firebaseUser,
            });

            generateSanctumToken(dispatch, firebaseUser, firebaseProps)
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            dispatch({
                type: AUTH_.FIREBASE_EXCEPTION,
                response: errorMessage,
            });
        });
}

async function generateSanctumToken(dispatch: any, firebaseUser: any, firebaseProps) {
    try {
        let formData = new FormData()
        formData.append('idToken', firebaseUser.accessToken)
        formData.append('device_name', firebaseProps.deviceInfo)

        const apiResponse: any = await AxiosServices.httpPost(AUTH.FIREBASE_SSO, formData)
        console.log('SSO_RESP', apiResponse);

        if (apiResponse.data.success) {
            dispatch({
                type: AUTH_.SANCTUM_TOKEN,
                response: apiResponse.data,
            });
        } else {
            dispatch({
                type: AUTH_.SANCTUM_EXCEPTION,
                response: 'Failed to issue Sanctum token',
            });
        }
    } catch (error) {
        dispatch({
            type: AUTH_.SANCTUM_EXCEPTION,
            response: 'Failed to issue Sanctum token',
        });
    }
}

export function resetAuth0() {
    return (dispatch: (arg0: { type: string; response: any }) => void) => {
        dispatch({
            type: AUTH_.RESET_,
            response: {
                redirect: false,
            },
        });
    }
}