import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
// import { detailsReference } from '../actions/referenceActions';
import Like from '../components/Like';
import Dropzone from '../components/dropzone/Dropzone';
import { resetFileToUpload } from '../actions/userActions';
import { deleteRecreationReset, listRecreations, saveRecreation, saveRecreationReset } from '../actions/recreationActions';
import Axios from 'axios';
import Recreation from '../components/recreation/Recreation';
import { recreationListReducer } from '../reducers/recreationReducers';
import { CloudinaryContext, Image } from "cloudinary-react";
import { queryReference } from '../actions/referenceActions';

function ReferenceScreen(props){
    const dispatch = useDispatch();
    const reference = useSelector(state => state.referencesById[props.match.params.id]);
    const uploadModalRef = useRef();

    const userUploadFile = useSelector(state=>state.userUploadFile);
    const {fileToUpload} = userUploadFile;

    const [image, setImage] = useState('');
    const [description, setDescription] = useState('');
    const [source, setSource] = useState('');
    const [uploadingFile, setUploadingFile] = useState(false);
    const [fileUploadError, setFileUploadError] = useState('');

    const recreationSave = useSelector(state => state.recreationSave);
    const {loading: loadingSave, success: successSave, error: errorSave, recreation} = recreationSave;

    const [recreationIds, setRecreationIds] = useState();
    const [recreationListError, setRecreationListError] = useState('');

    const userSignin = useSelector(state => state.userSignin);
    const {userInfo} = userSignin;



    const recreationDelete = useSelector(state => state.recreationDelete);
    const {loading: loadingDelete, success: successDelete, error: errorDelete} = recreationDelete;



    useEffect(() => {
        if(!reference){
            dispatch(queryReference(props.match.params.id));
        }
    }, [reference])

    useEffect(() => {
        //query recreation list of this reference
        queryReferenceRecreationList(props.match.params.id);
    }, [])



    useEffect(() => {
        if(image != ''){
            //if upload image success, dispatch action to saveRecreation()
            dispatch(saveRecreation({
                image,
                description,
                source,
                referenceId: props.match.params.id
            }));
        }
    }, [image])

    useEffect(() => {
        //reset image after successfully saving reference
        if(successSave){
            queryReferenceRecreationList(props.match.params.id);
            //show upload success message and close form
            closeUploadModal();
            
        }
    }, [successSave])

    useEffect(() => {
        if(successDelete){
            queryReferenceRecreationList(props.match.params.id);
            //show upload success message and close form
            closeUploadModal();
        }
    }, [successDelete])

    const queryReferenceRecreationList = async (referenceId) => {
        try {
            const {data} = await Axios.get(`/api/references/${referenceId}/recreations`);
            setRecreationIds(data);
        } catch (error) {
            setRecreationListError(error)
        }
    }

    const openUploadRecreationForm = () => {
        uploadModalRef.current.style.display = 'block';
    }

    const closeUploadModal = () => {
        uploadModalRef.current.style.display = 'none';
        //clear form
        setImage('');
        setSource('');
        setDescription('');
        dispatch(resetFileToUpload());

        setUploadingFile(false);
        setFileUploadError('');

        dispatch(saveRecreationReset());
        dispatch(deleteRecreationReset());

    }

    const submitHandler = (e) => {
        e.preventDefault();
        //upload fileToUpload
        if(fileToUpload){
            // setUploadingFile(true);
            // const bodyFormData = new FormData();
            // bodyFormData.append('image', fileToUpload); //so we can send ajax request 

            // Axios.post('/api/uploads/recreations', bodyFormData, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data',
            //     },
            // }).then(response => {
            //     console.log("upload success ", response.data.file.filename);
            //     setImage(response.data.file.filename);
            //     setUploadingFile(false);
                
            // }).catch(err => {
            //     setFileUploadError('Failed to upload image to server.' + err);
            //     setUploadingFile(false);
            // });
            uploadImage(fileToUpload);
        }
    }

    const uploadImage = async (base64EncodedImage) => {
        try {
            setUploadingFile(true);
            const res = await fetch('/api/uploads/recreations', {
                method: 'POST',
                body: JSON.stringify({ data: base64EncodedImage }),
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userInfo.token
                },
            });
            const data = await res.json();
            console.log("upload data is ", data);
            setImage(data.public_id);
            setUploadingFile(false);
        } catch (err) {
            setFileUploadError('Failed to upload image to server.' + err);
            setUploadingFile(false);
        }
    };
    
    

    return(
        <>
        <div className="upload-overlay" ref={uploadModalRef}>
                <form onSubmit={submitHandler}>
                <ul className="form-container recreation">
                    <li><h2>Upload Recreation</h2></li>
                    {uploadingFile && <div className="loading"><i className="fa fa-spinner fa-spin"></i></div>}

                    {loadingSave && <div className="loading"><i className="fa fa-spinner fa-spin"></i></div>}
                    {(errorSave || fileUploadError) && <div className="error">{errorSave? errorSave : fileUploadError ? fileUploadError : ''}</div>}

                    
                    <li>
                        <p className="image-label">Image</p>
                        <Dropzone/>
                    </li>

                    <li>
                        <label htmlFor="description">Description</label>
                        <textarea
                        name="description"
                        value={description}
                        id="description"
                        onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </li>

                    <li>
                        <label htmlFor="source">Source (optional)</label>
                        <input type="text" name="source" value={source} id="source" onChange={(e) => setSource(e.target.value)}></input>
                    </li>


                    <li>
                    <button 
                        type="submit" 
                        className="button"
                        disabled = {(!fileToUpload || !description) || loadingSave || uploadingFile}
                        >Upload</button>
                    </li>
                    <li>
                    <button 
                        type = "button"
                        onClick={() => closeUploadModal()}
                        className="button secondary"
                        disabled = {loadingSave || uploadingFile}
                        >Back</button>
                    </li>
                    
                </ul>

                </form>
                
                
        </div>
        <div className="content-margined">
            {/* {loading && <div className="loading"><i className="fa fa-spinner fa-spin"></i></div>} */}
            {/* {error && <div className="loading"><img className="no-result-found" src="/static/no_results_found.PNG"/></div>} */}
            {reference &&
            <>
            <div className="details">
                <div className="details-image">
                    <Image 
                        cloudName='nanaCloud'
                        publicId={reference.image_public_id}
                    />
                </div>
                <div className="details-info">
                    <ul>
                        <li>
                            <div className="reference-name">{reference.name}</div>
                        </li>
                        <li>
                            Uploader: 
                            <div>
                            {reference.user}
                            </div>
                            
                        </li>
                        <li>
                            Source: 
                            <div>
                            {reference.source}
                            </div>
                            
                        </li>
                        <li>
                            Description:
                            <div className='details-description'>
                                {reference.description}
                            </div>
                        </li>
                        <li>
                            <button className="button" onClick={() => openUploadRecreationForm()}>Upload Recreation</button>
                        </li>
                    </ul>

                </div>
    
            </div>
            {recreationIds && 
                <div className="recreation-head">
                    {recreationIds.length} {recreationIds.length > 1 ?   'Recreations': 'Recreation'}
                </div>
            }
 
            </>
            }

            {(recreationIds && recreationIds.length > 0) && 
            <div className="recreation-container">
                <ul className="recreations">
                    {recreationIds.map(recreationId => recreationId).reverse().map(recreationId => {
                    return(
                            <Recreation key={recreationId} recreationId={recreationId} />
                            
                    )
                    })
                    }       
                </ul>

            </div>
            }


        </div>

        
        
        
        </>
    )

}

export default ReferenceScreen;