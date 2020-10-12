import Axios from "axios";
import Qs from 'qs';
import { 
    RECREATION_SAVE_FAIL, RECREATION_SAVE_REQUEST, RECREATION_SAVE_SUCCESS, RECREATTION_SAVE_RESET,
    RECREATTION_LIST_FAIL, RECREATTION_LIST_REQUEST, RECREATTION_LIST_SUCCESS, 
    RECREATION_QUERY_REQUEST, RECREATION_QUERY_SUCCESS, RECREATION_QUERY_FAIL, 
    RECREATION_DELETE_REQUEST, RECREATION_DELETE_SUCCESS, RECREATION_DELETE_FAIL, RECREATION_DELETE_RESET
} from "../constants/recreationConstants";

const saveRecreation = (recreation) => async (dispatch, getState) => {
    try{
        dispatch({type: RECREATION_SAVE_REQUEST, payload: recreation});
        const {userSignin: {userInfo}} = getState();
        const {data} = await Axios.post('/api/recreations', recreation, {
            headers: {
                'Authorization': 'Bearer ' + userInfo.token
            }
        });
        dispatch({type: RECREATION_SAVE_SUCCESS, payload: data.data});

    } catch (error) {
        dispatch({type: RECREATION_SAVE_FAIL, payload: error.message});
    }
}

const saveRecreationReset = () => (dispatch) => {
    dispatch({type: RECREATTION_SAVE_RESET});
}

const deleteRecreationReset = () => (dispatch) => {
    dispatch({type: RECREATION_DELETE_RESET});
}

const listRecreations = (recreationIds, timeOrder = '', likesOrder='') => async (dispatch) => {
    try {
        dispatch({type: RECREATTION_LIST_REQUEST})
        const {data} = await Axios.get(
            '/api/recreations?timeOrder=' +
            timeOrder +
            '&likesOrder=' +
            likesOrder ,
            {'params': {recreationIds},
            'paramsSerializer': function(params) {
                return Qs.stringify(params)
            },
            }
        );
        dispatch({type: RECREATTION_LIST_SUCCESS, payload: data.data});

        
    } catch (error) {
        dispatch({type: RECREATTION_LIST_FAIL, payload: error.message});
    }
}

const queryRecreation = (recreationId) => async (dispatch) => {
    try {
        dispatch({type: RECREATION_QUERY_REQUEST});
        const {data} = await Axios.get('/api/recreations/'+recreationId);
        dispatch({type: RECREATION_QUERY_SUCCESS, payload: data.data});

        
    } catch (error) {
        dispatch({type: RECREATION_QUERY_FAIL, payload: error.message});
    }
}

const deleteRecreation = (recreationId, referenceId) => async (dispatch) => {
    try {
        dispatch({type: RECREATION_DELETE_REQUEST});
        const {data} = await Axios.delete('/api/recreations/'+recreationId);
        dispatch({type: RECREATION_DELETE_SUCCESS, payload: {recreationId, referenceId}});

        
    } catch (error) {
        dispatch({type: RECREATION_DELETE_FAIL, payload: error.message});
    }
}


export {
    saveRecreation, saveRecreationReset, listRecreations, queryRecreation, deleteRecreation, deleteRecreationReset
}