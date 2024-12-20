import React from 'react';

const AlphabetButtons = ({ onLetterClick }) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    return (
        <div className="alphabet-buttons">
            {letters.map(letter => (
                <button key={letter} onClick={() => onLetterClick(letter)}>
                    {letter}
                </button>
            ))}
        </div>
    );
};

export default AlphabetButtons; 