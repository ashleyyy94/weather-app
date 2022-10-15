import React, {useState} from 'react';
import { Button, Col, Container, Row } from "react-bootstrap";
import axios from 'axios';
import { SearchItem } from './SearchItem';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [data, setData] = useState({});
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');
  const [searches, setSearches] = useState([]);


  const appendSearch = search => setSearches([...searches, search]);

  const addSearch = (city, country) => appendSearch({
    id: (new Date).getTime(),
    city: city, country: country
  })

  const deleteSearch = search => setSearches(searches.filter(searchItem => searchItem.id !== search.id));

  // Please note that built-in geocoder has been deprecated. Although it is still available for use, bug fixing and updates are no longer available for this functionality. 
  //const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&units=metric&appid=3e5521f9e019fbeec2e81152df4324d7`; // Still usable but deprecated
  const geoCodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city},${country}&limit=1&appid=3e5521f9e019fbeec2e81152df4324d7`;

  const clearInputs = () => {
    setCity('');
    setCountry('');
  }

  const performSearch = (event) => {
    if (event.key === 'Enter' || event.type === 'click') {
        if(city.length === 0) {
          toast.error("City cannot be empty!", {theme: "dark"});
          return;
        }
        setError('');
        axios.get(geoCodeUrl).then((response) => {
          //console.log(response);
          if(response.data.length === 0)
            throw("City not found");

          addSearch(city, response.data[0].country);
          var weatherUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + response.data[0].lat + "&lon=" + response.data[0].lon +
            "&units=metric&appid=3e5521f9e019fbeec2e81152df4324d7";

          axios.get(weatherUrl).then((response) => {
            toast.success("Weather updated!", {theme: "dark"});
            setData(response.data);
          })
          .catch((err) => {
            setData({});
            setError(err);
          })
      })
      .catch((err) => {
        setData({});
        console.log(err)
        setError(err);
      })
      
      setCity('');
      setCountry('');
    }
  }

  return (
    <div className="App">
      <ToastContainer position="top-center"/>
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
              <Button variant="outline-warning" onClick={clearInputs}>
                Clear
              </Button>
            </Col>
        </Row>
      </Container>
      <div className='results' style={{ backgroundColor: error.length !== 0 ? "rgba(220, 28, 28, 0.5)" : ""}}>
        <div className='location'>
          {error.length !== 0 ? <h5>{error}</h5> : null}
          {data.name ? <h3>{data.name}</h3> : null }
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
