import React,{useState} from 'react'
import { Typography, Button, Form, Input } from 'antd';
import styled from 'styled-components';
import FileUpload from '../../utils/FileUpload';
import axios from 'axios';
const { Title } = Typography;
const { TextArea } = Input;
const Continents = [
    { key: 1, value: 'Africa' },
    { key: 2, value: 'Europe' },
    { key: 3, value: 'Asia' },
    { key: 4, value: 'North America' },
    { key: 5, value: 'South America' },
    { key: 6, value: 'Austalia' },
    { key: 7, value: 'Antarctica' }
]
function UploadProductPage(props) {
    const [Title, setTitle] = useState('');
    const [Description, setDescription] = useState('');
    const [Price, setPrice] = useState(0);
    const [Continent, setContinent] = useState(1);
    
    const [Image, setImage] = useState([]);

    const titleChangeHandler = (e) => {
        setTitle(e.currentTarget.value);
    }
    const descriptionChangeHandler = (e) => {
        setDescription(e.currentTarget.value);
    }
    const priceChangeHandler = (e) => {
        setPrice(e.currentTarget.value);
    }
    const continentChangeHandler = (e) => {
        setContinent(e.currentTarget.value)
    }

    const updateImages = (newImages) => {
        setImage(newImages);
        console.log("updated images : ", newImages);
    }

    const submitHandler = (e) => {
        e.preventDefault();
        
        if (!Title || !Description || !Price || !Continent || !Image) {
            return alert("입력칸에 모든 값을 넣어주셔야 합니다.")
        }
        //입력칸에 채운 값들을 서버에 request
        const body = {
            //로그인 된 사람의 아이디 >> 가져오려면 props를 이용해서 (uploadproductpage가 자식 컴포넌트가 됨) hoc컴포넌트에서 auth user데이터 가져오거나 현재 로그인 된 유저의 데이터를가져오거나.
            writer: props.user.userData._id,
            title: Title,
            description: Description,
            price: Price,
            images: Image,
            continents:Continent
            
        }
        axios.post("/api/product", body)
            .then(response => {
                if (response.data.success) {
                    alert('상품 업로드에 성공했습니다.')
                    props.history.push('/'); //redirect to home
                } else {
                    alert('상품 업로드에 실패했습니다.')
            }
        })
    }
    return (
        <UploadgProductPageStyled>
            <div>
                <h2 level={2}>여행 상품 업로드</h2>
            </div>
            <Form onSubmit={submitHandler} >
                {/* dropzone */}
                <FileUpload refreshFunction={updateImages} />
                <br />
                <br />
                <label>이름</label>
                <Input onChange={titleChangeHandler} value={Title} />
                <br />
                <br />
                <label>설명</label>
                <TextArea onChange={descriptionChangeHandler} value={Description} />
                <br />
                <br />
                <label>가격($)</label>
                <Input type="number" onChange={ priceChangeHandler} value={Price }/>
                <br />
                <br />
                <select onChange={continentChangeHandler} value={Continent}>
                    {Continents.map(item => (
                        <option key={item.key} value={item.key} >{item.value}</option>
                        
                    ))}
                </select>
                <br />
                <br />
                <Button htmlType="submit">
                    확인
                </Button>
            </Form>
        </UploadgProductPageStyled>
    )
}
const UploadgProductPageStyled = styled.div`
    max-width: 700px;
    margin: 2rem auto;
    div{
        text-align: center;
        margin-bottom: 2rem;
    }
`;

export default UploadProductPage
