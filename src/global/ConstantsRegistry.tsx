// Constants Registry

import { API_Controller } from "../api/API_Controller"

/*
* Application Constants
* */
export const APPLICATION = {
    NAME: 'Tip.Me',
    THEME: 'green',
    URL: API_Controller().APP,
    ERR_MSG: 'Something went wrong. Check connection'
}


/*
* Local storage keys
* */
export const STORAGE_KEYS = {
    PRc0_STATE: '__PRc0',
    TIMEZONE: '__utmzZONE',
    BASIC_MENUS: '__utmmBSC',
    OTHER_MENUS: '__utmmOTH',
    ACCOUNT_DATA: '__utmzADTA',
    ENCRYPTION_KEY: '__utmeKYBSE',

    FIREBASE_RFSH: '__RfhS',
}


/*
* Secure Cookie keys
* */
export const COOKIE_KEYS = {
    UAID: '__utmcUAID',
    SANCTUM: '__utmcSNCT',
    OPTIONS: { path: '/', secure: true, sameSite: 'none' },
}


export const STYLE = {
    MAX_WIDTH: { maxWidth: '1024px' },
}

export const CONFIG_MAX_WIDTH = { maxWidth: '1024px' }
export const CONFIG_MARGIN_TOP = { marginTop: '64px' }



/*
* Post-Authentication Redux Actions
* */
export const POST_AUTH = {
    FETCHING_DATA: 'FETCHING_DATA',
    FETCHED_DATA: 'FETCHED_DATA',

    // Profile data actions
    FETCHED_PROFILE_DATA: 'FETCHED_PROFILE_DATA',
    PROFILE_DATA_EXCEPTION: 'PROFILE_DATA_EXCEPTION',

    // Accessible menus data actions
    FETCHED_MENU_DATA: 'FETCHED_MENU_DATA',
    MENU_DATA_EXCEPTION: 'MENU_DATA_EXCEPTION',
}

export const AUTH_ = {
    RESET_: 'RESET',
    PROCESSING: 'PROCESSING',
    SANCTUM_TOKEN: 'SANCTUM_TOKEN',
    REVOKE_SESSION: 'REVOKE_SESSION',
    FIREBASE_TOKEN: 'FIREBASE_TOKEN',
    SANCTUM_EXCEPTION: 'SANCTUM_EXCEPTION',
    FIREBASE_EXCEPTION: 'FIREBASE_EXCEPTION',

    ID_META_01: 'ID_META_01',
    ID_META_02: 'ID_META_02',
    ID_META_03: 'ID_META_03',


    AUTHENTICATING: 'AUTHENTICATING',
    AUTHENTICATED: 'AUTHENTICATED',
    AUTH_EXCEPTION: 'AUTH_EXCEPTION',
    REVOKE_SESSIO: 'REVOKE_SESSIO',

    AUTHENTICATION_REVOKED: 'AUTHENTICATION_REVOKED',
    REVOKE_EXCEPTION: 'REVOKE_EXCEPTION',
    RESET_STATE: 'RESET_STATE',
}


export const IDENTITY_ = {
    PRc0: 'PRc0_SET',
    RESET_: 'PRc0_RESET',
    PRc0_UPDATE: 'PRc0_UPDATE',
    PROCESSING: 'PRc0_EXECUTING',
    PRc0_EXCEPTION: 'PRc0_EXCEPTION',
    PRc0_COMPLETED: 'PRc0_COMPLETED',
}