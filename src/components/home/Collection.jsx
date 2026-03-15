import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Title from './Title';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import Item from '../item/Item';
import storyApi from '../../services/storyServices';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';

const Collection = () => {
    const [displayBooks, setDisplayBooks] = useState([]);
    const { getStory } = storyApi();

    const fetchBooks = async (page) => {
        try {
            const response = await getStory(page);
            if (response.status === 200) {
                // Lấy 7 cuốn sách mới nhất
                const latestBooks = response.data.slice(0, 10).reverse();
                setDisplayBooks(latestBooks);
            } else {
                toast.error('Lỗi tải sách', { autoClose: 500 });
                console.log(response);
            }
        } catch (error) {
            toast.error('Không thể tải danh sách truyện', { autoClose: 500 });
            console.error('Error fetching stories:', error);
        }
    };

    useEffect(() => {
        fetchBooks(1); // Fetch first page by default
    }, []);

    return (
        <section className="max-padd-container py-16 bg-bgColor w-full">
            <Title
                title1={'Bộ sưu tập'}
                title2={' Sách'}
                para={
                    'Khám phá những tác phẩm đến từ khắp mọi nơi trên thế giới của chúng tôi, từ văn học kinh điển đến những cuốn sách bán chạy đương đại thuộc nhiều thể loại đa dạng.'
                }
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

export default Collection;
