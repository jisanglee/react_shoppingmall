import React,{useEffect,useState} from 'react'
import styled from 'styled-components';
import axios from 'axios';
import { Icon, Col, Card, Row } from 'antd';
import Meta from 'antd/lib/card/Meta';
import ImageSlider from '../../utils/ImageSlider';
import CheckBox from './Sections/CheckBox';
import RadioBox from './Sections/RadioBox';
import SearchFeature from './Sections/SearchFeature';
import { continents,price } from './Sections/Datas';


function LandingPage() {
    const [Products, setProducts] = useState([]);
    const [Skip, setSkip] = useState(0);
    const [Limit, setLimit] = useState(8);
    const [PostSize, setPostSize] = useState(0);
    const [Filters, setFilters] = useState({
        continents: [],
        price: []
    })
    const [SearchTerm, setSearchTerm] = useState("")
    useEffect(() => {
        let body = {
            skip: Skip,
            limit:Limit
        }
        getProducts(body)
    }, [])
    const getProducts = (body) => {
        axios.post('/api/product/products',body)
            .then(response => {
                if (response.data.success) {
                    if (body.loadMore) {
                        setProducts([...Products,...response.data.productInfo])
                    } else {
                        setProducts(response.data.productInfo)
                    }
                    setPostSize(response.data.postSize)
                } else {
                    alert("상품들을 가져오는데 실패했습니다. 관리자에게 문의하세요.")
            }
        })
    }
    //skip과 limit으로 더보기 만듬
    const loadMoreHandler = () => {
        let skip = Skip + Limit
        let body = {
            skip: skip,
            limit: Limit,
            loadMore : true
        }
        getProducts(body)
        setSkip(skip)
    }
    const renderCards = Products.map((product, index) => {
        //Col은 24사이즈인데 lg는 가장 클때이고 파라미터값의미는 각각 6씩 가져간다. 그다음은 md(반정도 되었을때) xs는 작은사이즈
        return <Col lg={6} md={8} xs={24} key={index}>
            <Card
                cover={<ImageSlider images={product.images}/>}
                >
                <Meta
                    title={product.title}
                    description={`$${product.price}`}
                    />
            </Card>
        </Col>
    })
    
    const showFilteredResults = (filters) => {
        let body = {
            skip: 0,
            limit: Limit,
            filters: filters
        }
        getProducts(body)
        setSkip(0)
    }
    const handlePrice = (value) => {
        const data = price;
        let array = [];
        for (let key in data) {
            if (data[key]._id === parseInt(value)) {
                //parseInt는 혹시 string으로 들어올경우 안전하게 캐스팅하기위함.
                array = data[key].array;
            }
        }
        return array;
    }
    //filters에 _id  category는 continents 혹은 price
    const handleFilters = (filters, category) => {
        const newFilters = { ...Filters }
        newFilters[category] = filters
        // console.log('filters : ',filters)

        if (category === "price") {
            let priceValues = handlePrice(filters)
            newFilters[category] = priceValues
        }
        showFilteredResults(newFilters)
        setFilters(newFilters)
    }
    
    //Search func
    const updateSearchTerm = (newSearchTerm) => {
        let body = {
            skip: 0,
            limit: Limit,
            filter: Filters,
            searchTerm:newSearchTerm
        }
        setSkip(0)
        setSearchTerm(newSearchTerm)
        getProducts(body)
    }
    return (
        <LandingPageStyled>
            <div className="titleText">
                <h2>Let's Travel Anywhere <Icon type="rocket" /></h2>
            </div>
            {/* filter >> collapse와 checkbox와 radiobox로 구성 */}
            <Row>
                <Col lg={12} xs={24}>
                    {/* CheckBox */}
                    <CheckBox
                        list={continents}
                        handleFilters={filters => handleFilters(filters, "continents")}
                    />
                </Col>
                <Col lg={12} xs={24}>
                    {/* RadioBox */}
                    <RadioBox
                        list={price}
                        handleFilters={filters => handleFilters(filters, "price")}
                    
                    />
                </Col>
            </Row>

            {/* search */}
            <div className="searchBox">
                <SearchFeature
                    refreshFunction = {updateSearchTerm}
                />
            </div>

            {/* cards gutter은 여백 */}
            <Row gutter={[16,16]} >
                {renderCards}
            </Row>
            

            <br />

            {PostSize >= Limit &&
                <div className="addBtn" onClick={loadMoreHandler}>
                    <button>더보기</button>
                </div>
            }

        </LandingPageStyled>
    )
}

const LandingPageStyled = styled.div`
    width: 75%;
    margin: 3rem auto;
    .titleText{
        text-align: center;
    }
    .addBtn{
        display: flex;
        justify-content: center;
    }
    .searchBox{
        display: flex;
        justify-content: flex-end;
        margin: 1rem auto;
    }
`;
export default LandingPage
