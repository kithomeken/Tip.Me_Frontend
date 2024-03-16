/***************************
* Authentication API Routes
***************************/
export const AUTH = {
    FIREBASE_SSO: '/v1/identity/auth/firebase-sso',
    META_CHECK:   '/v1/identity/account/meta/check',
    PRE_META_01:  '/v1/identity/account/meta/identifier/check',
    PRE_META_03:  '/v1/identity/account/meta/artist_name/check',
    ID_META_01:   '/v1/identity/account/meta/display_name',
    ID_META_02:   '/v1/identity/account/meta/msisdn',
    ARTIST_TYPES: '/v1/identity/account/meta/artist/types',
    ID_META_03:   '/v1/identity/account/meta/artist',
    ENTITY_EXPANSION: '/v1/identity/account/meta/entity/expansion'
}



export const AUTH_SIGN_IN = '/v1/account/auth/sign-in'
export const AUTH_SIGN_OUT = '/v1/account/auth/0-token/invalidate'
export const AUTH_FORGOT_PASSWORD = ''
export const CSRF_COOKIE_ROUTE = '/sanctum/csrf-cookie'


export const SIGN_UP = {
    ONBOARD: '/v1/account/auth/sign-up',
    CHECK_EMAIL: '/v1/account/auth/sign-up/check/email',
    CHECK_IDENTIFIER: '/v1/account/auth/sign-up/check/identifier',
    CHECK_STAGE_NAME: '/v1/account/auth/sign-up/check/stage-name',
    ACCOUNT_ACTIVATION: '/u/account/:uuid/email/verification/:hash',
}

/*
 * Account Profile API Routes
*/
export const ACCOUNT: any = {
    PROFILE: '/v1/account/auth/profile',
    ARTIST_DETAILS: '/v1/account/artist/:auid/details',
    STK_PUSH_NOFITICATION: '/v1/contribution/stk-push/notification',


    MONEY_IN_TRANSACTIONS:  '/v1/account/entity/mpesa/transactions/list/money-in',
    MONEY_OUT_TRANSACTIONS: '/v1/account/entity/mpesa/transactions/list/money-out',
    VALIDATE_WITHDRAWAL:    '/v1/account/entity/mpesa/transactions/withdrawal/check',
    REQUEST_WITHDRAWAL:     '/v1/account/entity/mpesa/transactions/withdrawal/request',
    REQUEST_APPROVAL:       '/v1/account/entity/mpesa/transactions/withdrawal/request/:request/approve',
    REQUEST_REJECTION:      '/v1/account/entity/mpesa/transactions/withdrawal/request/:request/reject',

    /* 
     TODO: 
     * To be reviewed later on 
    */
    EMAIL_CHANGE: '/v1/account/auth/email/change',
    EMAIL_UNDO_CHANGE: '/v1/account/auth/email/change',
    EMAIL_VERIFICATION: '/v1/account/auth/email/resend-verification',
    PASSWORD_CHANGE: '/v1/account/auth/password/change',
    PREFERENCES: '/v1/account/auth/preferences',
    SET_TIMEZONE: '/v1/account/auth/preferences/timezone/set',
    TEAM_RIGHTS: '/v1/account/auth/team/rights',


    MSISDN_CHANGE:          '/v1/account/settings/artist/msisdn/change',
    DSPLY_NAME_CHANGE:      '/v1/account/settings/artist/display_name/update',


    ENTITY_CONTR_DATA:      '/v1/entity/contr/:uuid',
    GET_NOMINATED:          '/v1/account/settings/entity/nominated/member',
    SET_NOMINATED:          '/v1/account/settings/entity/nominated/member/set-own',
    NMNTD_MMBR_ACTION:      '/v1/account/settings/entity/nominated/member/action',
    MEMBER_NOMINTATION:     '/v1/account/settings/entity/nominated/member/set-other',

    EMAIL_HISTORY:          '/v1/account/settings/artist/email/history',
}



/*********************
 * Admin API Routes
*********************/

export const ADMINISTRATION = {
    DASH_METRICS:       '/v1/admin/mertics/earned-commissions',
    TOP_ACTIVE_ENT:     '/v1/admin/mertics/entities/top-active',
    OTHER_STATISCAL:    '/v1/admin/mertics/statistics/others',
    DISBURSED_FNDS:     '/v1/admin/mertics/statistics/funds/disbursed',

    ALL_REQUETS:        '/v1/admin/onboarding/requests/all',
    REQUETS_DETAILS:    '/v1/admin/onboarding/requests/:uuid',
    ACTION_REQUETS:     '/v1/admin/onboarding/requests/:uuid/action',
    ALL_ENTITIES:       '/v1/admin/onboarding/entities',
    ALL_USERS:          '/v1/admin/onboarding/users-management',

    MPESA_EXCEPTIONS:   '/v1/admin/payments/mpesa/exceptions',

    ALL_PAYMENTS:       '/v1/admin/payments/requests/all',
    PAYMENT_DETAILS:    '/v1/admin/payments/requests/:uuid',
    PAYMENT_ACTION:     '/v1/admin/payments/requests/:uuid/action',
    TXN_PAYOUTS:        '/v1/admin/payments/transactions/payouts/all',
    TXN_PAYIN:          '/v1/admin/payments/transactions/payin/all',


    SRCH_USERS:         '/v1/admin/onboarding/users-management/search',
}






export const ACCESS_CONTROL = {
    CHECK_AUTHORIZATION: ''
}