import React from 'react';
import { Gender } from '../types';

interface CategorySelectorProps {
    currentCategory: Gender;
    onSelectCategory: (gender: Gender) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ currentCategory, onSelectCategory }) => {
    return (
        <div className="bg-white border-b border-gray-200 sticky top-16 md:top-16 z-40">
            <div className="container mx-auto px-4">
                <div className="flex justify-center">
                    <button
                        onClick={() => onSelectCategory('female')}
                        className={`px-8 py-3 font-bold text-sm tracking-widest transition-all duration-200 relative ${currentCategory === 'female'
                                ? 'text-pink-600'
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        FEMALE
                        {currentCategory === 'female' && (
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-pink-600 rounded-t-full" />
                        )}
                    </button>
                    <button
                        onClick={() => onSelectCategory('male')}
                        className={`px-8 py-3 font-bold text-sm tracking-widest transition-all duration-200 relative ${currentCategory === 'male'
                                ? 'text-pink-600'
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        MALE
                        {currentCategory === 'male' && (
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-pink-600 rounded-t-full" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CategorySelector;
