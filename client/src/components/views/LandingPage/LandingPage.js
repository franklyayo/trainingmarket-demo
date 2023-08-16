import React, {useEffect, useState} from 'react'
import Axios from 'axios'
import {Icon, Col, Row, Card} from 'antd'
import ImageSlider from '../../utils/ImageSlider';
import CheckBox from './Sections/CheckBox';
import RadioBox from './Sections/RadioBox';
import SearchFeature from './Sections/SearchFeature';
import {price, continents} from './Sections/Data'


const {Meta} = Card



function LandingPage(props) {
    const [Products, setProducts]=useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [postSize, setPostSize] = useState(0)
    const [searchTerms, setSearchTerm] = useState('')
    const [Filters, setFilters] = useState({
        continents: [],
        price: []
    })

    useEffect(() => {
        const variables = {
            skip: Skip,
            limit: Limit 
        }
       getProducts(variables)
    }, [])

    const getProducts=(variables)=>{
        Axios.post('/api/product/getProducts', variables)
        .then(response => {
            if (response.data.success) {
                if (variables.loadMore) {
                setProducts([...Products, ...response.data.products])
            } else {
                setProducts(response.data.products)
            }
                setPostSize(response.data.postSize)
            } else {
                alert('Failed to fetch products')
            }
        })
    }

    const renderCards = Products.map((product, index) => {
        return <Col lg={6} md={8} xs={24} key={index}>
        <Card
            hoverable={true}
            cover={<a href={`/product/${product._id}`}><ImageSlider images={product.images} /></a>}
            key={index}
        >

        <Meta
            title={product.title}
            description={`₦${product.price}`} 
        />

        </Card>
        </Col>
    })

    const onLoadMore = () => {
        let skip=Skip+Limit
    
        const variables = {
            skip: skip,
            limit: Limit,
            loadMore: true 
        }
    
        getProducts(variables)
        setSkip(skip)
    }

    const showFilteredResults = (filters) => {
        const variables = {
            skip: 0,
            limit: Limit,
            filters: filters
        }

        getProducts(variables)
        setSkip(0)
    }

    const handlePrice = (value) => {
        const data = price;
        let array = [];

        for (let key in data) {
            if (data[key]._id === parseInt(value, 10)) {
                array = data[key].array;
            }
        }
        return array
    }

    const handleFilters = (filters, category) => {
        const newFilters = {...Filters}
        newFilters[category]=filters

        if (category === "price") {
           let priceValues = handlePrice(filters)
           newFilters[category] = priceValues
        }

        showFilteredResults(newFilters)
        setFilters(newFilters)
    }

    const updateSearchTerms = (newSearchTerm) => {
        setSearchTerm(newSearchTerm)


        const variables = {
            skip: 0,
            limit: Limit,
            filters: Filters,
            searchTerm: newSearchTerm 
        }
    
        setSkip(0)
        setSearchTerm(newSearchTerm)
        getProducts(variables)   
    }

    return (
        <div style={{width: '75%', margin: '3rem auto'}}>
            <div style={{textAlign: 'center'}}>
                <h2>Courses Directory</h2>
            </div>

            <Row gutter={[16, 16]}>
                <Col lg={12} xs={24}>
                <CheckBox
                continentsList={continents}
                handleFilters={filters => handleFilters(filters, "continents")} 
            />
                </Col>

                <Col  lg={12} xs={24}>
                <RadioBox 
                priceList={price}
                handleFilters={filters => handleFilters(filters, "price")} 
            />
                </Col>
            </Row>

            <div style={{display: 'flex', justifyContent: 'flex-end', margin: '1rem auto'}}>
                <SearchFeature
                    refreshFunction={updateSearchTerms}
                />
            </div>
            

           

            

            {Products.length === 0 ?
                <div style={
                    {display: 'flex', 
                    height: '300px', 
                    justifyContent: 'center',
                    alignItems: 'center'               
                }
                    }> 
                    <h2>No product yet...</h2>
                </div> :
                <div>
                    <Row gutter={[16, 16]}>
                        {renderCards}
                    </Row>
                </div>
            }
            <br /><br />

            { postSize >= Limit &&
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <button onClick={onLoadMore}>Load more...</button>
            </div>
            }
        </div>
    )
}

export default LandingPage
