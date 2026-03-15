import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const defaultSettings = {
    background: 'Default',
    font: 'roboto',
    size: '20px',
};

const SettingDropdown = ({ onChangeSettings }) => {
    const [settings, setSettings] = useState(defaultSettings);

    useEffect(() => {
        const saved = localStorage.getItem('chapterSettings');
        if (saved) setSettings(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem('chapterSettings', JSON.stringify(settings));
        if (onChangeSettings) onChangeSettings(settings);
    }, [settings, onChangeSettings]);

    const handleBgChange = (e) => {
        const value = e.target.value;
        if (value === 'Default') {
            setSettings(defaultSettings);
        } else {
            setSettings((s) => ({ ...s, background: value }));
        }
    };

    const handleFontChange = (e) => {
        setSettings((s) => ({ ...s, font: e.target.value }));
    };

    const handleSizeChange = (e) => {
        setSettings((s) => ({ ...s, size: e.target.value }));
    };

    return (
        <div className="bg-white p-6 rounded-md w-[340px] flex flex-col gap-6 shadow-lg border border-gray-200">
            {/* Màu nền */}
            <div className="flex items-center justify-between">
                <span className="text-black font-medium text-lg">Màu nền</span>
                <select
                    className="bg-grey text-black border border-black rounded px-4 py-2 w-[160px] focus:outline-none"
                    value={settings.background}
                    onChange={handleBgChange}
                >
                    <option value="Default">Mặc định</option>
                    <option value="dark">Màu tối</option>
                    <option value="light">Màu trắng</option>
                    <option value="yellow">Màu vàng nhạt</option>
                </select>
            </div>
            {/* Font chữ */}
            <div className="flex items-center justify-between">
                <span className="text-black font-medium text-lg">Font chữ</span>
                <select
                    className="bg-grey text-black border border-black rounded px-4 py-2 w-[160px] focus:outline-none"
                    value={settings.font}
                    onChange={handleFontChange}
                >
                    <option value="roboto">Roboto</option>
                    <option value="arial">Arial</option>
                    <option value="times">Times New Roman</option>
                </select>
            </div>
            {/* Size chữ */}
            <div className="flex items-center justify-between">
                <span className="text-black font-medium text-lg">Size chữ</span>
                <select
                    className="bg-grey text-black border border-black rounded px-4 py-2 w-[160px] focus:outline-none"
                    value={settings.size}
                    onChange={handleSizeChange}
                >
                    <option value="18">18</option>
                    <option value="20">20</option>
                    <option value="24">24</option>
                    <option value="28">28</option>
                    <option value="32">32</option>
                    <option value="36">36</option>
                    <option value="40">40</option>
                </select>
            </div>
        </div>
    );
};

SettingDropdown.propTypes = {
    onChangeSettings: PropTypes.func,
};

export default SettingDropdown;
