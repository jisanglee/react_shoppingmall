import React from 'react'
import { } from 'antd';
import styled from 'styled-components';
function HistoryPage(props) {
    //props에 모든 데이터가 다 있는 관계로 useEffect와 state를 쓸 필요없어짐.
    return (
        <HistoryPageStyled>
            <div>
                <h1>History</h1>
            </div>
            <br />
            <table>
                <thead>
                    <tr>
                        <th>Payment Id</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Date of Purchase</th>
                    </tr>
                </thead>
                <tbody>
                    {props.user.userData && props.user.userData.history.map((item,index) => (
                        <tr key={index}>
                            <td>{item.id}</td>
                            <td>{item.price}</td>
                            <td>{item.quantity}</td>
                            <td>{item.dateOfPurchase}</td> 
                        </tr>
                    ))}
                </tbody>
            </table>

        </HistoryPageStyled>
    )
}
const HistoryPageStyled = styled.div`
    width: 80%;
    margin:3rem auto;
    .section{
        text-align: center;
    }
`;
export default HistoryPage
