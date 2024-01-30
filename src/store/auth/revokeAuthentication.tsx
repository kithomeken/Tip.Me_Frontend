import axios from "axios";

import { API_DOMAIN } from "../../api/API_Controller";
import { AUTH_SIGN_OUT } from "../../api/API_Registry";
import HttpServices from "../../services/HttpServices";
import { AUTH_ } from "../../global/ConstantsRegistry";

export const revokeAuthenticationAction = () => {
    return (dispatch: (arg0: { type: string; response: any; }) => void) => {               
        invalidateSanctumToken(dispatch)
    }
}

function invalidateSanctumToken(dispatch: any) {
    let revokeAPI = API_DOMAIN + AUTH_SIGN_OUT
    const axiosOptions = Object.assign(HttpServices.axiosInstanceHeaders(), null)
    
    dispatch({
        type: AUTH_.REVOKE_SESSION,
        response: null,
    });
}