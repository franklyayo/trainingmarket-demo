import React, {useState} from 'react'
import {Typography, Button, Form, message, Input, Icon} from 'antd'
import FileUpload from '../../utils/FileUpload'
import { OmitProps } from 'antd/lib/transfer/renderListBody'
import Axios from 'axios'

const {Title} = Typography
const {TextArea} = Input 

const continents = [
    {key: 1, value:"Cloud Infrastruture"},
    {key: 2, value:"Project Management"},
    {key: 3, value:"Security"},
    {key: 4, value:"Business Analysis"},
    {key: 5, value:"Networking"},
    {key: 6, value:"IT Governance"},
    {key: 7, value:"Software Development"}
]

const UploadProductPage = (props) => {
    //adding states
    const [titleValue, setTitleValue] = useState('')
    const [descriptionValue, setDescriptionValue] = useState('')
    const [priceValue, setPriceValue] = useState(0)
    const [continentValue, setContinentValue] = useState(1)

    const [Images, setImages] = useState([])

    const onTitleChange = (e) => {
        setTitleValue(e.currentTarget.value)
    }

    const onDescriptionChange = (e) => {
        setDescriptionValue(e.currentTarget.value)
    }

    const onPriceChange = (e) => {
        setPriceValue(e.currentTarget.value)
    }

    const onContinentSelectChange = (e) => {
        setContinentValue(e.currentTarget.value)
    }

    const updateImages = (newImages) => {
        console.log(newImages)
        setImages(newImages)
    }


    const onSubmit = (e) => {
        e.preventDefault();

        if (!titleValue || !descriptionValue || !priceValue || !continentValue || !Images) {
            return alert('You must fill all fields!')
        }

        const variables = {
            writer: props.user.userData._id, 
            title: titleValue,
            description: descriptionValue,
            price: priceValue,
            images: Images,
            continents: continentValue
        }

        Axios.post('/api/product/uploadProduct', variables)
            .then(response => {
                if (response.data.success) {
                    alert("Successfully uploaded!")
                    props.history.push('/')
                } else {
                    alert('Failed to upload Product')
                }
            })
    }

    return (
        <div style={{maxWidth: '700px', margin: '2rem auto'}}>
            <div style={{textAlign: 'center', marginBottom: '2rem'}}>
                <Title>Upload Course Details</Title>
            </div>
            <Form onSubmit={onSubmit}>
            <FileUpload refreshFunction={updateImages}/>
                <br />
                <br />
                <label>Title</label>
                <Input
                    onChange={onTitleChange}
                    value={titleValue}  
                />
                <br />
                <br />
                <label>Description</label>
                <TextArea
                    onChange={onDescriptionChange}
                    value={descriptionValue}  
                />
                <br />
                <br />
                <label>Price (₦)</label>
                <Input
                    onChange={onPriceChange}
                    value={priceValue}
                    type="number" 
                />
                <select onChange={onContinentSelectChange}>
                    {continents.map((item) => (
                        <option key={item.key} value={item.key}>{item.value}</option>
                    ))}
                </select>
                <br />
                <br />
                <Button onClick={onSubmit}>
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default UploadProductPage;