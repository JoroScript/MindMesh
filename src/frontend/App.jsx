import './index.css'
import Home from './Home'
import { BrowserRouter,Routes,Route} from 'react-router-dom'
import LoginMaterialUi from './LoginMaterialUi'
import RegisterMaterialUi from './RegisterMaterialUi';
import EditNote from './components/EditNote'
import './app.css'
import AddNote from './components/AddNote';
import NotesProvider from './components/NotesProvider';
function App() {
  
  return (
    <BrowserRouter>
    <NotesProvider>
            <Routes>
              <Route path="/" element={<Home/>}></Route>
              <Route path="/register" element={<RegisterMaterialUi/>}></Route>
              <Route path="/login" element={<LoginMaterialUi/>}></Route>
              <Route path="/add" element={<AddNote/>}></Route>
              <Route path="/edit/:id" element={<EditNote/>}></Route>
          </Routes>
    </NotesProvider>
    </BrowserRouter>
  )
}

export default App
