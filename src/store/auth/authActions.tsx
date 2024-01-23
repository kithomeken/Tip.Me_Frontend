import axios from "axios";

import Crypto from "../../security/Crypto";
import { API_DOMAIN } from "../../api/API_Controller";
import { AUTH_SIGN_IN } from "../../api/API_Registry";
import { AUTH_ } from "../../global/ConstantsRegistry";

interface Props {
    auto: boolean,
    urlParams?: any,
    deviceInfo: any,
    credentials?: any,
    locationState?: any,
}

export function authActions(propsIn: Props) {
    return (dispatch: (arg0: { type: string; response: any; }) => void) => {
        const props = { ...propsIn }

        if (props.auto) {
            /*
             * Auto account authentication
             * When an invitation has been accepted
             * And the account has been verfied
            */

            // Verify data to be used in auto sign in
            const locationState = props.locationState
            const urlParams = props.urlParams

            if (locationState === null || locationState === undefined) {
                dispatch({
                    type: "INTEGRITY_COMPROMISED_",
                    response: {
                        'redirect': true
                    }
                })
            } else {
                const decryptedEmailAddr = Crypto.decryptDataUsingAES256(urlParams.auid)

                if (locationState.email !== decryptedEmailAddr) {
                    dispatch({
                        type: "INTEGRITY_COMPROMISED_",
                        response: null,
                    })
                } else {
                    /*
                     * Data integrity is maintained, meaning that
                     * Auto authentication process flows from acceptance
                     * Of the invitation sent to user
                    */
                    dispatch({
                        type: "AUTHENTICATION_PENDING_",
                        response: null,
                    });

                    let formData = new FormData
                    formData.append("email", locationState.email)
                    formData.append("password", locationState.password)

                    accountSignIn(formData, dispatch, locationState.email)
                }
            }
        } else {
            /* 
             * Standard account authentication method 
             * Of inputing email and password by the
             * Account holder
            */
            dispatch({
                type: AUTH_.AUTHENTICATING,
                response: {
                    redirect: false,
                },
            });

            let formData = new FormData
            formData.append("device_name", props.deviceInfo)
            formData.append("email", props.credentials.email)
            formData.append("password", props.credentials.password)

            accountSignIn(formData, dispatch, props.credentials.email)
        }
    }
}

function accountSignIn(formData: any, dispatch: any, authEmail) {
    const signInApi = API_DOMAIN + AUTH_SIGN_IN
    
    axios
        .post(signInApi, formData)
        .then((response) => {
            if (response.data.success) {
                dispatch({
                    type: AUTH_.AUTHENTICATED,
                    response: {
                        payload: response.data.payload,
                        email: authEmail
                    },
                });
            } else {
                dispatch({
                    type: AUTH_.AUTH_EXCEPTION,
                    response: response.data.error,
                });
            }
        })
        .catch((error) => {
            dispatch({
                type: AUTH_.AUTH_EXCEPTION,
                response: "Error occured while signing in account",
            });
        });
}

export const resetReduxAuthState = () => {
    return async (dispatch: (argo: { type: string, response: any }) => void) => {
        /* 
         * On refresh or load of the Sign In page
         * reset the redux state to come a fresh
        */
        
        dispatch({
            type: AUTH_.RESET_STATE,
            response: null,
        });
    }
} 