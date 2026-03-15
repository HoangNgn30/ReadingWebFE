import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Hero from './Hero';
import Collection from './Collection';
import Popular from './Popular';
import Features from './Features';
import Footer from '../footer/Footer';
import About from './About';
import { Feather } from 'lucide-react';

function MainDivider() {
    useEffect(() => {
        const loginSuccess = localStorage.getItem('loginSuccess');
        if (loginSuccess) {
            toast.success('Đăng nhập thành công! 🚀', { autoClose: 1000 });
            localStorage.removeItem('loginSuccess');
        }
    }, []);

    return (
        <>
            <Hero />
            <Popular />
            <About />
            <Collection />
            <Features />
            <div className="max-pad-container bg-white">
                <Footer />
            </div>
            <ToastContainer position="top-right" />
        </>
    );
}

export default MainDivider;
