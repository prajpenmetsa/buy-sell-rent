import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css' 
import Signup from './Signup'
import Login from './Login'
import Profile from './Profile'
import Search from './Search'
import ItemPage from './Item'
import MyCart from './Cart'
import OrdersHistory from './Orders';
import DeliverItems from './Deliver';
import Chat from './Chat'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to="/login" />}></Route>
        <Route path='/register' element={<Signup />}></Route>
        <Route path='/login' element={<Login />}></Route> 
        <Route path='/profile' element={<Profile />}></Route> 
        <Route path='/search' element={<Search />}></Route> 
        <Route path='/item/:id' element={<ItemPage />} />
        <Route path='/mycart' element={<MyCart />} />
        <Route path="/orders-history" element={<OrdersHistory />} />
        <Route path="/deliveritems" element={<DeliverItems />} />
        <Route path="/chat" element={<Chat />} />
        {/* <Route path='/profile' element={<Profile />}></Route>  */}
      </Routes>
    </BrowserRouter>
  )
}

export default App


