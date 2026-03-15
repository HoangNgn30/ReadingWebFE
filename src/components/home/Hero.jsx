import { useRef } from 'react';
import PropTypes from 'prop-types';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const IMG_PADDING = 12;

const TextParallaxContent = ({ imgUrl, subheading, heading, children }) => {
    return (
        <div
            style={{
                paddingLeft: IMG_PADDING,
                paddingRight: IMG_PADDING,
            }}
        >
            <div className="relative h-[150vh]">
                <StickyImage imgUrl={imgUrl} />
                <OverlayCopy heading={heading} subheading={subheading} />
            </div>
            {children}
        </div>
    );
};

TextParallaxContent.propTypes = {
    imgUrl: PropTypes.string.isRequired,
    subheading: PropTypes.string.isRequired,
    heading: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

const StickyImage = ({ imgUrl }) => {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ['end end', 'end start'],
    });

    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
    const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

    return (
        <motion.div
            style={{
                backgroundImage: `url(${imgUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: `calc(100vh - ${IMG_PADDING * 2}px)`,
                top: IMG_PADDING,
                scale,
            }}
            ref={targetRef}
            className="sticky z-0 overflow-hidden rounded-3xl"
        >
            <motion.div
                className="absolute inset-0 bg-neutral-950/70"
                style={{
                    opacity,
                }}
            />
        </motion.div>
    );
};

StickyImage.propTypes = {
    imgUrl: PropTypes.string.isRequired,
};

const OverlayCopy = ({ subheading, heading }) => {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ['start end', 'end start'],
    });

    const y = useTransform(scrollYProgress, [0, 1], [250, -250]);
    const opacity = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0, 1, 0]);

    return (
        <motion.div
            style={{
                y,
                opacity,
            }}
            ref={targetRef}
            className="absolute left-0 top-0 flex h-screen w-full flex-col items-center justify-center text-white"
        >
            <div className="border-[8px] border-white inline-block px-14 py-10">
                <p className="mb-2 text-center text-3xl md:mb-4 md:text-3xl">{subheading}</p>
                <p className="text-center text-5xl font-bold md:text-7xl">{heading}</p>
            </div>
        </motion.div>
    );
};

OverlayCopy.propTypes = {
    subheading: PropTypes.string.isRequired,
    heading: PropTypes.string.isRequired,
};

const Content = () => {
    const navigate = useNavigate();

    const handleExplore = () => {
        navigate('/books');
    };

    return (
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pb-24 pt-12 md:grid-cols-12">
            <h2 className="col-span-1 text-3xl font-bold md:col-span-4">
                Mở trang, mở trí <br /> Mỗi câu chuyện, một cuộc phiêu lưu
            </h2>
            <div className="col-span-1 md:col-span-8">
                <p className="mb-4 text-xl text-neutral-600 md:text-2xl">
                    Chào mừng bạn đến với thế giới vô tận của những câu chuyện - Nơi mỗi cuốn sách sẽ đưa bạn đến những
                    vùng đất mới, những nhân vật đáng nhớ và những cảm xúc chưa từng trải qua. Chúng tôi tin rằng mỗi
                    câu chuyện đều có sức mạnh thay đổi cách nhìn, mở rộng tầm hiểu biết và chạm đến trái tim người đọc.
                </p>
                <br />
                <button
                    onClick={handleExplore}
                    className="w-full rounded bg-secondary rounded-lg px-9 py-4 text-xl text-white transition-colors hover:bg-secondaryOne hover:text-black md:w-fit"
                >
                    Khám phá ngay <FiArrowUpRight className="inline" />
                </button>
            </div>
        </div>
    );
};

const Hero = () => {
    return (
        <section className="relative w-full min-h-screen">
            <div className="bg-gradient-to-b from-secondary to-bgColor">
                <TextParallaxContent
                    imgUrl={
                        'https://images.squarespace-cdn.com/content/v1/64d3acb7e7d7f71fb27b9bca/1737657433704-WDHL57BVY6CZ6MPAPAPQ/GettyImages-1254474165.jpg?format=2500w'
                    }
                    subheading="Mỗi cuốn sách"
                    heading="Một thế giới"
                >
                    <Content />
                </TextParallaxContent>
            </div>
        </section>
    );
};

export default Hero;
