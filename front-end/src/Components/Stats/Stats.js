import React from 'react'
import './Stats.css'
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';
import BookIcon from '@material-ui/icons/Book';
import { useEffect, useState } from "react";
import axios from 'axios'

function Stats() {
  const [countBook, setCountBook] = useState([])
  const [countUser, setCountUser] = useState([])
  const [countTrans, setCountTrans] = useState([])
  const API_URL = process.env.REACT_APP_API_URL

    useEffect(() => {
        const getListBook = async () => {
          try {
            const response = await axios.get(API_URL + 'api/statistics/bookusertrans')
            const data = (response.data);
            setCountBook(data.bookCount);
            setCountUser(data.userCount);
            setCountTrans(data.transactionCount);
    
          } catch (err) {
            console.log('Error when get list book =>', err)
          }
        }
        getListBook()
      }, [API_URL])

    return (
        <div className='stats'>
            <div className='stats-block'>
                <LibraryBooksIcon className='stats-icon' style={{ fontSize:80 }}/>
                <p className='stats-title'>Số sách hiện có</p>
                <p className='stats-count'>{countBook}</p>
            </div>
            <div className='stats-block'>
                <LocalLibraryIcon className='stats-icon' style={{ fontSize:80 }}/>
                <p className='stats-title'>Số độc giả</p>
                <p className='stats-count'>{countUser}</p>
            </div>
            <div className='stats-block'>
                <BookIcon className='stats-icon' style={{ fontSize:80 }}/>
                <p className='stats-title'>Số lượt mượn sách</p>
                <p className='stats-count'>{countTrans}</p>
            </div>
        </div>
    )
}

export default Stats