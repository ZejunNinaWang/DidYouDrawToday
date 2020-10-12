import React, { useEffect } from 'react';
import {Link} from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Header(props){
    const userSignin = useSelector(state=>state.userSignin);
    const {userInfo} = userSignin;
    const redirectToUploadReference = () => {
        props.history.push('/uploadreference');
    }

    return(
        <div className="header">
            <div className="brand">
                <Link to="/">
                    <img src="/static/logo1.PNG" className="header-img"></img>
                    DidYouDrawToday
                </Link>
                      
            </div>
            <div className="header-right-container">
            <div className="header-links">
                {userInfo && userInfo.name ? 
                <Link to="/profile"><img className="header-img" src="/static/default_avatar.PNG"/></Link> : 
                <Link to="/signin">Sign In</Link>}

                
            </div>
            { (userInfo && userInfo.isAdmin) &&
                <div>
                <button className="button" type="button" onClick={redirectToUploadReference}>Upload Reference</button>
            </div>

            }
            
            </div>
            
          
        </div>

        
    )
}

export default withRouter(Header);