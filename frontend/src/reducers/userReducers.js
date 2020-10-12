import { RECREATION_DELETE_SUCCESS, RECREATION_SAVE_SUCCESS } from "../constants/recreationConstants";
import { REFERENCE_DELETE_SUCCESS, REFERENCE_QUERY_SUCCESS, REFERENCE_SAVE_SUCCESS } from "../constants/referenceConstants";
import { 
    USER_SIGNIN_REQUEST, USER_SIGNIN_SUCCESS, USER_SIGNIN_FAIL, 
    USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_REGISTER_FAIL, 
    USER_LOGOUT, 
    USER_UPDATE_REQUEST, USER_UPDATE_SUCCESS, USER_UPDATE_FAIL, 
    USER_AVATAR_SAVE_SUCCESS, USER_AVATAR_SAVE_FAIL, USER_AVATAR_SAVE_REQUEST, USER_AVATAR_SAVE_RESET, 
    USER_SELECT_FILE_TO_UPLOAD, USER_UPLOAD_FILE_RESET, USER_REMOVE_FILE_TO_UPLOAD,
    USER_QUERY_RECREATION_LIST_SUCCESS, USER_QUERY_REFERENCE_LIST_SUCCESS
} from "../constants/userConstants";


// function userRegisterReducer(state={}, action){
//     switch (action.type){
//         case USER_REGISTER_REQUEST:
//             return {loading: true};
//         case USER_REGISTER_SUCCESS:
//             return {loading: false, userInfo: action.payload};
//         case USER_REGISTER_FAIL:
//             return {loading: false, error: action.payload};
//         default: return state;
//     }
// }

function userSigninReducer(state={}, action){
    switch (action.type){
        //signin
        case USER_SIGNIN_REQUEST:
            return {loading: true, };
        case USER_SIGNIN_SUCCESS:
            return {loading: false, userInfo: action.payload};
        case USER_SIGNIN_FAIL:
            return {loading: false, error: action.payload};

        //register
        case USER_REGISTER_REQUEST:
            return {loading: true};
        case USER_REGISTER_SUCCESS:
            return {loading: false, userInfo: action.payload};
        case USER_REGISTER_FAIL:
            return {loading: false, error: action.payload};

        //logout
        case USER_LOGOUT:
            return {};

        default: return state;
    }
}

function userUpdateReducer(state={}, action){
    switch (action.type){
        //signin
        case USER_UPDATE_REQUEST:
            return {loading: true};
        case USER_UPDATE_SUCCESS:
            return {loading: false, success: true, userInfo: action.payload};
        case USER_UPDATE_FAIL:
            return {loading: false, error: action.payload};

        default: return state;
    }
}

function userAvatarSaveReducer(state={}, action) {
    switch(action.type){
        case USER_AVATAR_SAVE_REQUEST:
            return {loading: true};
        case USER_AVATAR_SAVE_SUCCESS:
            return {loading: false, avatar: action.payload, success: true};
        case USER_AVATAR_SAVE_FAIL:
            return {loading: false, error: action.payload}
        case USER_AVATAR_SAVE_RESET:
            return {};
        default:
            return state;
    }
}

function userUploadFileReducer(state={}, action){
    switch(action.type){
        case USER_SELECT_FILE_TO_UPLOAD:
            return {fileToUpload: action.payload};
        case USER_UPLOAD_FILE_RESET:
            return {};
        case USER_REMOVE_FILE_TO_UPLOAD:
            return {};
        default:
            return state;
    }
}

function userRecreationListReducer(state={}, action){
    switch(action.type){
        case USER_QUERY_RECREATION_LIST_SUCCESS:
            const recreationIds = action.payload;
            if(recreationIds ==  ""){
                return {recreations: []}
            } else {
                return {recreations: action.payload};
            }
            
        case RECREATION_SAVE_SUCCESS:
            if(!state.recreations){
                return{
                    ...state,
                    recreations: [action.payload._id]
                }
            } else {
                return {
                    ...state,
                    recreations: state.recreations.concat(action.payload._id)
                }
            }
        case RECREATION_DELETE_SUCCESS:
            const recreationId = action.payload.recreationId;
            
            if(state.recreations){
                const indexToRemove = state.recreations.indexOf(recreationId);
                if(indexToRemove != -1){
                    return {
                        ...state,
                        recreations: [...state.recreations.slice(0, indexToRemove), ...state.recreations.slice(indexToRemove + 1)]
                    }
                } else {
                    return state;
                }

            }else{
                return state;
            }
            
        default:
            return state;
    }
}


function userReferenceListReducer(state={}, action){
    switch(action.type){
        case USER_QUERY_REFERENCE_LIST_SUCCESS:
            const referenceIds = action.payload;
            if(referenceIds == ""){
                return {references: []};
            } else {
                return {references: action.payload};
            }
            
        case REFERENCE_SAVE_SUCCESS:
            if(!state.references){
                return{
                    ...state,
                    references: [action.payload.reference._id]
                }
            } else {
                return {
                    ...state,
                    references: state.references.concat(action.payload.reference._id)
                }
            }
        case REFERENCE_DELETE_SUCCESS:
            const referenceId = action.payload;
            
            if(state.references){
                const indexToRemove = state.references.indexOf(referenceId);
                if(indexToRemove != -1){
                    return {
                        ...state,
                        references: [...state.references.slice(0, indexToRemove), ...state.references.slice(indexToRemove + 1)]
                    }
                } else {
                    return state;
                }

            }else{
                return state;
            }

        // case REFERENCE_QUERY_SUCCESS:
        //     const reference = action.payload.reference;
        //     const userId = action.payload.userId;
        //     if(userId && userId == reference.user){
        //         if(!state.references){
        //             return{
        //                 ...state,
        //                 references: [reference._id]
        //             }
        //         } else {
        //             return {
        //                 ...state,
        //                 references: state.references.concat(reference._id)
        //             }
        //         }
        //     } else {
        //         return state;
        //     }
            
        default:
            return state;
    }
}




export{
    userSigninReducer, userUpdateReducer, userAvatarSaveReducer, userUploadFileReducer, 
    userRecreationListReducer, userReferenceListReducer
}