import axios from "axios"
import {userService} from "../services/authentication.service";
const API_URL = process.env.REACT_APP_API_URL;

const UserApi = {
  getAllUser: async () => {
    const res = await axios.get("http://localhost:8080/api/users/allmembers",
    {
      headers: {
        'Authorization': userService.getToken()
      }
    }
    );
    return res.data
  },
  getUserbyID: async (userId) => {
    const res = await axios.get(`http://localhost:8080/api/users/getuser/${userId}`)
    return res.data
  },
  addUser: async (data) => {
    const res = await axios.post("http://localhost:8080/api/users/addbook", data)
    return res.data
  },
  updateUser: async (userId, data) => {
    const res = await axios.put(`http://localhost:8080/api/users/updateuser/${userId}`, data)
    return res.data
  },
  deleteUser: async (userId) => {
    const res = await axios.delete(`http://localhost:8080/api/users/remove-Useraction/${userId}`)
    return res.data
  },
}

export default UserApi
