import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Ensure you have this file for styling

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [operationCode, setOperationCode] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const parsedInput = JSON.parse(input);
      const res = await axios.post('http://localhost:3001/bfhl', parsedInput);
      setResponse(res.data);
    } catch (err) {
      setError('Invalid JSON input or API error');
    }
  };

  const handleGetRequest = async () => {
    try {
      const res = await axios.get('http://localhost:3001/bfhl');
      setOperationCode(res.data.operation_code);
    } catch (err) {
      setError('Error fetching operation code');
    }
  };

  const handleSelectChange = (e) => {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedOptions(options);
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
              <select multiple onChange={handleSelectChange}>
                <option value="Alphabets">Alphabets</option>
                <option value="Numbers">Numbers</option>
                <option value="Highest alphabet">Highest alphabet</option>
              </select>
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
