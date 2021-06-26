import React,{useEffect,useState} from 'react';
import ImageGallery from 'react-image-gallery';

function ProductImage(props) {
    const [Images, setImages] = useState([])
    useEffect(() => {
        if (props.detail.images && props.detail.images.length > 0) {
            let images = []
            props.detail.images.map(item => (
                images.push({
                    original: `http://localhost:5000/${item}`,
                    thumbnail: `http://localhost:5000/${item}`
                })
            ))
            setImages(images)
            // console.log(images)
        }
    }, [props.detail])
    //뒤에 인자를 []안에 어떤것을 주면 렌더링이 된 다음에 라이프 사이클을 작동하는데, 원래는 prop detail에 아무것도 없다가 prop detail이 바뀔때마다 다시 실행시켜라 라는 의미임.
    
    
    return (
        <div>
            <ImageGallery items={Images} />
        </div>
    )
}

export default ProductImage
