import React, { useEffect, useState } from "react";
import "./PopularBooks.css";
import axios from 'axios'
import Loading from "../Loader/Loader";
import {useHistory} from "react-router-dom"

function PopularBooks() {

  const [listBook, setListbook] = useState([])
  const [loading, setLoading] = useState(false);
  const history  = useHistory();

  const API_URL = process.env.REACT_APP_API_URL

  // useEffect(() => {
  //   setLoading(true)
  //   const getListBook = async () => {
  //     try {
  //       const response = await axios.get(API_URL + 'api/books/get20book')
  //       setListbook(response.data);
  //       setLoading(false);

  //     } catch (err) {
  //       setLoading(false);
  //       console.log('Error when get list book =>', err)
  //     }
  //   }
  //   getListBook()
  // }, [API_URL])

  if(loading) return <Loading />;

  return (
    <div className="popularbooks-container">
      <h className="popularbooks-title">Những cuốn sách phổ biến</h>
      <div className="popularbooks">
        <div className="popularbook-images">

        {listBook.slice(0,16).map((item) => {
          return (
            
            <img
              className="popular-book"
              src={"imageBook/"+item.image_url}
              alt=""
              onClick={() => history.push(`/book/${item._id}`)}
            ></img>
          )
        })}

        </div>
        
      </div>
    </div>
  );
}

export default PopularBooks;
