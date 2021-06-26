import React,{ useState } from 'react'
import Dropzone from 'react-dropzone'
import styled from 'styled-components'
import { Icon } from 'antd';
import axios from 'axios';
import { set } from 'mongoose';

function FileUpload(props) {
    const [Images, setImages] = useState([]);
    //image state가 변경될때는 이미지 올리거나 지울때, 이때 상위 컴포넌트인 uploadproductpage에 props를 활용해서 바뀐사항을 보내준다.

    //onDrop Func
    const dropHandler = (files) => {
        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        
        formData.append("file", files[0]);
        //formData >> 파일에 대한 데이터 config >> 컨텐츠 타입 정의 (리퀘스트 받을때 에러 없도록)
        axios.post('/api/product/image', formData, config)
            .then(response => {
                if (response.data.success) {
                //파일 저장 성공 시
                    setImages([...Images, response.data.filePath])
                    props.refreshFunction([...Images, response.data.filePath]) //uploadproductpage에 props을 이용해 변경사항.
                    
                } else {
                    //실패시
                    alert('파일 저장에 실패 했습니다.')
            }
        })
    }
    const deleteHandler = (image) => {
        if (window.confirm('지울까요 ?')) {
            const currentIndex = Images.indexOf(image);
            let newImages = [...Images];
            newImages.splice(currentIndex, 1); //array안에 순서로 지우는 splice사용해서 현재 인덱스에서 1개지움.
            setImages(newImages);
            props.refreshFunction(newImages); //uploadproductpage에 props을 이용해 변경사항.
        }
    }
    return (
        <FileUploadStyled>
            <Dropzone onDrop={dropHandler}>
                {({getRootProps, getInputProps}) => (
                    
                        <div className="uploadButton" {...getRootProps()}>
                            <input {...getInputProps()} />
                            <Icon type="plus" style={{fontSize:'3rem'}} />
                        </div>
                    
                )}
            </Dropzone>

            <div className="uploadImageArray">
                {Images.map((image, index) => (
                    
                <div key={index} onDoubleClick={()=>{deleteHandler(image)}}>
                    <img src={`http://localhost:5000/${image}`} alt="uploadimg" />
                        </div>
                ))}
            </div>
        </FileUploadStyled>
    )
}

const FileUploadStyled = styled.div`
    display: flex;
    justify-content: space-between;
    .uploadButton{
        width: 300px;
        height: 240px;
        border: 1px solid lightgray;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .uploadImageArray{
        display: flex;
        width: 350px;
        height: 240px;
        overflow-x:auto;
    }

    img{
        min-width: 300px;
        width: 300px;
        height: 240px;
        margin-left: 3px;
    }
`;

export default FileUpload;
