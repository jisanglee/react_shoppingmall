import React from 'react'
import styled from 'styled-components'

function UserCardBlock(props) {
    
    const renderCartImage = (images) => {
        if (images.length > 0) {
            let image = images[0]
            return `http://localhost:5000/${image}`
        }
    }

    const renderItems =() => (
        props.products && props.products.map((product,index) => (
            <tr key={index}>
                <td>
                    <img className="productImage" alt="product" src={renderCartImage(product.images)} />
                </td>
                <td>
                    {product.quantity} EA
                </td>
                <td>
                    $ {product.price}
                </td>
                <td>
                    <button onClick={() => props.removeItem(product._id)} >
                        Remove
                    </button>
                </td>
            </tr>
        ))
    )
    return (
        <UserCardBlockStyled>
            <table>
                <thead>
                    <tr>
                        <th>Product Image</th>
                        <th>Product Quantity</th>
                        <th>Product Price</th>
                        <th>Remove from Cart</th>
                    </tr>
                </thead>
                <tbody>
                    {renderItems()}
                </tbody>
            </table>
        </UserCardBlockStyled>
    )
}
const UserCardBlockStyled = styled.div`
    table{
        font-family: Arial, Helvetica, sans-serif,sans-serif;
        border-collapse: collapse;
        width: 100%;
    }
    td,th{
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
    }
    tr:nth-child(even){
        background-color: #dddddd;
    }
    .productImage{
        width: 80;
        height: 60px;
    }
`
export default UserCardBlock
