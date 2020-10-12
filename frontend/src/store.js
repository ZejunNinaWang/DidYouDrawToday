import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
import Cookie from "js-cookie";
import { userSigninReducer, userUpdateReducer, userAvatarSaveReducer,userUploadFileReducer, userRecreationListReducer, userReferenceListReducer /*userRegisterReducer*/ } from "./reducers/userReducers";
import { referenceDeleteReducer, referenceListReducer, referenceSaveReducer, referencesByIdReducer } from "./reducers/referenceReducers";
import { recreationDeleteReducer, recreationListReducer, recreationSaveReducer, recreationsByIdReducer } from "./reducers/recreationReducers";

const userInfo = Cookie.getJSON("userInfo") || {};


const initialState = {
    userSignin: {userInfo: userInfo} //initial state for userSignin reducer
};
const reducer = combineReducers({

    userSignin: userSigninReducer,
    userUpdate: userUpdateReducer,
    //userRegister: userRegisterReducer,
    userAvatarSave: userAvatarSaveReducer,
    userUploadFile: userUploadFileReducer,
    userRecreationList: userRecreationListReducer,
    userReferenceList: userReferenceListReducer,
    referenceSave: referenceSaveReducer,
    referenceDelete: referenceDeleteReducer,
    referenceList: referenceListReducer,
    referencesById:referencesByIdReducer,
    // referenceDetails: referenceDetailsReducer,
    recreationSave: recreationSaveReducer,
    recreationDelete: recreationDeleteReducer,
    recreationList: recreationListReducer,
    recreationsById: recreationsByIdReducer

})

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, initialState, composeEnhancer(applyMiddleware(thunk)));
export default store; 