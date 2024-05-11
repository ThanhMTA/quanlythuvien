import React, { useEffect, useState } from 'react'
import './BookList.css'
import axios from 'axios'
import Loading from "../Loader/Loader";
import { Link } from 'react-router-dom';
import Footer from '../Footer/Footer'
import BookApi from "../../callAPI/BookApi"
import CateController from '../../Controller/CateController';

function ListCate() {
    const API_URL = process.env.REACT_APP_API_URL

    const [listCate, setListCate] = useState([])
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        setLoading(true)
        const fetchData = async () => {
            try {
                const cates = await CateController.getAllCates();
                console.log("user trans", cates)
                setLoading(false)
                setListCate(cates);

            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };
        fetchData();     // Gọi fetchData để lấy dữ liệu

    }, []);

    if (loading) return <Loading />;

    return (
        <div className="block-page">
            <div className="books-page">
                <div className="title">
                    <label htmlFor="category">Danh sách thể loại</label><br />
                </div>

                <div className="books">
                    {listCate && listCate.map((item) => (
                        <div className="book-card" key={item._id}>
                            <Link to={`/category/${item.categoryName}`}>
                                <p className="bookcard-title"><b>{item.categoryName}</b></p>
                            </Link>
                        </div>
                    ))}

                </div>

            </div>

            <Footer />
        </div>


    )
}


export default ListCate