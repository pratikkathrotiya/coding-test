import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  // State to hold primary and secondary numbers
  const [primaryNumbers, setPrimaryNumbers] = useState([]);
  const [secondaryNumbers, setSecondaryNumbers] = useState([]);
  // State to manage loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch numbers from the API
  const fetchNumbers = async () => {
    setLoading(true); // Set loading to true
    setError(null); // Reset previous errors
    try {
      // API request to fetch the latest Powerball draw results
      const response = await axios.post('https://data.api.thelott.com/sales/vmax/web/data/lotto/latestresults', {
        CompanyId: "GoldenCasket",
        MaxDrawCountPerProduct: 1,
        OptionalProductFilter: ["Powerball"]
      });

      // Extract primary and secondary numbers from the API response
      const drawResults = response.data.DrawResults[0];
      setPrimaryNumbers(drawResults.PrimaryNumbers);
      setSecondaryNumbers(drawResults.SecondaryNumbers);
    } catch (error) {
      // Set error state if the API request fails
      setError("Error fetching draw results");
      console.error("Error fetching draw results", error);
    } finally {
      // Set loading to false
      setLoading(false);
    }
  };

  // Function to clear the numbers from the state
  const clearNumbers = () => {
    setPrimaryNumbers([]);
    setSecondaryNumbers([]);
  };

  return (
    <div className="container">
      <h1 className="text-center col-12 mt-5">Powerball Ticket</h1>
      <div className="d-flex justify-content-center align-items-center flex-wrap">
  <div className="d-flex align-items-center flex-wrap mb-3 mb-md-0">
    {Array.from({ length: 7 }).map((_, index) => (
      <div
        key={index}
        className={`circle border border-primary m-1 primaryNumber ${primaryNumbers[index] ? 'bgcolour' : ''}`}
      >
        {primaryNumbers[index] || ''}
      </div>
    ))}
    <div className="circle border border-primary grey m-1 secondaryNumber">
      {secondaryNumbers[0] || 'PB'}
    </div>
  </div>
  <div className="d-flex align-items-center col-12 col-md-auto mt-3 mt-md-0">
    <button className="autofill-button mx-2" onClick={fetchNumbers} disabled={loading} aria-label="autofill">
      {loading ? 'Loading...' : <span role="img" aria-label="lightning" className="loading-icon">⚡</span>}
    </button>
    <button className="delete-button mx-2" onClick={clearNumbers} aria-label="clearfill">
      <span role="img" aria-label="delete">🗑️</span>
    </button>
  </div>
</div>
     
      <div className="number-grid align-items-center">
        {Array.from({ length: 35 }).map((_, index) => (
          <button
            key={index}
            className={primaryNumbers.includes(index + 1) ? 'selected' : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <div className="powerball-section">
        <h4 className='align-items-center'>Select Your Powerball</h4>
        <div className="number-grid powerballNumber align-items-center">
          {Array.from({ length: 20 }).map((_, index) => (
            <button
              key={index}
              className={secondaryNumbers.includes(index + 1) ? 'selected' : ''}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default App;
