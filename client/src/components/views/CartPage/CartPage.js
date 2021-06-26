import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import styled from 'styled-components'
import { getCartItems } from '.././../../_actions/user_actions';
function CartPage(props) {
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
                dispatch(getCartItems(cartItems,props.user.userData.cart))
            }
        }


    }, [props.user.userData])
    return (
        <CartPageStyled>
            CartPage
        </CartPageStyled>
    )
}
const CartPageStyled = styled.div`

`;
export default CartPage
