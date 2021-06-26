import React from 'react'
import { Descriptions,Button } from 'antd';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../../_actions/user_actions';
function ProductInfo(props) {
    //redux
    const dispatch = useDispatch();
    const clickHandler = () => {
        //필요한 정보를 Cart필드에다가 넣어준다.(상품의 id,갯수,언제 넣었는지에 대한 date) user관련은 userAction에서 redux로 처리할예정.
        dispatch(addToCart(props.detail._id));
    }
    return (
        <ProductInfoStyled>
            <Descriptions title="Product Info" bordered>
                <Descriptions.Item label="Price">{ props.detail.price }$</Descriptions.Item>
                <Descriptions.Item label="Sold">{ props.detail.sold }</Descriptions.Item>
                <Descriptions.Item label="View">{ props.detail.views }</Descriptions.Item>
                <Descriptions.Item label="Description">{ props.detail.description }</Descriptions.Item>
            </Descriptions>
            <br />
            <br />
            <br />
            <div className="addCartBtn">
                <Button size="large" shape="round" type="danger" onClick={clickHandler} >Add to Cart</Button>
            </div>
        </ProductInfoStyled>
    )
}
const ProductInfoStyled = styled.div`
    .addCartBtn{
        display: flex;
        justify-content: center;
    }
`;
export default ProductInfo
