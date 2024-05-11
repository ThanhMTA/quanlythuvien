import axios from "axios"
import { userService } from "../services/authentication.service";

const API_URL = "http://localhost:8080/"
const TransApi = {
  getAllTrans: async () => {
    const res = await axios.get("http://localhost:8080/api/transactions/all-transactions", {
      headers: {
        'Authorization': userService.getToken()
      }
    })
    return res.data
  },
  getTransbyID: async (transactionId) => {
    const res = await axios.get(`http://localhost:8080/api/transactions/${transactionId}`, {
      headers: {
        'Authorization': userService.getToken()
      }
    })
    return res.data
  },
  getTransbyUser: async (userId) => {
    console.log('userid', userId)
    const res = await axios.get(`http://localhost:8080/api/transactions/user-transactions/${userId}`, {
      headers: {
        'Authorization': userService.getToken()
      }
    })
    return res.data
  },
  addTrans: async (data) => {
    const res = await axios.post(`http://localhost:8080/api/transactions/add-transaction`, data, {
      headers: {
        'Authorization': userService.getToken()
      }
    })
    return res.data
  },
  updateTrans: async (transactionId, data) => {
    const res = await axios.put(`http://localhost:8080/api/transactions/update-transactionStatus/${transactionId}`, data, {
      headers: {
        'Authorization': userService.getToken()
      }
    });

    // const res = await axios.put(API_URL + `api/transactions/update-transactionStatus/${transactionId}`, data)
    return res.data
  },
  deleteTrans: async (transactionId) => {
    const res = await axios.delete(`${API_URL}api/transactions/remove-transaction/${transactionId}`, {
      headers: {
        'Authorization': userService.getToken()
      }
    })
    return res.data
  },
}

export default TransApi
