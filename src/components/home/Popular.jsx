import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Title from './Title';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import storyApi from '../../services/storyServices';
import Item from '../item/Item';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';

const Popular = () => {
    const [displayBooks, setDisplayBooks] = useState([]);
    const { getStory } = storyApi();

    const fetchPopularBooks = async (page) => {
        try {
            const response = await getStory(page);
            if (response.status === 200) {
                // Lọc sách phổ biến và lấy 5 cuốn đầu tiên
                const popularBooks = response.data.filter((book) => book.popular).slice(0, 5);
                setDisplayBooks(popularBooks);
            } else {
                toast.error('Lỗi tải sách phổ biến', { autoClose: 500 });
                console.log(response);
            }
        } catch (error) {
            toast.error('Không thể tải danh sách sách phổ biến', { autoClose: 500 });
            console.error('Error fetching popular stories:', error);
        }
    };

    useEffect(() => {
        fetchPopularBooks(1); // Fetch first page by default
    }, []);

    return (
        <section className="max-padd-container py-16 bg-bgColor w-full">
            <Title
                title1={'Sách'}
                title2={' được đọc nhiều nhất'}
                para={'Khám phá những cuốn sách được đọc nhiều nhất của chúng tôi'}
                titleStyles={'pb-10'}
                paraStyles={'!block text-black'}
            />
            {/* Swiper container*/}
            <Swiper
                autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                breakpoints={{
                    400: {
                        slidesPerView: 2,
                        spaceBetween: 30,
                    },
                    700: {
                        slidesPerView: 3,
                        spaceBetween: 30,
                    },
                    1024: {
                        slidesPerView: 4,
                        spaceBetween: 30,
                    },
                    1200: {
                        slidesPerView: 5,
                        spaceBetween: 30,
                    },
                }}
                modules={[Pagination, Autoplay]}
                className="h-[455px] sm:h-[488px] md:h-[455px] xl:h-[499px] mt-5"
            >
                {displayBooks.map((book) => (
                    <SwiperSlide key={book.id}>
                        <Item book={book} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default Popular;
