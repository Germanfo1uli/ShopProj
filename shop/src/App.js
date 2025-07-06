import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './JSX/Hooks/UseAuth';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';
import NavBar from "./JSX/NavBar";
import Home from "./JSX/Home";
import Cart from "./JSX/Cart";
import Profile from "./JSX/Profile";
import Catalog from "./JSX/Catalog";
import ProductPage from "./JSX/ProductPage";
import { ThemeProvider } from "./JSX/Context/ThemeContext";

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <BrowserRouter>
                    <div className="App">
                        <NavBar/>
                        <Routes>
                            <Route path="/*" element={<Home />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/catalog" element={<Catalog />} />
                            <Route path="/product/:id" element={<ProductPage />} />
                            <Route path="/profile" element={<Profile />} />
                        </Routes>
                    </div>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;