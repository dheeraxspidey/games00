import React from 'react';
import './Header.css';

const Header = ({ isDarkMode, toggleTheme, onBackToHome, onShowRules, onStartGame, gameOver }) => {
    return (
        <header className={`game-header ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <button 
                className="header-button back-button"
                onClick={onBackToHome}
            >
                ← Back to Home
            </button>
            
            <button 
                className="header-button start-button"
                onClick={onStartGame}
            >
                {gameOver ? '🎮 Play Again' : '🎲 New Game'}
            </button>
            
            <button 
                className="header-button theme-button"
                onClick={toggleTheme}
                aria-label="Toggle theme"
            >
                {isDarkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
            
            <button 
                className="header-button rules-button"
                onClick={onShowRules}
            >
                📖 Rules
            </button>
        </header>
    );
};

export default Header; 