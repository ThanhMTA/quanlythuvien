import React, { useEffect, useState } from 'react'
import './BookList.css'
import axios from 'axios'
import Loading from "../Loader/Loader";
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import { useHistory } from "react-router-dom"
import Footer from '../Footer/Footer'

import getUrlImage from "../../Pages/getURLimage"


function Search() {
    const { keyword } = useParams();
    const [listBook, setListbook] = useState([])
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const API_URL = process.env.REACT_APP_API_URL

    useEffect(() => {
        setLoading(true)
        console.log("this keyword ", keyword);
        const getListBook = async () => {
            try {
                if (keyword !== "") {
                    const response = await axios.get(API_URL + 'api/books/search/' + keyword)
                    setListbook(response.data);
                    keyword = "";

                } 

                setLoading(false);

            } catch (err) {
                setLoading(false);
                console.log('Error when get list book =>', err)
            }
        }
        getListBook()
    }, [keyword])

    if (loading) return <Loading />;

    return (
        <div className="block-page">

            <div className="books-page">
                <button type='button' className='addbook-submit' onClick={() => history.push("/books")}>
                    <FaArrowLeft size={22} />
                    <span className='fs-18 fw-6'>Trở lại</span>
                </button>
                {/* <Breadcrumb /> */}
                <div className="title">
                    <label htmlFor="language">Kết quả tìm kiếm cho "{keyword}"</label><br />
                </div>
                <div className="books">


                    {listBook.map((item) => {
                        return (

                            <div className="book-card">
                                <img src={getUrlImage(item.image_url)} alt="" href={`/book/${item._id}`} ></img>
                                <Link to={`/book/${item._id}`}>

                                    <p className="bookcard-title"><b>{item.bookName}</b></p>

                                </Link>
                                <p className="bookcard-author"> {item.author}</p>
                                <p className="bookcard-author">{item.publisher}</p>

                                <div>
                                    <div className="bookcard-category">
                                        <p>{item.categories}</p>
                                    </div>
                                    <div className="bookcard-select">
                                        <button>Mượn</button>
                                    </div>
                                </div>
                                <div className="bookcard-emptybox"></div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Search
