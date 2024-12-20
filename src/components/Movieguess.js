import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './Movieguess.css';
import Header from './Header';
import RulesModal from './RulesModal';

const Movieguess = ({ onBackToHome, isDarkMode, toggleTheme }) => {
    const [movieToGuess, setMovieToGuess] = useState('');
    const [currentState, setCurrentState] = useState([]);
    const [guessedLetters, setGuessedLetters] = useState(new Set());
    const [chances, setChances] = useState(6);
    const [message, setMessage] = useState('');
    const [keyboardState, setKeyboardState] = useState({});
    const [movies, setMovies] = useState([]);
    const [streak, setStreak] = useState(0);
    const [gameOver, setGameOver] = useState(true);
    const [hintUsed, setHintUsed] = useState(false);
    const [currentMovieData, setCurrentMovieData] = useState({});
    const [showRules, setShowRules] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [gameStartAnimation, setGameStartAnimation] = useState(false);

    // Load movies from CSV file
    useEffect(() => {
        Papa.parse(`${process.env.PUBLIC_URL}/telugumoviedata.csv`, {
            download: true,
            header: true,
            complete: (results) => {
                const movieTitles = results.data
                    .map((movie) => ({
                        title: movie.Movie?.toUpperCase().trim(),
                        year: movie.Year,
                        genre: movie.Genre,
                    }))
                    .filter((movie) => movie.title);
                setMovies(movieTitles);
                // Start game after movies are loaded
                if (movieTitles.length > 0) {
                    const randomMovie = movieTitles[Math.floor(Math.random() * movieTitles.length)];
                    setMovieToGuess(randomMovie.title);
                    setCurrentMovieData(randomMovie);
                    setCurrentState(
                        randomMovie.title.split('').map((letter) => ({
                            char: letter,
                            flipped: letter === ' ' ? true : false,
                        }))
                    );
                    setChances(6);
                    setGuessedLetters(new Set());
                    setKeyboardState({});
                    setMessage('');
                    setGameOver(false);
                    setHintUsed(false);
                }
            },
            error: (error) => {
                console.error('Error loading CSV:', error);
            },
        });
    }, []);

   

    const startGame = () => {
        if (movies.length === 0) {
            alert('Error loading movies.');
            return;
        }
        setGameStartAnimation(true);
        setTimeout(() => {
            const randomMovie = movies[Math.floor(Math.random() * movies.length)];
            setMovieToGuess(randomMovie.title);
            setCurrentMovieData(randomMovie);
            setCurrentState(
                randomMovie.title.split('').map((letter) => ({
                    char: letter,
                    flipped: letter === ' ' ? true : false,
                }))
            );
            setChances(6);
            setGuessedLetters(new Set());
            setKeyboardState({});
            setMessage('');
            setGameOver(false);
            setHintUsed(false);
            setGameStartAnimation(false);
        }, 500);
    };

    const handleGuess = (letter) => {
        if (guessedLetters.has(letter) || gameOver || isAnimating) return;
        
        setIsAnimating(true);
        const newGuessedLetters = new Set(guessedLetters).add(letter);
        setGuessedLetters(newGuessedLetters);

        const lowerLetter = letter.toLowerCase();
        const lowerMovieTitle = movieToGuess.toLowerCase();

        if (!lowerMovieTitle.includes(lowerLetter)) {
            const newChances = chances - 1;
            setChances(newChances);
            setKeyboardState({ ...keyboardState, [letter]: 'incorrect' });
            
            setTimeout(() => {
                if (newChances === 0) {
                    setGameOver(true);
                    setMessage(`Game Over! The movie was: ${movieToGuess}`);
                    setStreak(0);
                }
                setIsAnimating(false);
            }, 500);
        } else {
            setKeyboardState({ ...keyboardState, [letter]: 'correct' });
            
            const newState = currentState.map((charObj, index) => ({
                char: charObj.char,
                flipped: charObj.char.toLowerCase() === lowerLetter || 
                        charObj.flipped || 
                        charObj.char === ' '
            }));
            setCurrentState(newState);
            
            setTimeout(() => {
                const isWon = newState.every(charObj => 
                    charObj.flipped || charObj.char === ' ' || charObj.char === '-'
                );
                if (isWon) {
                    setGameOver(true);
                    setMessage('Congratulations! You won!');
                    setStreak(streak + 1);
                }
                setIsAnimating(false);
            }, 500);
        }
    };

    const useHint = () => {
        if (!hintUsed && !gameOver) {
            const hintOptions = ['letter', 'year', 'genre'];
            const randomHint = hintOptions[Math.floor(Math.random() * hintOptions.length)];

            if (randomHint === 'letter') {
                const unrevealedIndices = currentState
                    .map((item, index) => (!item.flipped && item.char !== ' ' ? index : null))
                    .filter((index) => index !== null);

                if (unrevealedIndices.length > 0) {
                    const randomIndex = unrevealedIndices[Math.floor(Math.random() * unrevealedIndices.length)];
                    const hintLetter = currentState[randomIndex].char;
                    handleGuess(hintLetter);
                    setMessage(`Hint used! The letter '${hintLetter}' is revealed.`);
                }
            } else if (randomHint === 'year') {
                setMessage(`Hint: The movie was released in ${currentMovieData.year}.`);
            } else if (randomHint === 'genre') {
                setMessage(`Hint: The genre of the movie is ${currentMovieData.genre}.`);
            }

            setHintUsed(true);
        }
    };

    const handleShowRules = () => {
        setShowRules(true);
    };

    const handleCloseRules = () => {
        setShowRules(false);
    };

    const getCardSize = (wordLength) => {
        if (wordLength >= 12) return 'extra-small-card';
        if (wordLength >= 10) return 'small-card';
        if (wordLength >= 8) return 'medium-card';
        return '';
    };

    return (
        <div className={`app-container ${isDarkMode ? "dark-mode" : "light-mode"} 
            ${gameStartAnimation ? 'game-start-animation' : ''}`}>
            <Header 
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
                onBackToHome={onBackToHome}
                onShowRules={handleShowRules}
                onStartGame={startGame}
                gameOver={gameOver}
            />
            
            <div className="App">
                <h1 className="game-title">CineGuess-Telugu</h1>
                
                <div className="game-status">
                    <div 
                        className="chances-counter" 
                        data-chances={chances}
                    >
                        Chances: {chances}
                    </div>
                    
                    <div className="streak-container" data-streak={streak}>
                        <div className="streak">
                            Streak: {streak}
                        </div>
                    </div>

                    <button 
                        className={`game-button hint-button ${hintUsed ? 'used' : ''}`}
                        onClick={useHint} 
                        disabled={hintUsed}
                    >
                        {hintUsed ? 'Hint Used' : 'Use Hint'}
                    </button>
                </div>

                {message && (
                    <div className={`game-message ${
                        message.includes('Congratulations') 
                            ? 'success-message bounce-animation' 
                            : message.includes('Game Over') 
                                ? 'error-message shake-animation' 
                                : ''
                    }`}>
                        {message}
                    </div>
                )}

                <div className={`movie-name-container ${isAnimating ? 'pulse' : ''}`}>
                    <div className="words-container">
                        {movieToGuess && currentState.length > 0 && movieToGuess.split(' ').map((word, wordIndex) => (
                            <div key={wordIndex} className={`word-row ${getCardSize(word.length)}`}>
                                {word.split('').map((char, charIndex) => {
                                    const globalIndex = movieToGuess
                                        .split(' ')
                                        .slice(0, wordIndex)
                                        .join(' ').length + (wordIndex > 0 ? wordIndex : 0) + charIndex;
                                    
                                    return (
                                        <div key={charIndex} className="flip-card">
                                            <div className={`flip-card-inner ${
                                                currentState[globalIndex]?.flipped ? 'flipped' : ''
                                            }`}>
                                                <div className="flip-card-front"></div>
                                                <div className="flip-card-back">
                                                    {char === ' ' ? '\u00A0' : char}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`keyboard ${gameOver ? 'game-over' : ''}`}>
                    {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => (
                        <button
                            key={letter}
                            className={`key ${
                                keyboardState[letter] === 'correct'
                                    ? 'correct-key pop-animation'
                                    : keyboardState[letter] === 'incorrect'
                                    ? 'incorrect-key shake-animation'
                                    : ''
                            }`}
                            onClick={() => handleGuess(letter)}
                            disabled={guessedLetters.has(letter) || gameOver}
                        >
                            {letter}
                        </button>
                    ))}
                </div>
            </div>

            <RulesModal 
                isOpen={showRules} 
                onClose={handleCloseRules}
            />
        </div>
    );
};

export default Movieguess;