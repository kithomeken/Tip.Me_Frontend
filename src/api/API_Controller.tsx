export function API_Controller () {
    let FQDN = null
    let API = null
    let APP = null
    let connectToUbuntuBangalore01 = true

    if (process.env.NODE_ENV === 'production') {
        APP = ''
        FQDN = 'https://beska.kennedykitho.me' 
        API = 'https://beska.kennedykitho.me/api' 
    } else {
        APP = 'http://localhost:3000'

        if (connectToUbuntuBangalore01) {
            FQDN = 'http://134.209.152.32:81'
            API = 'http://134.209.152.32:81/api'
        } else {
            FQDN = 'http://localhost:81/tippy/public'
            API = 'http://localhost:81/tippy/public/api'
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
