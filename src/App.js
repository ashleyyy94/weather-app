import React, {useState} from 'react';
import { Button, Col, Container, Row } from "react-bootstrap";
import axios from 'axios';
import { SearchItem } from './SearchItem';

function App() {
  const [data, setData] = useState({});
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');
  const [searches, setSearches] = useState([]);

  const appendSearch = search => setSearches([...searches, search]);

  const addSearch = _ => appendSearch({
    id: (new Date).getTime(),
    city, country
  })

  const deleteSearch = search => setSearches(searches.filter(searchItem => searchItem.id !== search.id));

  // Please note that built-in geocoder has been deprecated. Although it is still available for use, bug fixing and updates are no longer available for this functionality. 
  //const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid=3e5521f9e019fbeec2e81152df4324d7` => this is the updated one using Lat Long
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&units=metric&appid=3e5521f9e019fbeec2e81152df4324d7`// Still usable but deprecated
  
  const performSearch = (event) => {
    if (event.key === 'Enter' || event.type === 'click') {
        setError('');
        addSearch();
        axios.get(apiUrl).then((response) => {
        setData(response.data);
        console.log(response.data);
      }).catch((err) => {
        setData({});
        console.log(err.response.data.message)
        setError(err.response.data.message);
      })
      setCity('');
      setCountry('');
    }
  }

  return (
    <div className="App">
      <h2>Today's Weather</h2>
      <hr></hr>
      <Container>
        <Row className='inputs'>
            <Col sm={12} md={6} lg={3}>
              City: <input
              value={city}
              onChange={event => setCity(event.target.value)}
              onKeyPress={performSearch}
              placeholder='Enter City'
              type="text" />
            </Col>
            <Col sm={12} md={6} lg={3}>
              Country: <input
              value={country}
              onChange={event => setCountry(event.target.value)}
              onKeyPress={performSearch}
              placeholder='Enter Country'
              type="text" />
            </Col >
            <Col sm={3} md={2} lg={1}>
              <Button variant="outline-primary" onClick={performSearch}>
                Search
              </Button>
            </Col>
            <Col sm={3} md={2} lg={1}>
              <Button variant="outline-warning">
                Clear
              </Button>
            </Col>
        </Row>
      </Container>
      <div className='results' style={{ backgroundColor: error.length !== 0 ? "rgba(220, 28, 28, 0.5)" : ""}}>
        <div className='location'>
          {error.length !== 0 ? <p>{error}</p> : null}
          <h3>{data.name}</h3>
        </div>
        <div className='weather'>
          {data.weather ? <h1 className='bold'>{data.weather[0].main}</h1> : null}
          {data.weather ? <img src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`} alt=''></img> : null}
        </div>
        <div className='description'>
          {data.weather ? <p>Description: {data.weather[0].description}</p> : null}
        </div>
        <div className='temp'>
          {data.weather ? <p>Temperature: {data.main.temp.toFixed()}°C</p> : null}
        </div>
        <div className='humidity'>
          {data.weather ? <p>Humidity: {data.main.humidity}%</p> : null}
        </div>
        <div className='time'>
          {data.weather ? <p>Time: {new Date(data.dt * 1000).toString()}</p> : null}
        </div>
      </div>
      <h2>Search History</h2>
      <hr></hr>
      <div className='history'>
      {
        searches.map((item, index) => <SearchItem key={item.id} 
          item={item} 
          index={index} 
          deleteSearch={deleteSearch}
          setData={setData}
          setError={setError}
          />)
      }
      </div>  
    </div>
  );
}

export default App;
