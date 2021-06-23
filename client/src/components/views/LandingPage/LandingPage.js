import React,{useEffect,useState} from 'react'
import styled from 'styled-components';
import axios from 'axios';
import { Icon, Col, Card, Row } from 'antd';
import Meta from 'antd/lib/card/Meta';
function LandingPage() {
    const [Products, setProducts] = useState([]);


    useEffect(() => {
        // let body = {}
        axios.post('/api/product/products')
            .then(response => {
                if (response.data.success) {
                    console.log(response.data);
                    setProducts(response.data.productInfo);
                } else {
                    alert("상품들을 가져오는데 실패했습니다. 관리자에게 문의하세요.")
            }
        })
    }, [])

    const renderCards = Products.map((product, index) => {
        //Col은 24사이즈인데 lg는 가장 클때이고 파라미터값의미는 각각 6씩 가져간다. 그다음은 md(반정도 되었을때) xs는 작은사이즈
        return <Col lg={6} md={8} xs={24} key={index}>
            <Card
                cover = {<img src={`http://localhost:5000/${product.images[0]}`} />}
                >
                <Meta
                    title={product.title}
                    description={`$${product.price}`}
                    />
            </Card>
        </Col>
    })

    return (
        <LandingPageStyled>
            <div className="titleText">
                <h2>Let's Travel Anywhere <Icon type="rocket" /></h2>
            </div>
            {/* filter */}

            {/* search */}

            {/* cards gutter은 여백 */}
            <Row gutter={[16,16]} >
                {renderCards}
            </Row>
            


            <div className="addBtn">
                <button>더보기</button>
            </div>

        </LandingPageStyled>
    )
}

const LandingPageStyled = styled.div`
    width: 75%;
    margin: 3rem auto;
    .titleText{
        text-align: center;
    }
    .addBtn{
        display: flex;
        justify-content: center;
    }
    .ant-card-cover{
        img{
            width: 100%;
            max-height: 150px;
        }
    }
`;
export default LandingPage
