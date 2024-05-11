import React from 'react'
import './Footer.css'

import TwitterIcon from '@material-ui/icons/Twitter';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import TelegramIcon from '@material-ui/icons/Telegram';
import InstagramIcon from '@material-ui/icons/Instagram';

function Footer() {
    return (
        <div className='footer'>
            <div>
                <div className='footer-data'>
                    <div className="contact-details">
                        <h1>Liên hệ với chúng tôi</h1>
                        <p>Nhân viên thủ thư</p>
                        <p>Phòng Thông tin và truyền thông</p>
                        <p>Trương Anh Ngọc</p>
                        <p>+84877869554</p>
                        <p>số 236, Hoàng Quốc Việt, Cổ Nhuế 1, Hà Nội</p>
                        <p><b>Email:</b>AnhTruongNgoc@gmail.com</p>
                    </div>
                    <div className='usefull-links'>
                        <h1>Liên kết</h1>
                        <a href='#home'>Link-1</a>
                        <a href='#home'>Link-1</a>
                        <a href='#home'>Link-1</a>
                        <a href='#home'>Link-1</a>
                    </div>
                    <div className='librarian-details'>
                        <h1>Hỗ trợ kỹ thuật</h1>
                        <p>Họ tên: Chu Tuan Kiet</p>
                        <p>Phòng Công nghệ thông tin</p>
                        <p>Contact: +84975003933</p>
                    </div>
                </div>
                <div className="contact-social" >
                    <a href='#home' className='social-icon'><TwitterIcon style={{ fontSize: 40,color:"rgb(53, 109, 72)"}} /></a>
                    <a href='#home' className='social-icon'><LinkedInIcon style={{ fontSize: 40,color:"rgb(53, 109, 72)"}} /></a>
                    <a href='#home' className='social-icon'><TelegramIcon style={{ fontSize: 40,color:"rgb(53, 109, 72)"}} /></a>
                    <a href='#home' className='social-icon'><InstagramIcon style={{ fontSize: 40,color:"rgb(53, 109, 72)"}} /></a>
                </div>
            </div>
            <div className='copyright-details'>
                <p className='footer-copyright'>&#169; 2023 copyright MTA Library<br /></p>
            </div>
        </div>
    )
}

export default Footer