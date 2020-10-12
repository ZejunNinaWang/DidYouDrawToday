import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {deleteRecreation, deleteRecreationReset} from '../actions/recreationActions';
import { deleteReference, deleteReferenceReset } from '../actions/referenceActions';

export default function Like(props){
    const dispatch = useDispatch();
    const removeModalRef = useRef();

    const recreationDelete = useSelector(state => state.recreationDelete);
    const {loading: loadingRecreationDelete, success: successRecreationDelete, error: errorRecreationDelete} = recreationDelete;

    const referenceDelete = useSelector(state => state.referenceDelete);
    const {loading: loadingReferenceDelete, success: successReferenceDelete, error: errorReferenceDelete} = referenceDelete;

    const showRemoveModel = () => {
      removeModalRef.current.style.display = 'block';

    }

    const closeRemoveModel = () => {
      removeModalRef.current.style.display = 'none';
      dispatch(deleteRecreationReset());
      dispatch(deleteReferenceReset());
    }

    const submitHandler = (e) => {
      e.preventDefault();
      if(loadingRecreationDelete || loadingReferenceDelete){
        return;
      }
      if(props.myRecreation){
        if(props.recreationId && props.referenceId){
          console.log('To delete recreaionId is ', props.recreationId);
          dispatch(deleteRecreation(props.recreationId, props.referenceId));
        }
      } else if (props.myReference){
        //delete reference if it has no recreations
        if(props.referenceId){
          console.log("to delete referenceId is", props.referenceId);
          dispatch(deleteReference(props.referenceId))
        }

      }

      

    }
    return(
      <>
        <div className="like">
            {props.numRecreations > -1 && 
            <div className="reference-details">
                {props.numRecreations} Recreations
            </div>
            }

            
            {props.myRecreation && 
              <div className="trash-icon-container"
                onClick={showRemoveModel}>
                <i className="fa fa-trash-o"></i>
              </div>
            }

            {(props.myReference && props.inProfile) && 
              <div className="trash-icon-container"
                onClick={showRemoveModel}>
                <i className="fa fa-trash-o"></i>
              </div>
            }

            <div className="like-span">
              
              <i
                className={
                  props.like === true 
                  ? 'fa fa-heart'
                  : 'fa fa-heart-o'
                }
              ></i>
            </div>



            
          
        </div>
        <div className="upload-overlay" ref={removeModalRef}>
          <form onSubmit={submitHandler}>
            <ul className = {((props.myReference && props.numRecreations < 1) ||(props.myRecreation)) ? "form-container delete" :"form-container cantDelete"}>
              {loadingRecreationDelete && <div className="loading"><i className="fa fa-spinner fa-spin"></i></div>}
              {errorRecreationDelete && <div className="error">{errorRecreationDelete}</div>}

              {loadingReferenceDelete && <div className="loading"><i className="fa fa-spinner fa-spin"></i></div>}
              {errorReferenceDelete && <div className="error">{errorReferenceDelete}</div>}
              
              {props.myRecreation &&
              <>
                <li>Are you sure to remove the recreation?</li>
                <li>
                      <button 
                          type="submit" 
                          className="button"
                          disabled={loadingRecreationDelete || loadingReferenceDelete}
                          >Yes, please delete</button>
                </li>
                <li>
                      <button 
                          type = "button"
                          onClick={() => closeRemoveModel()}
                          className="button secondary"
                          disabled={loadingRecreationDelete || loadingReferenceDelete}
                          >Cancel
                      </button>
                </li>
              </>
              }

              {(props.myReference && props.numRecreations < 1) &&
              <>
                <li>Are you sure to remove the reference?</li>
                <li>
                      <button 
                          type="submit" 
                          className="button"
                          disabled={loadingRecreationDelete || loadingReferenceDelete}
                          >Yes, please delete</button>
                      </li>
                      <li>
                      <button 
                          type = "button"
                          onClick={() => closeRemoveModel()}
                          className="button secondary"
                          disabled={loadingRecreationDelete || loadingReferenceDelete}
                          >Cancel
                      </button>
                  </li>
              </>
              }

              {(props.myReference && props.numRecreations >= 1) &&
              <>
                <li>The reference already has recreations. You cannot delete the reference anymore.</li>
                <li>
                      <button 
                          type = "button"
                          onClick={() => closeRemoveModel()}
                          className="button secondary"
                          disabled={loadingRecreationDelete || loadingReferenceDelete}
                          >Cancel
                      </button>
                </li>
              </>
              }


            </ul>

          </form>


                
        </div>
        </>
        
    )
}