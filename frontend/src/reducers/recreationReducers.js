import { 
    RECREATION_SAVE_FAIL, RECREATION_SAVE_REQUEST, RECREATION_SAVE_SUCCESS, RECREATTION_SAVE_RESET,
    RECREATTION_LIST_FAIL, RECREATTION_LIST_REQUEST, RECREATTION_LIST_SUCCESS, 
    RECREATION_QUERY_SUCCESS, RECREATION_DELETE_SUCCESS, RECREATION_DELETE_REQUEST, RECREATION_DELETE_FAIL, RECREATION_DELETE_RESET
} from "../constants/recreationConstants";

function recreationSaveReducer(state = {}, action){
    switch (action.type){
        case RECREATION_SAVE_REQUEST:
            return {loading: true};
        case RECREATION_SAVE_SUCCESS:
            return {loading: false, success: true, recreation: action.payload};
        case RECREATION_SAVE_FAIL:
            return {loading: false, error: action.payload};
        case RECREATTION_SAVE_RESET:
            return {}
        default:
            return state; 
    }
}

function recreationDeleteReducer(state = {}, action){
    switch (action.type){
        case RECREATION_DELETE_REQUEST:
            return {loading: true};
        case RECREATION_DELETE_SUCCESS:
            return {loading: false, success: true};
        case RECREATION_DELETE_FAIL:
            return {loading: false, error: action.payload};
        case RECREATION_DELETE_RESET:
            return {}
        default:
            return state; 
    }
}

function recreationListReducer(state={recreations:[]}, action){
    switch (action.type){
        case RECREATTION_LIST_REQUEST:
            return {loading: true};
        case RECREATTION_LIST_SUCCESS:
            return {loading: false, recreations: action.payload};
        case RECREATTION_LIST_FAIL:
            return {loading: false, error: action.payload};
        default:
            return state; 
    }
}

function recreationsByIdReducer(state={}, action){
    let recreation;
    switch(action.type){
        case RECREATION_SAVE_SUCCESS:
        case RECREATION_QUERY_SUCCESS:
            recreation = action.payload;
            return {
                ...state, 
                [recreation._id]: recreation
            };
        case RECREATION_DELETE_SUCCESS:
            const recreationId = action.payload.recreationId;
            if(state[recreationId]){
                const {[recreationId]: value, ...newState} = state;
                return newState;
            } else {
                return state;
            }
            

        default:
            return state; 
    }
}
export {recreationSaveReducer, recreationDeleteReducer, recreationListReducer, recreationsByIdReducer}
