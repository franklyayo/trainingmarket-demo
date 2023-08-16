import React, { useEffect, useState } from 'react'
import {Button, Descriptions} from 'antd'
import { useHistory } from "react-router-dom";

const ProductInfo = (props) => {
    const [Product, setProduct] = useState({})
    let history = useHistory();

    useEffect(() => {
        setProduct(props.detail)
    }, [props.detail])

    const addToCartHandler = () => {
        props.addToCart(props.detail._id) 
        history.push('/user/cart')
    }

    return (
        <div>
            <Descriptions title="Product Info">
                <Descriptions.Item label="Price">{Product.price}</Descriptions.Item>
                <Descriptions.Item label="Sold">{Product.sold}</Descriptions.Item>
                <Descriptions.Item label="View">{Product.view}</Descriptions.Item>
                <Descriptions.Item label="Description">{Product.description}</Descriptions.Item>
                <br />
                <br />
                <br />
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <Button size="large" shape="round" type="danger" onClick={addToCartHandler}>
                        Add to Cart 
                    </Button>
                </div>
            </Descriptions>
        </div>
    )
}

export default ProductInfo 