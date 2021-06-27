import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import styled from 'styled-components'
import { getCartItems,removeCartItem } from '.././../../_actions/user_actions';
import UserCardBlock from './Sections/UserCardBlock';
import { Empty } from 'antd';
import Paypal from '../../utils/Paypal';
function CartPage(props) {
    const [Total, setTotal] = useState(0)
    const [ShowTotal, setShowTotal] = useState(false)
    const dispatch = useDispatch();
    useEffect(() => {
        let cartItems = []
        //cart data 가져오기 - redux User State안에 cart안에 상품이 있는지 없는지 확인
        if (props.user.userData && props.user.userData.cart) {
            if (props.user.userData.cart.length > 0) {
                props.user.userData.cart.forEach(item => {
                    cartItems.push(item.id)
                })
                //카트안에있는 상품id를 이용해서 Product안에있는 상품 정보들까지 다 불러와서 합쳐줌
                dispatch(getCartItems(cartItems, props.user.userData.cart))
                    .then(response => { calculateTotal(response.payload)}
                    )
            }
        }
    }, [props.user.userData])

    const calculateTotal = (cartDetail) => {
        let total = 0;
        cartDetail.map(item => {
            total += parseInt(item.price,10) * item.quantity
        })
        setTotal(total)
        setShowTotal(true)
    }

    const removeFromCart = (productId) => {
        dispatch(removeCartItem(productId))
            .then(response => {
                if (response.payload.productInfo.length <= 0) {
                 setShowTotal(false)
            }
        })
    }

    return (
        <CartPageStyled>
            <h1>My Cart</h1>
            <div>
                {/* products={props.user.cartDetail.product} 만 넣어주면 에러발생. 해결책은 앞에 우선 props.user.cartDetail을 체킹하고 그러고나서 그다음인 product가 있는지 확인 >>>데이터 형식 변화를줌. product한층이 있는게 불편해서 없앰. */} 
                <UserCardBlock products={props.user.cartDetail} removeItem={removeFromCart} />
            </div>
            {ShowTotal ?
            <div className="totalCount">
                <h2>Total Amount : ${Total}</h2>
            </div>
            
                : <div>
                        <Empty style={{ marginTop: "3rem" }} description={false} />
                        No Items In the Cart
                    </div>
            }
            <Paypal />
        </CartPageStyled>
    )
}
const CartPageStyled = styled.div`
    width: 85%;
    margin: 3rem auto;
    .totalCount{
        margin-top: 3rem;
    }
`;
export default CartPage
