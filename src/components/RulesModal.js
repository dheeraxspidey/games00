import React from 'react';
import './RulesModal.css';

const RulesModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="rules-modal-overlay" onClick={onClose}>
            <div className="rules-modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>×</button>
                <h2>How to Play</h2>
                <div className="rules-list">
                    <div className="rule-item">
                        <span className="rule-number">1</span>
                        <p>Guess the Telugu movie title one letter at a time</p>
                    </div>
                    <div className="rule-item">
                        <span className="rule-number">2</span>
                        <p>You have 6 chances to make wrong guesses</p>
                    </div>
                    <div className="rule-item">
                        <span className="rule-number">3</span>
                        <p>Use hints when stuck (year or genre of the movie)</p>
                    </div>
                    <div className="rule-item">
                        <span className="rule-number">4</span>
                        <p>Build your streak by guessing consecutive movies correctly</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RulesModal; 