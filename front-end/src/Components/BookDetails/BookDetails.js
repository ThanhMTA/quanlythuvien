import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Loading from "../Loader/Loader";
import coverImg from "../../images/cover_not_found.jpg";
import "./BookDetails.css";
import { FaArrowLeft } from "react-icons/fa";
import axios from 'axios'
import {useHistory} from "react-router-dom"
import getUrlImage from "../../Pages/getURLimage"

import Breadcrumb from '../Breadcrumb/Breadcrumb';

const BookDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState(null);
  const history  = useHistory();
  const API_URL = process.env.REACT_APP_API_URL;


  useEffect(() => {
    setLoading(true);
    const getBookDetails = async () => {
      try {
        const response = await axios.get(API_URL + 'api/books/getbook/' + id);
        const data = response.data;
        console.log(data);

        if (data) {
          const { description, bookName, image_url, bookCountAvailable, publisher, author, categories } = data;
          

          const newBook = {
            description: description ? description : "Chưa có mô tả",
            bookName: bookName,
            cover_img: image_url ? image_url : coverImg,
            publisher: publisher ? publisher : "",
            author: author ? author : "",
            categories: categories,
            bookCountAvailable: bookCountAvailable
          };
          console.log("newbook =>"+newBook);
          setBook(newBook);
        } else {
          setBook(null);
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
    getBookDetails();
  }, [id]);

  if (loading) return <Loading />;

  return (
    <div className="books-page">
        

        <button type='button' className='addbook-submit' onClick={() => history.push("/books")}>
          <FaArrowLeft size={22} />
          <span className='fs-18 fw-6'>Trở lại</span>
        </button>

        <div className="book-card">
          <img src={getUrlImage(book?.cover_img)} alt="" ></img>

          <p className="bookcard-title"><b>{book?.bookName}</b></p>

          <p className="bookcard-author"> {book?.author} </p>
          <p className="bookcard-author">{book?.publisher}</p>
          <p className="bookcard-author"><b>Sẵn có:</b> {book?.bookCountAvailable}</p>
          <p className="bookcard-description"><b>Mô tả:</b> <i>{book?.description}</i> </p>

          <div>
            <div className="bookcard-category">
              <p>{book?.categories}</p>
            </div>
            <div className="bookcard-select">
              <button>Chọn</button>
            </div>
          </div>
          <div className="bookcard-emptybox"></div>
        </div>
      </div>
  )
}

export default BookDetails