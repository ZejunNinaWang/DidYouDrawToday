import Axios from "axios"
import Cookie from "js-cookie"
import { 
    USER_SIGNIN_REQUEST, USER_SIGNIN_SUCCESS, USER_SIGNIN_FAIL, 
    USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_REGISTER_FAIL, 
    USER_LOGOUT, 
    USER_UPDATE_REQUEST, USER_UPDATE_SUCCESS, USER_UPDATE_FAIL,
    USER_AVATAR_SAVE_REQUEST, USER_AVATAR_SAVE_SUCCESS, USER_AVATAR_SAVE_FAIL, 
    USER_REMOVE_FILE_TO_UPLOAD, USER_SELECT_FILE_TO_UPLOAD, USER_UPLOAD_FILE_RESET, 
    USER_QUERY_RECREATION_LIST_SUCCESS, USER_QUERY_RECREATION_LIST_FAIL, USER_QUERY_RECREATION_LIST_REQUEST, USER_QUERY_REFERENCE_LIST_REQUEST, USER_QUERY_REFERENCE_LIST_FAIL, USER_QUERY_REFERENCE_LIST_SUCCESS
} from "../constants/userConstants"
import { userSigninReducer } from "../reducers/userReducers"

const signin = (email, password) => async (dispatch) =>{
    dispatch({type: USER_SIGNIN_REQUEST, payload: {email, password}});
    try {
        const {data} = await Axios.post("/api/users/signin", {email, password});
        dispatch({type: USER_SIGNIN_SUCCESS, payload: data});
        Cookie.set('userInfo', JSON.stringify(data));

    } catch (error) {
        dispatch({type: USER_SIGNIN_FAIL, payload: error.message});
    }
}

// const update = ({userId, name, email, password}) => async (dispatch, getState) =>{
    
//     try {
//         dispatch({type: USER_UPDATE_REQUEST, payload: { userId, name, email, password}});
//         const {userSignin: {userInfo}} = getState();
//         const {data} = await Axios.put("/api/users/" + userId, {name, email, password}, 
//         {
//             headers: {
//                 'Authorization': 'Bearer ' + userInfo.token
//             }
//         }
//         );
//         dispatch({type: USER_UPDATE_SUCCESS, payload: data});
//         dispatch({type: USER_SIGNIN_SUCCESS, payload: data});
//         Cookie.set('userInfo', JSON.stringify(data));
//     } catch (error) {
//         dispatch({type: USER_UPDATE_FAIL, payload: error.message});
//     }
// }

const register = (name, email, password) => async (dispatch) =>{
    dispatch({type: USER_REGISTER_REQUEST, payload: {name, email, password}});
    try {
        const {data} = await Axios.post("/api/users/register", {name, email, password});
        dispatch({type: USER_REGISTER_SUCCESS, payload: data});
        Cookie.set('userInfo', JSON.stringify(data));
    } catch (error) {
        dispatch({type: USER_REGISTER_FAIL, payload: error.message});
    }
}

const logout = () => (dispatch) => {
    Cookie.remove('userInfo');
    dispatch({type: USER_LOGOUT});
}

// const saveAvatar = (fileName) => async (dispatch, getState) => {
//     try {
//         dispatch({type: USER_AVATAR_SAVE_REQUEST, payload: fileName});
//         const {userSignin: {userInfo}} = getState();
//         if(userInfo._id){
//             const { data } = await Axios.put(
//                 `/api/users/${userInfo._id}/avatars`,
//                 {fileName},
//                 {
//                   headers: {
//                     Authorization: 'Bearer ' + userInfo.token,
//                   },
//                 }
//             );
//             dispatch({type: USER_AVATAR_SAVE_SUCCESS, payload: data});
//             //Need to update userinfo as well
//             dispatch({type: USER_UPDATE_SUCCESS, payload: data});
//             dispatch({type: USER_SIGNIN_SUCCESS, payload: data});
//             Cookie.set('userInfo', JSON.stringify(data));
//         }else{
//             dispatch({type: USER_AVATAR_SAVE_FAIL, payload: "User id is undefined"});
//         }
//     } catch (error) {
//         dispatch({type: USER_AVATAR_SAVE_FAIL, payload: error.message});
//     }
// }

const selectFileToUpload = (file) => (dispatch) => {
    dispatch({type: USER_SELECT_FILE_TO_UPLOAD, payload: file});
}

const removeFileToUpload = () => (dispatch) => {
    dispatch({type: USER_REMOVE_FILE_TO_UPLOAD});
}

const resetFileToUpload = () => (dispatch) => {
    dispatch({type: USER_UPLOAD_FILE_RESET});
}

const queryUserRecreationList = () => async (dispatch, getState) => {
    try {
        const {userSignin: {userInfo}} = getState();
        dispatch({type: USER_QUERY_RECREATION_LIST_REQUEST})
        const {data} = await Axios.get(`/api/users/${userInfo._id}/recreations`, {
            headers: {
                'Authorization': 'Bearer ' + userInfo.token
            }
        });
        dispatch({type: USER_QUERY_RECREATION_LIST_SUCCESS, payload: data});
        
    } catch (error) {
        dispatch({type: USER_QUERY_RECREATION_LIST_FAIL, payload: error});
    }
}

const queryUserReferenceList = () => async (dispatch, getState) => {
    try {
        const {userSignin: {userInfo}} = getState();
        dispatch({type: USER_QUERY_REFERENCE_LIST_REQUEST})
        const {data} = await Axios.get(`/api/users/${userInfo._id}/references`, {
            headers: {
                'Authorization': 'Bearer ' + userInfo.token
            }
        });
        dispatch({type: USER_QUERY_REFERENCE_LIST_SUCCESS, payload: data});
        
    } catch (error) {
        dispatch({type: USER_QUERY_REFERENCE_LIST_FAIL, payload: error});
    }
}


export {
    signin, register, logout, selectFileToUpload, removeFileToUpload, resetFileToUpload, queryUserRecreationList, queryUserReferenceList
    // update, saveAvatar
}