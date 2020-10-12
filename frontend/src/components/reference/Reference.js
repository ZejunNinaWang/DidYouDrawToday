import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Like from '../Like';
import { CloudinaryContext, Image } from "cloudinary-react";
import { queryReference } from '../../actions/referenceActions';

export default function Reference(props){
    const dispatch = useDispatch();
    const reference = useSelector(state => state.referencesById[props.referenceId]);
    const userSignin = useSelector(state=>state.userSignin);
    const {userInfo} = userSignin;

    useEffect(()=> {
        if(!reference){
            dispatch(queryReference(props.referenceId));
        }else{
            console.log("reference is ", reference);
        }
    }, [reference])

    return(
        <li className={props.inProfile?"":"grow"} key = {props.referenceId}>
            {reference && 
                <div className="reference">
                    <Link to={'/references/' + props.referenceId}>
                        <Image 
                            className = "reference-image"
                            cloudName='nanaCloud'
                            publicId={reference.image_public_id}
                        />
                    </Link>
                    <div className="reference-name">
                        <Link to={'/references/' + props.referenceId}>{reference.name}</Link>
                    </div>
                    <div className="reference-like">
                        {/* <Link> */}
                        <Like 
                            like={false} 
                            numRecreations={reference.numRecreations}
                            referenceId={reference._id}
                            myReference={userInfo && userInfo._id && userInfo._id==reference.user ? true : false}
                            inProfile={props.inProfile}
                        />
                        {/* </Link> */}
                    </div>
                    
                </div>
            }
            
        </li>
    )

}