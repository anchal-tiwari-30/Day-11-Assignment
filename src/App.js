import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import 'animate.css/animate.min.css';

const App = () => {
  const [username, setUsername] = useState('');
  const [activity, setActivity] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    fetchUserDetails();
  }, [username]);

  const fetchActivity = async () => {
    try {
      const response = await axios.get(`https://api.github.com/users/${username}/events`);
      setActivity(response.data);
      saveToHistory(username);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`https://api.github.com/users/${username}`);
      setUserDetails(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      fetchActivity();
    }
  };

  const navigateToRepo = (repoUrl) => {
    const githubRepoUrl = repoUrl.replace('api.github.com/repos', 'github.com');
    window.open(githubRepoUrl, '_blank');
  };

  const saveToHistory = (value) => {
    const existingHistory = localStorage.getItem('searchHistory');
    const history = existingHistory ? JSON.parse(existingHistory) : [];
    if (!history.includes(value)) {
      history.push(value);
      localStorage.setItem('searchHistory', JSON.stringify(history));
    }
  };

  const loadFromHistory = () => {
    const existingHistory = localStorage.getItem('searchHistory');
    const history = existingHistory ? JSON.parse(existingHistory) : [];
    return history;
  };

  const handleAutocomplete = (value) => {
    setUsername(value);
  };

  return (
    <div className="container">
      <h1>Github Activity Viewer</h1>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter GitHub username"
          ref={inputRef}
          list="historyList"
        />
        <datalist id="historyList">
          {loadFromHistory().map((item, index) => (
            <option key={index} value={item} />
          ))}
        </datalist>
      </div>
      <button className="btn btn-primary" onClick={fetchActivity}>
        Fetch Activity
      </button>
      {userDetails && activity.length > 0 && (
        <div className="row row-cols-1 row-cols-md-4 mt-3">
          <div className="col mb-4">
            <div className="card animate__animated animate__fadeIn">
              <div className="card-body">
                <h5 className="card-title">Followers</h5>
                <p className="card-text">{userDetails.followers}</p>
              </div>
            </div>
          </div>
          <div className="col mb-4">
            <div className="card animate__animated animate__fadeIn">
              <div className="card-body">
                <h5 className="card-title">Following</h5>
                <p className="card-text">{userDetails.following}</p>
              </div>
            </div>
          </div>
          <div className="col mb-4">
            <div className="card animate__animated animate__fadeIn">
              <div className="card-body">
                <h5 className="card-title">Repositories</h5>
                <p className="card-text">{userDetails.public_repos}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="row row-cols-1 row-cols-md-4 mt-3">
        {activity.map((item, index) => (
          <div key={index} className="col mb-4">
            <div className="card animate__animated animate__fadeIn">
              <div className="card-body">
                <h5 className="card-title">{item.type}</h5>
                <p className="card-text">
                  Repository:
                  <br />
                  <a
                    href={item.repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => navigateToRepo(item.repo.url)}
                  >
                    {item.repo.name}
                  </a>
                  <br />
                  Created At: {item.created_at}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
