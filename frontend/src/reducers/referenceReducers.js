import { RECREATION_DELETE_SUCCESS, RECREATION_SAVE_SUCCESS } from "../constants/recreationConstants";
import { 
    REFERENCE_DELETE_FAIL,
    REFERENCE_DELETE_REQUEST,
    REFERENCE_DELETE_RESET,
    REFERENCE_DELETE_SUCCESS,
    REFERENCE_LIST_FAIL,
    REFERENCE_LIST_REQUEST,
    REFERENCE_LIST_SUCCESS,
    REFERENCE_QUERY_SUCCESS,
    REFERENCE_SAVE_FAIL, REFERENCE_SAVE_REQUEST, REFERENCE_SAVE_SUCCESS, REFERENCE_SAVE_RESET
} from "../constants/referenceConstants";

function referenceSaveReducer(state = {}, action){
    switch (action.type){
        case REFERENCE_SAVE_REQUEST:
            return {loading: true};
        case REFERENCE_SAVE_SUCCESS:
            return {loading: false, success: true, reference: action.payload.reference};
        case REFERENCE_SAVE_FAIL:
            return {loading: false, error: action.payload};
        case REFERENCE_SAVE_RESET:
            return {};
        default:
            return state; 
    }
}

function referenceDeleteReducer(state = {}, action){
    switch (action.type){
        case REFERENCE_DELETE_REQUEST:
            return {loading: true};
        case REFERENCE_DELETE_SUCCESS:
            return {loading: false, success: true};
        case REFERENCE_DELETE_FAIL:
            return {loading: false, error: action.payload};
        case REFERENCE_DELETE_RESET:
            return {};
        default:
            return state; 
    }
}



function referenceListReducer(state = {referenceIds: []}, action){
    switch (action.type){
        case REFERENCE_LIST_REQUEST:
            return {loading: true, referenceIds: []};
        case REFERENCE_LIST_SUCCESS:
            return {loading: false, referenceIds: action.payload};
        case REFERENCE_LIST_FAIL:
            return {loading: false, error: action.payload};
        default:
            return state; 
    }
}

function referencesByIdReducer(state = {}, action){
    let reference;
    let referenceId;
    switch(action.type){
        case REFERENCE_SAVE_SUCCESS:
        case REFERENCE_QUERY_SUCCESS:
            reference = action.payload.reference;
            return {
                ...state, 
                [reference._id]: reference
            };
        case REFERENCE_DELETE_SUCCESS:
            referenceId = action.payload;
            if(state[referenceId]){
                const {[referenceId]: value, ...newState} = state;
                return newState;
            } else {
                return state;
            }
        case RECREATION_SAVE_SUCCESS:
            reference = state[action.payload.reference]
            if(!reference){
                return state;
            }else{
                return {
                    ...state,
                    [reference._id]: {
                        ...reference,
                        numRecreations: reference.numRecreations + 1
                    }
                }
            }
        case RECREATION_DELETE_SUCCESS:
            referenceId = action.payload.referenceId;
            reference = state[referenceId];
            if(!reference){
                return state;
            }else{
                return {
                    ...state,
                    [reference._id]: {
                        ...reference,
                        numRecreations: reference.numRecreations - 1
                    }
                }
            }
            
        default:
            return state; 

        }
}

// function referenceDetailsReducer(state = {reference:{recreations:[]}}, action){
//     switch (action.type){
//         case REFERENCE_DETAILS_REQUEST:
//             return {...state, loading: true};
//         case REFERENCE_DETAILS_SUCCESS:
//             return {loading: false, reference: action.payload};
//         case REFERENCE_DETAILS_FAIL:
//             return {...state, loading: false, error: action.payload};
//         case RECREATION_SAVE_SUCCESS:
//             return {
//                 ...state,
//                 reference: {
//                     ...state.reference,
//                     recreations: state.reference.recreations.concat(action.payload._id),
//                     numRecreation: state.reference.numRecreation+1
//                 }
//             }
//         default:
//             return state; 
//     }

// }

export {referenceSaveReducer, referenceListReducer, referencesByIdReducer, referenceDeleteReducer}