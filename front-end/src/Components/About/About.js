import React from 'react'
import './About.css'

function About() {
    return (
        <div className='about-box'>
            <h2 className="about-title">Giới thiệu thư viện MTA</h2>
            <div className="about-data">
                <div className="about-img">
                    <img src="/assets/slide/1.png" alt="" />
                </div>
                <div>
                    <p className="about-text">
                        Trang web Thư viện Trường MTA!<br/>
                        <br/>
                        Thư viện Trường MTA tự hào là một nguồn tài nguyên vô giá và nền tảng học tập độc đáo cho cả sinh viên và giảng viên của trường. Với mục tiêu cung cấp môi trường học tập thuận lợi và đa dạng, thư viện chúng tôi mang đến cho bạn không chỉ những cuốn sách phong phú và hấp dẫn, mà còn cả các nguồn tài liệu điện tử tiện ích.<br/>
                        <br/>
                        Với bề dày kiến thức chuyên môn, thư viện MTA tổ chức hệ thống sách và tài liệu đa dạng bao gồm các lĩnh vực chính như Khoa học, Công nghệ, Kinh tế, Văn hóa, Xã hội, và nhiều hơn nữa. Chúng tôi không chỉ tập trung vào việc cung cấp nguồn tài liệu chất lượng, mà còn luôn nỗ lực để đáp ứng nhu cầu đa dạng của cộng đồng học thuật trong trường.<br/>
                        Hãy khám phá trang web Thư viện Trường MTA ngay bây giờ để truy cập vào cả thế giới tri thức đang chờ đợi bạn. Dù bạn là sinh viên, giảng viên hay nhà nghiên cứu, chúng tôi cam kết mang đến cho bạn một trải nghiệm học tập và nghiên cứu đẳng cấp.
                        <br/>
                        <br/>
                        Chúng tôi rất mong được đồng hành cùng bạn trên hành trình tìm kiếm và chia sẻ kiến thức tại Thư viện Trường MTA.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default About
