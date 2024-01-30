import { combineReducers } from 'redux';

import { authReducer } from './auth/authReducer';
import { withReduxStateSync } from 'redux-state-sync';
import { postAuthReducer } from './auth/postAuthRecuder';
import { firebaseAuthReducer } from './auth/firebaseReducers';
import { identityCheckReducer } from './identitycheckReducers';

const rootReducer = combineReducers({
    auth: authReducer,
    account: postAuthReducer,
    identity: identityCheckReducer,
    auth0: firebaseAuthReducer,
})

export default withReduxStateSync(rootReducer)