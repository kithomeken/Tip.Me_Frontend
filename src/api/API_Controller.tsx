export function API_Controller() {
    let FQDN = null
    let API = null
    let APP = null
    let connectToUbuntuBangalore01 = true

    if (process.env.NODE_ENV === 'production') {
        APP = 'http://localhost:3000'
        FQDN = 'https://api.theapplication.online'
        API = 'https://bigfan.theapplication.online/api'
    } else {

        if (connectToUbuntuBangalore01) {
            FQDN = 'https://api.theapplication.online'
            API = 'https://api.theapplication.online/api'
            APP = 'https://bigfan.theapplication.online'
        } else {
            FQDN = 'http://localhost:81/tippy/public'
            API = 'http://localhost:81/tippy/public/api'
            APP = 'http://localhost:3000'
        }
    }

    return {
        'FQDN': FQDN,
        'API': API,
        'APP': APP,
    }
}

export const FULLY_QUALIFIED_DOMAIN_NAME = API_Controller().FQDN
export const API_DOMAIN = API_Controller().API
