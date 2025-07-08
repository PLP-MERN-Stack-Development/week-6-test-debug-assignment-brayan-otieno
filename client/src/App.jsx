import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BugForm from './components/BugForm';
import BugList from './components/BugList';
import ErrorBoundary from './components/ErrorBoundary';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [bugs, setBugs] = useState([]);

  useEffect(() => {
    fetchBugs();
  }, []);

  const fetchBugs = async () => {
    try {
      const response = await axios.get('/api/bugs');
      setBugs(response.data);
    } catch (error) {
      console.error('Error fetching bugs:', error);
      alert('Failed to fetch bugs. Please try again.');
    }
  };

  const handleBugSubmit = (newBug) => {
    setBugs(prev => [newBug, ...prev]);
  };

  const handleBugUpdate = (updatedBug) => {
    setBugs(prev => 
      prev.map(bug => bug._id === updatedBug._id ? updatedBug : bug)
    );
  };

  const handleBugDelete = (bugId) => {
    setBugs(prev => prev.filter(bug => bug._id !== bugId));
  };

  return (
    <ErrorBoundary>
      <div className="container mt-5">
        <h1 className="mb-4">Bug Tracker</h1>
        <div className="row">
          <div className="col-md-6">
            <BugForm onSubmit={handleBugSubmit} />
          </div>
          <div className="col-md-6">
            <BugList
              bugs={bugs}
              onUpdate={handleBugUpdate}
              onDelete={handleBugDelete}
            />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
