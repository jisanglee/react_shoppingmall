import React,{useEffect,useState} from 'react'
import styled from 'styled-components';
import axios from 'axios';
import { Icon, Col, Card, Row } from 'antd';
import Meta from 'antd/lib/card/Meta';
import ImageSlider from '../../utils/ImageSlider';
function LandingPage() {
    const [Products, setProducts] = useState([]);
    const [Skip, setSkip] = useState(0);
    const [Limit, setLimit] = useState(8);
    const [PostSize, setPostSize] = useState(0);
    useEffect(() => {
        let body = {
            skip: Skip,
            limit:Limit
        }
        getProducts(body)
    }, [])
    const getProducts = (body) => {
        axios.post('/api/product/products',body)
            .then(response => {
                if (response.data.success) {
                    if (body.loadMore) {
                        setProducts([...Products,...response.data.productInfo])
                    } else {
                        setProducts(response.data.productInfo)
                    }
                    setPostSize(response.data.postSize)
                } else {
                    alert("상품들을 가져오는데 실패했습니다. 관리자에게 문의하세요.")
            }
        })
    }
    //skip과 limit으로 더보기 만듬
    const loadMoreHandler = () => {
        let skip = Skip + Limit
        let body = {
            skip: skip,
            limit: Limit,
            loadMore : true
        }
        getProducts(body)
        setSkip(skip)
    }
    const renderCards = Products.map((product, index) => {
        //Col은 24사이즈인데 lg는 가장 클때이고 파라미터값의미는 각각 6씩 가져간다. 그다음은 md(반정도 되었을때) xs는 작은사이즈
        return <Col lg={6} md={8} xs={24} key={index}>
            <Card
                cover={<ImageSlider images={product.images} />}
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
            

            <br />

            {PostSize >= Limit &&
                <div className="addBtn" onClick={loadMoreHandler}>
                    <button>더보기</button>
                </div>
            }

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
`;
export default LandingPage
