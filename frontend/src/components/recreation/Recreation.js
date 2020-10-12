import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { queryRecreation } from '../../actions/recreationActions';
import Like from '../Like';
import './Recreation.css';
import { CloudinaryContext, Image } from "cloudinary-react";

export default function Recreation(props){
    const dispatch = useDispatch();
    const recreation = useSelector(state => state.recreationsById[props.recreationId]);
    const userSignin = useSelector(state=>state.userSignin);
    const {userInfo} = userSignin;
    useEffect(()=> {
        if(!recreation){
            dispatch(queryRecreation(props.recreationId));
        }
    }, [recreation])
    return(
        <li className="recreation">
            {recreation && 
            <>
                <Link to={'/recreations/' + props.recreationId}>
                {/* <img className="recreation-image" src={"../api/image/recreations/"+recreation.image} alt="recreation"/> */}
                <Image 
                    className = "recreation-image"
                    cloudName='nanaCloud'
                    publicId={recreation.image_public_id}
                />
                <div className="recreation-user">
                    by {recreation.user}
                </div>
                </Link>
                
                <div className="recreation-like">
                    <Like 
                        recreationId={props.recreationId} 
                        referenceId={recreation.reference}
                        like={false} myRecreation={userInfo && userInfo._id && userInfo._id==recreation.user ? true : false}
                    />
                </div>
            </>
            
            }
            
        </li>
    )

}