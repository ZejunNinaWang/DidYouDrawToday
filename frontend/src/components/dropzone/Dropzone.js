import React, { useRef, useState, useEffect } from 'react';

import './Dropzone.css';
import { selectFileToUpload, removeFileToUpload } from '../../actions/userActions';
import { useDispatch, useSelector } from 'react-redux';

export default function Dropzone(props){
    const dispatch = useDispatch();
    const fileInputRef = useRef();
    const modalImageRef = useRef();
    const modalRef = useRef();
    const progressRef = useRef();
    const uploadRef = useRef();
    const uploadModalRef = useRef();
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [validFiles, setValidFiles] = useState([]);
    const [unsupportedFiles, setUnsupportedFiles] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const [validFile, setValidFile] = useState({name:'', size: ''});
    const [showDropzone, setShowDropzone] = useState(true);

    const userUploadFile = useSelector(state=>state.userUploadFile);
    const {fileToUpload} = userUploadFile;

    useEffect(() => {
        //triggered when uploadReferenceScreen successfully saved reference
        if(!fileToUpload){
            // setValidFiles(prevArray => []);
            removeFile();
        }
    }, [fileToUpload])

    useEffect(() => {
        if(validFiles.length > 0){
            console.log("validFiles[0] is ", validFiles[0])
            //convert uploaded file
            const reader = new FileReader();
            reader.readAsDataURL(validFiles[0]);
            reader.onloadend = () => {
                console.log("reader.result is ", reader.result);
                dispatch(selectFileToUpload(reader.result));
            }

            reader.onerror = () => {
                setErrorMessage("Failed to read image as url");
            }

            
        }else{
            dispatch(removeFileToUpload());
        }

    }, [validFiles])

    const preventDefault = (e) => {
        e.preventDefault();
        // e.stopPropagation();
    }

    const dragOver = (e) => {
        preventDefault(e);
    }

    const dragEnter = (e) => {
        preventDefault(e);
    }

    const dragLeave = (e) => {
        preventDefault(e);
    }

    const fileDrop = (e) => {
        preventDefault(e);
        const files = e.dataTransfer.files;
        if (files.length == 1) {
            handleFiles(files);
        }
    }

    const filesSelected = () => {
        if (fileInputRef.current.files.length == 1) {
            handleFiles(fileInputRef.current.files);
        }
    }

    const fileInputClicked = () => {
        fileInputRef.current.click();
    }

    const handleFiles = (files) => {
        if(validateFile(files[0])){
            setValidFiles(prevArray => [files[0]]);
            //hide dropzone
            setShowDropzone(prevState => false);
            //show uploaded file
            setErrorMessage('');

        } else {
            //show error message
            setErrorMessage('File type not permitted');
        }
    }

    const validateFile = (file) => {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (validTypes.indexOf(file.type) === -1) {
            return false;
        }
        return true;
    }

    const fileSize = (size) => {
        if (size === 0) {
          return '0 Bytes';
        }
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(size) / Math.log(k));
        return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    const fileType = (fileName) => {
        return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length) || fileName;
    }

    const removeFile = () => {
        setValidFiles(prevArray => []);
        setShowDropzone(prevState => true);
        fileInputRef.current.value = '';
    }

    const uploadFiles = () => {
        
    }

    

    return(
        <>
            {/* {unsupportedFiles.length === 0 && validFiles.length ? <button className="file-upload-btn" onClick={() => uploadFiles()}>Upload Files</button> : ''}  */}
            {/* {unsupportedFiles.length ? <p>Please remove all unsupported files.</p> : ''} */}
            <p style={{display: errorMessage != ''? '':'none', color:'red'}}>{errorMessage}</p>
            <div className="drop-container"
                // onDragOver={dragOver}
                // onDragEnter={dragEnter}
                // onDragLeave={dragLeave}
                // onDrop={fileDrop}
                onClick={fileInputClicked}
                style={{display: showDropzone? '':'none'}}

            > 
                <p className="drop-text">+</p>
                <input
                    ref={fileInputRef}
                    className="file-input"
                    type="file"
                    onChange={filesSelected}
                />
            </div>

            <div className="file-display-container">
                {
                    validFiles.map((data, i) => 
                        <div className="file-status-bar" key={i}>
                            <div >
                                <div className="file-type-logo"></div>
                                <div className="file-type">{fileType(data.name)}</div>
                                <span className={"file-name"}>{data.name}</span>
                                <span className="file-size">({fileSize(data.size)})</span>
                            </div>
                            <div className="file-remove" onClick={() => removeFile(data.name)}>X</div>
                        </div>
                    )
                }
            </div>
        </>
    )
}

