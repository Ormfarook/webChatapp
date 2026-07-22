import { Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import SignUp from "./pages/SignUp"
import Login from "./pages/Login"
import Settings from "./pages/Settings"
import Profile from "./pages/Profile"
import { useAuthStore } from "./store/useAuthstore"
import { useEffect } from "react"

const App = () => {
  const {authUser, checkAuth} = useAuthStore()
  useEffect(()=>{
    checkAuth()
  },[checkAuth]);

  console.log({authUser})

  return (
    <div>
      <Navbar/> 
      <Routes>
        <Route path="/" element={<div><Home/></div>}/>
        <Route path="/signup" element={<div><SignUp/></div>}/>
        <Route path="/login" element={<div><Login/></div>}/>
        <Route path="/settings" element={<div><Settings/></div>}/>
        <Route path="/Profile" element={<div><Profile/></div>}/>
      </Routes>
    </div>
  )
}

export default App
