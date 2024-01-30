import CookieServices from "../../services/CookieServices";
import StorageServices from "../../services/StorageServices";
import { encryptAndStoreCookie } from "../../lib/modules/HelperFunctions";
import { AUTH_, COOKIE_KEYS, STORAGE_KEYS } from "../../global/ConstantsRegistry";

const initialState = {
    uaid: null,
    identifier: null,
    isAuthenticated: false,
}

export const authReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case AUTH_.RESET_STATE:
            return {
                ...state,
                processing: false,
                isAuthenticated: false,
                error: null,
            }

        case AUTH_.AUTHENTICATING:
            return {
                ...state,
                processing: true,
                isAuthenticated: false,
            }

        case AUTH_.AUTHENTICATED:
            const payload = action.response.payload
            const authIdentifier = action.response.email

            encryptAndStoreCookie(COOKIE_KEYS.UAID, payload.uuid)
            encryptAndStoreCookie(COOKIE_KEYS.SANCTUM, payload.token)

            return {
                ...state,
                uaid: payload.uuid,
                isAuthenticated: true,
                identifier: authIdentifier,
            }

        case AUTH_.AUTH_EXCEPTION:
            return {
                ...state,
                processing: false,
                isAuthenticated: false,
                error: "The provided credentials are incorrect.",
            }

        case AUTH_.REVOKE_SESSION:
            CookieServices.remove(COOKIE_KEYS.SANCTUM)
            CookieServices.remove(COOKIE_KEYS.UAID)
            StorageServices.removeLocalStorage(STORAGE_KEYS.ACCOUNT_DATA)

            return {
                ...state,
                uaid: null,
                identifier: null,
                isAuthenticated: false,
            }

        case AUTH_.REVOKE_EXCEPTION:
            return {
                ...state,
                processing: false,
                isAuthenticated: false,
            }

        default:
            return state;
    }
}