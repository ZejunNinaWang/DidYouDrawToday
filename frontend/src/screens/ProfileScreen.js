import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { queryUserRecreationList, queryUserReferenceList } from '../actions/userActions';
import Recreation from '../components/recreation/Recreation';
import Reference from '../components/reference/Reference';

function ProfileScreen(props){
    const dispatch = useDispatch();
    const userSignin = useSelector(state => state.userSignin);
    const {userInfo} = userSignin;

    const userRecreationList = useSelector(state => state.userRecreationList);
    const {recreations: userRecreations} = userRecreationList;

    const userReferenceList = useSelector(state => state.userReferenceList);
    const {references: userReferences} = userReferenceList;

    useEffect(() => {
        dispatch(queryUserRecreationList());
        dispatch(queryUserReferenceList());
    }, [])
    // useEffect(() => {
    //     if(!userRecreations){
    //         console.log("no user recreation list");
    //         dispatch(queryUserRecreationList());
    //     }
    // }, [userRecreations])

    // useEffect(() => {
    //     if(!userReferences){
    //         console.log("no user reference list");
    //         dispatch(queryUserReferenceList());
    //     }
    // }, [userReferences])


    return (
        <div className="content-margined">
            <div className="profile">
                <ul className="profile-info">
                    <li><img className="profile-avatar" src="/static/default_avatar.PNG"/></li>
                    <li><div className="profile-name">{userInfo.name}</div></li>
                    <li><div className="profile-level">some user level</div></li>
                    
                </ul>
            </div>
            <div className="recreation-head">
                Your recreations:
            </div>

            {(userRecreations && userRecreations.length > 0) && 
                <div className="recreation-container">
                    <ul className="recreations">
                        {userRecreations.map(recreationId => recreationId).reverse().map(recreationId => {
                        return(
                                <Recreation 
                                    recreationId = {recreationId}
                                    key={recreationId}
                                />
                                
                        )
                        })
                        }       
                    </ul>

                </div>
            }

            {(userRecreations && userRecreations.length == 0) && 
                <div className="recreation-container">
                    <p>You don't have recreations yet. Go practice!</p>

                </div>
            }

            <div className="reference-head">
                Your references:
            </div>

            {(userReferences && userReferences.length == 0) && 
                <div className="recreation-container">
                    You don't have references yet. 

                </div>
            }

            {(userReferences && userReferences.length > 0) && 
                <div className="recreation-container">
                    <ul className="recreations">
                        {userReferences.map(referenceId => referenceId).reverse().map(referenceId => {
                        return(
                                <Reference 
                                    referenceId = {referenceId}
                                    key={referenceId}
                                    inProfile={true}
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
export default ProfileScreen;