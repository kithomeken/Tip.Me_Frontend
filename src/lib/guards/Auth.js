import Crypto from '../../security/Crypto'
import StorageServices from '../../services/StorageServices'
import { revokeAuthSession } from "../../store/auth/firebaseAuthActions"
import { STORAGE_KEYS, COOKIE_KEYS } from "../../global/ConstantsRegistry"

class Auth {
    checkAuthentication(auth0) {
        let sessionState

        if (!auth0.authenticated) {
            // Redux shows session is not authenticated
            sessionState = {
                'identity': false,
                'authenticated': false,
                'status': {
                    'disabled': false,
                    'resetSession': false
                }
            }
        } else {
            /* 
              * Redux session state is authenticated 
              * Counter-check with available session cookies
            */
            const sanctumCookie = this.isCookieSet(COOKIE_KEYS.SANCTUM)
            const encryptedKeyString = StorageServices.getLocalStorage(STORAGE_KEYS.ACCOUNT_DATA)

            if (sanctumCookie === null) {
                // Not authenticated. Reset account session
                sessionState = {
                    'identity': false,
                    'authenticated': false,
                    'status': {
                        'disabled': false,
                        'resetSession': true
                    }
                }
            } else {
                // Authenticated
                if (encryptedKeyString === null) {
                    // Pull account information using PostAuthentication
                    sessionState = {
                        'identity': false,
                        'authenticated': true,
                        'status': {
                            'disabled': false,
                            'resetSession': false
                        }
                    }
                } else {
                    const storageObject = JSON.parse(encryptedKeyString)
                    const accountData = Crypto.decryptDataUsingAES256(storageObject)

                    const jsonAccountInfo = JSON.parse(accountData)

                    if (jsonAccountInfo.email === auth0.identity.email) {
                        sessionState = {
                            'identity': true,
                            'authenticated': true,
                            'status': {
                                'disabled': false,
                                'resetSession': false
                            }
                        }
                    } else {
                        // Account info do not match. Redirect to PostAuth
                        sessionState = {
                            'identity': false,
                            'authenticated': true,
                            'status': {
                                'disabled': false,
                                'resetSession': false
                            }
                        }
                    }
                }
            }
        }

        return sessionState
    }

    isCookieSet(cookieName) {
        const cookieArr = document.cookie.split(";");

        for (let i = 0; i < cookieArr.length; i++) {
            let cookiePair = cookieArr[i].split("=");

            if (cookieName === cookiePair[0].trim()) {
                return decodeURIComponent(cookiePair[1]);
            }
        }

        return null;
    }

    revokeAuth() {
        const dispatch = dispatch()
        dispatch(revokeAuthSession())
    }
}

export default new Auth()