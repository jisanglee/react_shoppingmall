import React,{useEffect,useState} from 'react'
import axios from 'axios';
import styled from 'styled-components';
import ProductImage from './Sections/ProductImage';
import ProductInfo from './Sections/ProductInfo';
import { Row, Col } from 'antd';
function DetailProductPage(props) {

    const productId = props.match.params.productId
    const [Product, setProduct] = useState({})
    useEffect(() => {
        axios.get(`/api/product/products_by_id?id=${productId}&type=single`)
            .then(response => {
                setProduct(response.data[0])
        })
        .catch(err => alert(err))
    }, [])
    return (
        <DetailProductPageStyled>
            <div className="title">
                <h1>{Product.title}</h1>
            </div>
            <br />

            {/* ProductImage */}
            <Row gutter={[16, 16]}>
                <Col lg={12} sm={24} >
                    <ProductImage detail={Product} />
                </Col>
                <Col lg={12} sm={24} >
                {/* ProductInfo */}
                    <ProductInfo detail={Product} />
                </Col>
            </Row>

        </DetailProductPageStyled>
    )
}

const DetailProductPageStyled = styled.div`
    width: 100%;
    padding: 3rem 4rem;
    .title{
        display: flex;
        justify-content:center;
    }
`
export default DetailProductPage
