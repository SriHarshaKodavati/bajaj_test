import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Ensure you have this file for styling

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [operationCode, setOperationCode] = useState(null);

  // Updated URL for the POST request
  const backendURL = 'https://bajaj-backend-82ng.vercel.app';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const parsedInput = JSON.parse(input);
      const res = await axios.post(`${backendURL}/bfhl`, parsedInput);
      setResponse(res.data);
    } catch (err) {
      setError('Invalid JSON input or API error');
    }
  };

  const handleGetRequest = async () => {
    try {
      const res = await axios.get(`${backendURL}/bfhl`);
      setOperationCode(res.data.operation_code);
    } catch (err) {
      setError('Error fetching operation code');
    }
  };

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    setSelectedOptions(prevOptions => 
      prevOptions.includes(value)
        ? prevOptions.filter(option => option !== value)
        : [...prevOptions, value]
    );
  };

  const renderFilteredResponse = () => {
    if (!response) return null;

    const filteredResponse = {
      is_success: response.is_success,
      user_id: response.user_id,
      email: response.email,
      roll_number: response.roll_number
    };
    
    selectedOptions.forEach(option => {
      if (option === 'Alphabets') filteredResponse.alphabets = response.alphabets;
      if (option === 'Numbers') filteredResponse.numbers = response.numbers;
      if (option === 'Highest alphabet') filteredResponse.highest_lowercase_alphabet = response.highest_lowercase_alphabet;
    });

    return (
      <pre>{JSON.stringify(filteredResponse, null, 2)}</pre>
    );
  };

  return (
    <div className="App">
      <h1>21BCE8726</h1>
      <div className="container">
        <div className="post-section">
          <h2>POST Request</h2>
          <form onSubmit={handleSubmit}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Enter JSON here'
            />
            <button type="submit">Submit POST Request</button>
          </form>
          {response && (
            <div className="response-section">
              <h3>Response:</h3>
              <p>Select the options below to view specific parts of the response:</p>
              <div>
                <label>
                  <input
                    type="checkbox"
                    value="Alphabets"
                    checked={selectedOptions.includes('Alphabets')}
                    onChange={handleCheckboxChange}
                  />
                  Alphabets
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Numbers"
                    checked={selectedOptions.includes('Numbers')}
                    onChange={handleCheckboxChange}
                  />
                  Numbers
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Highest alphabet"
                    checked={selectedOptions.includes('Highest alphabet')}
                    onChange={handleCheckboxChange}
                  />
                  Highest alphabet
                </label>
              </div>
              {renderFilteredResponse()}
            </div>
          )}
        </div>
        <div className="get-section">
          <h2>GET Request</h2>
          <button onClick={handleGetRequest}>Fetch Operation Code</button>
          {operationCode !== null && (
            <p>Operation Code: {operationCode}</p>
          )}
        </div>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default App;
