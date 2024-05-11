import axios from "axios"
import { userService } from "../services/authentication.service";

const API_URL = process.env.REACT_APP_API_URL;

const BookApi = {
  GetAllBooks: async () => {
    const res = await axios.get("http://localhost:8080/api/books/allbooks",
      {
        headers: {
          'Authorization': userService.getToken()
        }
      })
    return res.data
  },
  // http://localhost:5000/api/books/getallcate
  getAllCate: async () => {
    const res = await axios.get("http://localhost:8080/api/books/getallcate",
      {
        headers: {
          'Authorization': userService.getToken()
        }
      })
    return res.data
  },
  getBookbyID: async (bookID) => {
    const res = await axios.get(`http://localhost:8080/api/books/getbook/${bookID}`,
      {
        headers: {
          'Authorization': userService.getToken()
        }
      })
    return res.data
  },
  addBook: async (data) => {
    const res = await axios.post("http://localhost:8080/api/books/addbook", data,
      {
        headers: {
          'Authorization': userService.getToken()
        }
      })
    return res.data
  },
  updateBook: async (bookID, data) => {
    const jsonData = {};
    data.forEach((value, key) => {
      jsonData[key] = value;
    });

    const res = await axios.put(`http://localhost:8080/api/books/updatebook/${bookID}`, jsonData,
      {
        headers: {
          'Authorization': userService.getToken()
        }
      })
    return res.data
  },
  deleteBook: async (bookID) => {
    const res = await axios.delete(`http://localhost:8080/api/books/removebook/${bookID}`,
      {
        headers: {
          'Authorization': userService.getToken()
        }
      })
    return res.data
  },

}

export default BookApi;
