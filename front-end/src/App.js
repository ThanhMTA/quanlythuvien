import Header from './Components/Header/Header'
import Home from './Pages/Home'
import BookList from './Components/BookList/BookList';
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
} from 'react-router-dom'
import { AuthContext } from './Context/AuthContext.js'
import { useContext } from 'react'
import Signin from './Pages/Signin'
import Signup from './Pages/Signup'
import Upload from './Pages/Upload'

import MemberDashboard from './Pages/Dashboard/Member/MemberDashboard.js';
import AdminDashboard from './Pages/Dashboard/Admin/AdminDashboard.js';
import BookDetails from "./Components/BookDetails/BookDetails";
import Search from "./Components/Search/Search";


import Cart from './Components/Cart/Cart';
import ListCate from './Components/BookList/ListCate';

function App() {
  const { user } = useContext(AuthContext)
  return (
    <Router>


      <Header />
      <div className="App">
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>

          <Route exact path='/upload'>
            <Upload />
          </Route>
          <Route exact path='/signup'>
            <Signup />
          </Route>

          <Route exact path='/book/:id'>
            <BookDetails />
          </Route>

          <Route exact path='/category/:category'>
            <BookList />
          </Route>

          <Route exact path='/search/:keyword'>
            <Search />
          </Route>

          <Route exact path="/books">
            <ListCate />
          </Route>

          <Route exact path="/cart">
            <Cart />
          </Route>
        </Switch>


        {/* <Route exact path="/signin">
          {user ? (
            user.isAdmin ? (
              <Redirect to="/dashboard@admin" />
            ) : (
              <Redirect to="/dashboard@member" />
            )
          ) : (
            <Signin />
          )}
        </Route>
        <Route exact path='/dashboard@member'>
          {user ? (user.isAdmin === false ? <MemberDashboard /> : <Redirect to='/' />) : <Redirect to='/' />}
        </Route>
        <Route exact path='/dashboard@admin'>
          {user ? (user.isAdmin === true ? <AdminDashboard /> : <Redirect to='/' />) : <Redirect to='/' />}
        </Route> */}

        <Route exact path="/signin">
          <Signin />
        </Route>
        <Route exact path='/dashboard@member'>
          <MemberDashboard />
        </Route>
        <Route exact path='/dashboard@admin'>
          <AdminDashboard />
        </Route>


      </div>
    </Router>
  )
}

export default App
