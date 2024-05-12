/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import './App.css';
import Sentiment from 'sentiment';

const App = () => {
  const sentiment = new Sentiment();
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState({ score: 0, negative: [], positive: [] });

  useEffect(() => {
    const tempResult = sentiment.analyze(inputText);
    setResult(tempResult);
    console.log(tempResult);
  }, [inputText]);

  return (
    <div className="background-image">
      <nav className='navbar'>
        <ul>
          <li><a href='#home'>Home</a></li>
          <li><a href='CommentAnalyzer.html'>Comment Analyzer</a></li>{/* Link to CommentAnalyzer.html */}
          <li><a href='contact.html'>Contact</a></li> {/* Link to contact.html */}
          
        </ul>
      </nav>
      <div className='App-header'>
        <p className='emoji'>
          {result.score === 0 ? '😐' : result.score < 0 ? '😞' : '🙂'}
        </p>
        <input
          type='text'
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder=' '
        />
        <div className='result'>
          {result.negative &&
            result.negative.map((item, index) => (
              <span key={index} className='negative'>
                {item}
              </span>
            ))}
          {result.positive &&
            result.positive.map((item, index) => (
              <span key={index} className='positive'>
                {item}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
};

export default App;
