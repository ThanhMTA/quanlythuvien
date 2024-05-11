import React from 'react'
import './ImageSlider.css'
import { Carousel } from 'react-bootstrap'

function ImageSlider() {
    return (
        <div className='slider'>
            <Carousel>
                <Carousel.Item interval={1000}>
                    <img
                        className="d-block w-100"
                        src="/assets/slide/1.png"
                        alt="First slide"
                    />
                    <Carousel.Caption>
                        <h3>HỌC VIỆN KỸ THUẬT QUÂN SỰ - MTA</h3>
                        <p>Là một viện đại học kỹ thuật tổng hợp, đa ngành, đa lĩnh vực, đào tạo kỹ sư, kỹ sư trưởng, công trình sư, trong các ngành khoa học kỹ thuật, công nghệ quân sự, công nghiệp quốc phòng và công nghệ cao phục vụ sự nghiệp hiện đại hoá quân đội.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                
                <Carousel.Item interval={500}>
                    <img
                        className="d-block w-100"
                        src="/assets/slide/2.jpeg"
                        alt="Second slide"
                    />
                    <Carousel.Caption>
                        <h3>Thư viện HVKTQS</h3>
                        <p>Thư viện Học viện là một nguồn tài nguyên vô cùng quý giá, cung cấp không chỉ sách vở chuyên ngành mà còn cả những tư liệu đa dạng và chất lượng cao, hỗ trợ sinh viên và giảng viên trong quá trình học tập và nghiên cứu.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="/assets/slide/3.jpeg"
                        alt="Third slide"
                    />
                    <Carousel.Caption>
                        <h3>Lan tỏa Văn hóa đọc sách trong học viện</h3>
                        <p>Với việc khuyến khích và tạo điều kiện thuận lợi cho việc đọc sách, chúng ta có thể xây dựng một xã hội năng động và sáng tạo, nơi mọi người có thể trau dồi kiến thức và khám phá những ý tưởng mới.</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </div>
    )
}

export default ImageSlider
