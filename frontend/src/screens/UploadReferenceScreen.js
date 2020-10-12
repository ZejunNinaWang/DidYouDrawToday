import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveReference, saveReferenceReset } from '../actions/referenceActions';
import { resetFileToUpload } from '../actions/userActions';
import Dropzone from '../components/dropzone/Dropzone';
import { withRouter } from 'react-router-dom';

function UploadReferenceScreen(props){
    const dispatch = useDispatch();
    const userUploadFile = useSelector(state=>state.userUploadFile);
    const {fileToUpload} = userUploadFile;
    const [image, setImage] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [source, setSource] = useState('');
    const [uploadingFile, setUploadingFile] = useState(false);
    const [fileUploadError, setFileUploadError] = useState('');

    const referenceSave = useSelector(state => state.referenceSave);
    const {loading: loadingSave, success: successSave, error: errorSave, reference} = referenceSave;

    const userSignin = useSelector(state => state.userSignin);
    const {userInfo} = userSignin;

    useEffect(() => {
        return () => {
          console.log("cleaned up");
          resetAllstates();
        };
      }, []);

    useEffect(() => {
        if(image != ''){
            //if upload image success, dispatch action to saveReference()
            dispatch(saveReference({
                name,
                image,
                description,
                source
            }));
        }

    }, [image])

    useEffect(() => {
        //reset image after successfully saving reference
        if(successSave){
            resetAllstates();

            //show upload success message and option to redirect to new reference page
            props.history.push("/references/"+reference._id);
        }
        

    }, [successSave])

    const resetAllstates = () => {
        setImage('');
        setName('');
        setSource('');
        setDescription('');
        dispatch(resetFileToUpload());
        dispatch(saveReferenceReset());
    }

    const submitHandler = (e) => {
        e.preventDefault();
        if(uploadingFile || loadingSave){
            return;
        }
        console.log("in submit reference")
        //upload fileToUpload
        if(fileToUpload){
            console.log("fileToUpload is", fileToUpload);
            // setUploadingFile(true);
            // const bodyFormData = new FormData();
            // bodyFormData.append('image', fileToUpload); 
            // console.log("bodyFormData is ", bodyFormData)
            // Axios.post('/api/uploads/references', bodyFormData, {
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
            const res = await fetch('/api/uploads/references', {
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
        <div className='form'>
            <form onSubmit={submitHandler}>
                <ul className="form-container">
                    <li><h2>Upload Reference</h2></li>
                    {uploadingFile && <div className="loading"><i className="fa fa-spinner fa-spin"></i></div>}

                    {loadingSave && <div className="loading"><i className="fa fa-spinner fa-spin"></i></div>}
                    {(errorSave || fileUploadError) && <div className="error">{errorSave? errorSave : fileUploadError ? fileUploadError : ''}</div>}

                    
                    <li>
                        <p className="image-label">Image</p>
                        <Dropzone/>
                    </li>

                    <li>
                        <label htmlFor="name">Title</label>
                        <input type="text" name="name" value={name} id="name" onChange={(e) => setName(e.target.value)}></input>
                    </li>

                    <li>
                        <label htmlFor="source">source</label>
                        <input type="text" name="source" value={source} id="source" onChange={(e) => setSource(e.target.value)}></input>
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
                    <button 
                        type="submit" 
                        className="button"
                        disabled = {!fileToUpload || !name|| !source|| !description || uploadingFile || loadingSave}
                        >Upload</button>
                    </li>
                    <li>
                    <button 
                        type = "button"
                        onClick={props.history.goBack}
                        className="button secondary"
                        disabled = {uploadingFile || loadingSave}
                        >Back</button>
                    </li>
                </ul>
            </form>
        </div>
    )
}

export default withRouter(UploadReferenceScreen);
