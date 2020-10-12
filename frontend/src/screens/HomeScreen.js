import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import Like from '../components/Like';
import { listReferences } from '../actions/referenceActions';
import Reference from '../components/reference/Reference';
import { CloudinaryContext, Image } from "cloudinary-react";


function HomeScreen(props){
    const referenceList = useSelector(state => state.referenceList); 
    const {referenceIds, loading, error} = referenceList;
    

    const dispatch = useDispatch();

    //didMount
    useEffect(() => {
        dispatch(listReferences());
    }, [])  

    return(
        <div className="content-margined">
            {
                loading ? <div className="loading"><img className="no-result-found" src='https://res.cloudinary.com/nanacloud/image/upload/v1602381271/utils/loading_svftwe.gif'/></div> :
                error ? <div>{error}</div> :
                referenceIds.length === 0 ? <div><img className="no-result-found" src='https://res.cloudinary.com/nanacloud/image/upload/v1602381500/utils/no_results_found_u1skuc.png'/></div> :
                <div>
                <ul className="references">
                    {     
                        referenceIds.map(referenceId => {
                            return(
                                <Reference 
                                    key={referenceId} 
                                    referenceId={referenceId}
                                    inProfile={false}
                                />
                            )
                        })
                    }
                    
                </ul>
                </div>
            }
        </div>
    )
}

export default HomeScreen;