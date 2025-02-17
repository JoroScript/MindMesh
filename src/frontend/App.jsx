import './index.css'
import Home from './Home'
import { BrowserRouter,Routes,Route, } from 'react-router-dom'
import LoginMaterialUi from './LoginMaterialUi'
import RegisterMaterialUi from './RegisterMaterialUi';
import './app.css'

function App() {
  
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home/>}></Route>
            <Route path="/register" element={<RegisterMaterialUi/>}></Route>
            <Route path="/login" element={<LoginMaterialUi/>}></Route>
        </Routes>
    </BrowserRouter>
  )
}

export default App
