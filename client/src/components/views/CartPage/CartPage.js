import React, {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import {getCartItems, removeCartItem, onSuccessBuy} from '../../../_actions/user_actions'
import UserCardBlock from './Sections/UserCardBlock'
import {Result, Empty} from 'antd'
import PayPal from '../../utils/PayPal'
import Axios from 'axios';

const CartPage = (props) => {
    const dispatch = useDispatch();
    const [Total, setTotal] = useState(0)
    const [showTotal, setShowTotal] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    useEffect(() =>{
        let cartItems = [];
        if (props.user.userData && props.user.userData.cart) {
            if (props.user.userData.cart.length > 0) {
                props.user.userData.cart.forEach(item => {
                    cartItems.push(item.id)
                })
                dispatch(getCartItems(cartItems, props.user.userData.cart))
            }
        }
    }, [props.user.userData])

    useEffect(() => {
        if (props.user.cartDetail && props.user.cartDetail.length > 0) {
            calculateTotal(props.user.cartDetail)
        }

    }, [props.user.cartDetail])

    const calculateTotal = (cartDetail) => {
        let total = 0;

        cartDetail.map((item) => {
            total += parseInt(item.price, 10) * item.quantity
        })
        setTotal(total)
        setShowTotal(true)
    }

    const removeFromCart = (productId) => {

        dispatch(removeCartItem(productId))
            .then((response) => {
                if (response.payload.cartDetail.length <= 0) {
                    setShowTotal(false)
                } else {
                    calculateTotal(response.payload.cartDetail)
                }
            })
    }

    const transactionSuccess = (data) => {
        let variables = {
            cartDetail: props.user.cartDetail, paymentData: data
        }

        Axios.post('/api/users/successBuy', variables)
        .then(response => {
            if (response.data.success) {
                setShowSuccess(true)
                setShowTotal(false)

                dispatch(onSuccessBuy ({
                    cart: response.data.cart,
                    cartDetail: response.data.cartDetail
                }))
            }   else {
                alert ('Failed to buy it')
            } 
        })
    }


    return (
        <div style={{width: '85%', margin: '3rem auto'}}>
        <h1>My Cart</h1>
            <div>
            <UserCardBlock
                products={props.user.cartDetail} 
                removeItem={removeFromCart}
            />
        

      { 
        showTotal ?
        <div style={{marginTop: '3rem'}}>
        <h2>Total Amount: ₦ {Total}</h2> 
        </div>
        :
        showSuccess ?  
        <Result
            status="success"
            title="Successfuly Purchased Items" 
        /> :
       <div style={{    width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <br />
        <Empty description={false} />
        <p>No Items in Cart</p>
       </div>
      }
    </div>
    { showTotal && <PayPal
        toPay={Total}
        onSuccess={transactionSuccess}
           
    />}
    

    </div>
    
    )
}

export default CartPage;