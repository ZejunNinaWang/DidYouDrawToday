import Axios from "axios";
import { 
    REFERENCE_LIST_FAIL, REFERENCE_LIST_REQUEST, REFERENCE_LIST_SUCCESS, 
    REFERENCE_SAVE_FAIL, REFERENCE_SAVE_REQUEST, REFERENCE_SAVE_SUCCESS,
    REFERENCE_QUERY_REQUEST, REFERENCE_QUERY_SUCCESS, REFERENCE_QUERY_FAIL,
    REFERENCE_RECREATION_LIST_QUERY_REQUEST, REFERENCE_RECREATION_LIST_QUERY_SUCCESS, REFERENCE_RECREATION_LIST_QUERY_FAIL, REFERENCE_DELETE_REQUEST, REFERENCE_DELETE_SUCCESS, REFERENCE_DELETE_FAIL, REFERENCE_DELETE_RESET, REFERENCE_SAVE_RESET
} from "../constants/referenceConstants";

const saveReference = (reference) => async (dispatch, getState) => {
    try{
        dispatch({type: REFERENCE_SAVE_REQUEST, payload: reference});
        const {userSignin: {userInfo}} = getState();
        const {data} = await Axios.post('/api/references', reference, {
            headers: {
                'Authorization': 'Bearer ' + userInfo.token
            }
        });
        dispatch({type: REFERENCE_SAVE_SUCCESS, payload: {reference: data.data}});

    } catch (error) {
        dispatch({type: REFERENCE_SAVE_FAIL, payload: error.message});
    }
}

const saveReferenceReset = () => (dispatch) => {
    dispatch({type: REFERENCE_SAVE_RESET});
}

const deleteReference = (referenceId) => async (dispatch, getState) => {
    try {
        dispatch({type: REFERENCE_DELETE_REQUEST});
        const {userSignin: {userInfo}} = getState();
        const {data} = await Axios.delete('/api/references/'+referenceId, {
            headers: {
                'Authorization': 'Bearer ' + userInfo.token
            }
        });
        dispatch({type: REFERENCE_DELETE_SUCCESS, payload: referenceId});
    } catch (error) {
        dispatch({type: REFERENCE_DELETE_FAIL, payload: error.message});
    }
}

const deleteReferenceReset = () => (dispatch) => {
    dispatch({type: REFERENCE_DELETE_RESET});
}

const listReferences = (
    category = '',
    searchKeyword = ''
    ) => async (dispatch) => {
    try{
        dispatch({type:REFERENCE_LIST_REQUEST});
        //send ajax request to server
        const {data} = await Axios.get(
            '/api/references?category=' +
            category +
            '&searchKeyword=' +
            searchKeyword
        );
        dispatch({type: REFERENCE_LIST_SUCCESS, payload: data});

        //get all likes after getting products
        // dispatch(getAllLikes(data));
    }
    catch(error)
    {
        dispatch({type: REFERENCE_LIST_FAIL, payload: error.message});
    }
    
}

const queryReference = (referenceId) => async (dispatch, getState) => {
    try {
        dispatch({type: REFERENCE_QUERY_REQUEST});
        const {data} = await Axios.get('/api/references/'+referenceId);
        const {userSignin: {userInfo}} = getState();
        dispatch({type: REFERENCE_QUERY_SUCCESS, payload: {reference: data.data, userId: userInfo? userInfo._id : null}});

        
    } catch (error) {
        dispatch({type: REFERENCE_QUERY_FAIL, payload: error.message});
    }
}

// const queryReferenceRecreationList = (referenceId) => async (dispatch) => {
//     try {
//         dispatch({type: REFERENCE_RECREATION_LIST_QUERY_REQUEST})
//         const {data} = await Axios.get('/api/references/'+referenceId+'/recreations');
//         dispatch({type: REFERENCE_RECREATION_LIST_QUERY_SUCCESS, payload: data});
        
//     } catch (error) {
//         dispatch({type: REFERENCE_RECREATION_LIST_QUERY_FAIL, payload: error.message});
//     }
// }


// const detailsReference = (referenceId) => async (dispatch) => {
//     try{
//         dispatch({type:REFERENCE_DETAILS_REQUEST, payload: referenceId});
//         const {data} = await Axios.get("/api/references/" + referenceId);
//         dispatch({type: REFERENCE_DETAILS_SUCCESS, payload: data});
//     }
//     catch(error)
//     {
//         dispatch({type: REFERENCE_DETAILS_FAIL, payload: error.message});
//     }
// }

export {
    saveReference, saveReferenceReset, listReferences, queryReference, deleteReference, deleteReferenceReset
}