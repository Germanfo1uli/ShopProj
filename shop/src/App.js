import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import NavBar from "./JSX/NavBar";
import Home from "./JSX/Home";
import Cart from "./JSX/Cart";


function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <NavBar/>
                <Routes>
                    <Route path="/*" element={<Home />} />
                    <Route path="/cart" element={<Cart />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;