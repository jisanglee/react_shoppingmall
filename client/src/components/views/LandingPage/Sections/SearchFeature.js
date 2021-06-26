import React,{useState} from 'react'
import { Input } from 'antd';
const { Search } = Input;
function SearchFeature(props) {
    const [SearchTerm, setSearchTerm] = useState("")
    const searchHandler = (e) => {
        setSearchTerm(e.currentTarget.value)
        props.refreshFunction(e.currentTarget.value)
    }
    return (
        <div>
            <Search
                placeholder="input search text"
                onChange={searchHandler}
                value={SearchTerm}
                style={{ width: 200 }} />
        </div>
    )
}

export default SearchFeature
