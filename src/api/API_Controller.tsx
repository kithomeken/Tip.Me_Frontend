export function API_Controller () {
    let FQDN = null
    let API = null
    let APP = null
    let online = true

    if (process.env.NODE_ENV === 'production') {
        APP = ''
        FQDN = 'https://beska.kennedykitho.me' 
        API = 'https://beska.kennedykitho.me/api' 
    } else {
        APP = 'http://localhost:3000'

        if (online) {
            FQDN = 'http://143.244.140.238:81'
            API = 'http://143.244.140.238:81/api'
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
