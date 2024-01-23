import CookieServices from "../../services/CookieServices"
import { encryptAndStoreLS } from "../../lib/modules/HelperFunctions"
import { COOKIE_KEYS, POST_AUTH, STORAGE_KEYS } from "../../global/ConstantsRegistry"

const initialState = {
    type: null,
    email: null,
    first_name: null,
    last_name: null,
    avatarUrl: null,
    status: null,
}

export const postAuthReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case POST_AUTH.FETCHING_DATA:
            return {
                ...state,
                validated: false,
            }

        case POST_AUTH.FETCHED_PROFILE_DATA:
            let accountNumber = null
            const profileData = action.response.account
            encryptAndStoreLS(STORAGE_KEYS.ACCOUNT_DATA, profileData)

            const today = new Date();
            let accountStatus = 'ACTIVE'
            const expiresAt = profileData.expires_at
            const accessExpiry = new Date(expiresAt);

            if (profileData.active !== 'Y') {
                accountStatus = 'SUSPENDED'
            } else if (today > accessExpiry) {
                accountStatus = 'LOCKED'
            }

            if (profileData.group === 'O') {
                accountNumber = action.response.craft
            }

            return {
                ...state,
                first_name: profileData.first_name,
                last_name: profileData.last_name,
                email: profileData.email,
                type: profileData.group,
                status: accountStatus,
                account: accountNumber,
            }


        case POST_AUTH.FETCHED_MENU_DATA:
            const accessibleMenu = action.response
            encryptAndStoreLS(STORAGE_KEYS.BASIC_MENUS, accessibleMenu.basic)
            encryptAndStoreLS(STORAGE_KEYS.OTHER_MENUS, accessibleMenu.others)

            return {
                ...state,
                tariffs: 'Loaded'
            }

        case POST_AUTH.PROFILE_DATA_EXCEPTION:
            // Reset cookie data
            CookieServices.remove(COOKIE_KEYS.UAID)
            CookieServices.remove(COOKIE_KEYS.SANCTUM)

            return {
                ...state,
                validated: true,
                error: true,
            }

        case POST_AUTH.MENU_DATA_EXCEPTION:
            /* 
             * Set menu tarrifs to unloaded. 
             * To be reloaded later on 
            */

            return {
                ...state,
                tariffs: 'Unloaded'
            }

        case POST_AUTH.FETCHED_DATA:
            return {
                ...state,
                validated: true,
            }

        default:
            return state;
    }
}
