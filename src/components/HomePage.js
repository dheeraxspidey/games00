import React from 'react';
import './HomePage.css';

const HomePage = ({ onStartGame }) => {
    const games = [
        {
            id: 1,
            title: "Telugu Movie Guess",
            description: "Guess Telugu movie titles letter by letter",
            icon: "🎬",
            isActive: true
        },
        {
            id: 2,
            title: "Actor Guess",
            description: "Guess Telugu actors from movie clues",
            icon: "🎭",
            isActive: false
        },
        {
            id: 3,
            title: "Song Guess",
            description: "Guess Telugu movie songs from lyrics",
            icon: "🎵",
            isActive: false
        }
    ];

    return (
        <div className="home-page">
            <div className="home-content">
                <h1 className="home-title">
                    <span className="title-word">Tollywood</span>
                    <span className="title-word">Quest</span>
                    <span className="title-word">Arena</span>
                </h1>

                <div className="games-grid">
                    {games.map(game => (
                        <div key={game.id} className={`game-card ${!game.isActive ? 'coming-soon' : ''}`}>
                            <span className="game-icon">{game.icon}</span>
                            <h2 className="game-card-title">{game.title}</h2>
                            <p className="game-card-description">{game.description}</p>
                            {game.isActive ? (
                                <button 
                                    className="play-button"
                                    onClick={() => onStartGame(game.id)}
                                >
                                    Play Now
                                </button>
                            ) : (
                                <div className="coming-soon-badge">
                                    <span>Coming Soon</span>
                                    <span className="sparkle">✨</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage; 