import React, { useEffect, useState } from 'react';
import './Home.css';

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => prevProgress + 10);
    }, 300);

    if (progress >= 100) {
      clearInterval(timer);
      setIsLoading(false);
      navigateToLogin();
    }

    return () => clearInterval(timer);
  }, [progress]);

  const navigateToLogin = () => {
    window.location.href = '/login'; // Replace '/login' with the actual path to your login page
  };

  if (isLoading) {
    return (
      <div className="loading-page">
        <div>
          <h1 className='title-home'>WELCOME TO MSO GAME</h1>
        </div>
        <div className="loading-bar">
          <div
            className="progress-bar"
            style={{ width: `${progress}%` }}
          >
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
    </div>
  );
};

export default Home;
