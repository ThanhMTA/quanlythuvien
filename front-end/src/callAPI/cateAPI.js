import axios from "axios"
const API_URL = process.env.REACT_APP_API_URL;

const CateApi = {
    GetAllCates: async () => {
        const res = await axios.get("http://localhost:8080/api/categories/allcategories")
        return res.data
    },
    // http://localhost:5000/api/books/getallcate
    // getAllCate: async () => {
    //     const res = await axios.get("/api/books/getallcate")
    //     return res.data
    // },
    // getBookbyID: async (bookID) => {
    //     const res = await axios.get(`http://localhost:5000/api/books/getbook/${bookID}`)
    //     return res.data
    // },
    // addBook: async (data) => {
    //     const res = await axios.post("http://localhost:5000/api/books/addbook", data)
    //     return res.data
    // },
    // updateBook: async (bookID, data) => {
    //     const res = await axios.put(`http://localhost:5000/api/books/updatebook/${bookID}`, data)
    //     return res.data
    // },
    // deleteBook: async (bookID) => {
    //     const res = await axios.delete(`http://localhost:5000/api/books/removebook/${bookID}`)
    //     return res.data
    // },
}

export default CateApi;
