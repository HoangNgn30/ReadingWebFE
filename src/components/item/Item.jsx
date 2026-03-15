import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { useAuthorClick } from '../../utils/authorUtils';

const Item = ({ book }) => {
    const navigate = useNavigate();
    const handleAuthorClick = useAuthorClick();

    if (!book) return null;

    const handleClick = () => {
        navigate(`/story/${book.id}`);
    };

    //Hover 3D
    const ROTATION_RANGE = 32.5;
    const HALF_ROTATION_RANGE = ROTATION_RANGE / 2;

    const TiltImage = ({ image, title }) => {
        const ref = useRef(null);

        const x = useMotionValue(0);
        const y = useMotionValue(0);

        const xSpring = useSpring(x);
        const ySpring = useSpring(y);

        const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

        const handleMouseMove = (e) => {
            if (!ref.current) return;

            const rect = ref.current.getBoundingClientRect();
            const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
            const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;

            const rX = (mouseY / rect.height - HALF_ROTATION_RANGE) * -1;
            const rY = mouseX / rect.width - HALF_ROTATION_RANGE;

            x.set(rX);
            y.set(rY);
        };

        const handleMouseLeave = () => {
            x.set(0);
            y.set(0);
        };

        return (
            <motion.div
                ref={ref}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    transform,
                    transformStyle: 'preserve-3d',
                }}
                className="relative w-[280px] h-[300px]"
            >
                {/*  background frame */}
                <div
                    style={{
                        transform: 'translateZ(-20px)',
                        transformStyle: 'preserve-3d',
                    }}
                    className="absolute -inset-3 bg-secondary bg-opacity-40 rounded-lg"
                />
                {/* Image container */}
                <div
                    style={{
                        transform: 'translateZ(0)',
                        transformStyle: 'preserve-3d',
                    }}
                    className="relative w-full h-full rounded-lg shadow-xl shadow-slate-900/30 overflow-hidden"
                >
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
                    />
                </div>
            </motion.div>
        );
    };

    TiltImage.propTypes = {
        image: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
    };

    return (
        <div className="w-full cursor-pointer" onClick={handleClick}>
            <div className="flexCenter bg-bgColor p-6 rounded-3xl overflow-hidden relative group">
                <TiltImage image={book.image} title={book.title} />
            </div>
            <div className="mt-4">
                <div className="mb-1 text-left">
                    <button
                        onClick={e => handleAuthorClick(book.authorName, e)}
                        className="text-base font-semibold text-black hover:text-gray-500 transition-colors"
                    >
                        {book.authorName}
                    </button>
                </div>
                <div>
                    <h4 className="h4 line-clamp-1 !my-0">{book.title}</h4>
                </div>
                <p className="text-text1 overflow-hidden text-ellipsis whitespace-normal line-clamp-2 max-h-[3em]">
                    {book.description}
                </p>
            </div>
        </div>
    );
};

Item.propTypes = {
    book: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        authorName: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
    }).isRequired,
};

export default Item;
