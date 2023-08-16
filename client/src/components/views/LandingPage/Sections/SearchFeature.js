import React, { useState } from 'react'
import {Input} from 'antd'

const {Search} = Input;

const SearchFeature = (props) => {
    const [searchTerm, setSearchTerm] = useState("")

    const onChangeSearch = (e) => {
        setSearchTerm(e.currentTarget.value)
        props.refreshFunction(e.currentTarget.value)

    }
    return (
        <div>
            <Search
                value={searchTerm}
                onChange={onChangeSearch} 
                placeholder="Enter a keyword..."
            />
        </div>
    )
}

export default SearchFeature;