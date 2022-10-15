import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import axios from 'axios';
import { toast } from 'react-toastify';

export const SearchItem = ({item, index, deleteSearch, setData, setError}) => {
    //const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${item.city},${item.country}&units=metric&appid=3e5521f9e019fbeec2e81152df4324d7`
    const geoCodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${item.city},${item.country}&limit=1&appid=3e5521f9e019fbeec2e81152df4324d7`;
    const deleteItem = _ => deleteSearch(item)
    const performRepeatSearch = (event) => {
        if (event.key === 'Enter' || event.type === 'click') {
            setError('');
            axios.get(geoCodeUrl).then((response) => {
              if(response.data.length === 0)
                throw("City not found");
              
                var weatherUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + response.data[0].lat + "&lon=" + response.data[0].lon +
                "&appid=3e5521f9e019fbeec2e81152df4324d7";
    
              axios.get(weatherUrl).then((response) => {
                toast.success("Weather updated!", {theme: "dark"});
                setData(response.data);
              })
          }).catch((err) => {
            setData({});
            setError(err);
          })
        }
      }

    return <>
        <div style={{float: "left"}}>{index+1}. {item.city}, {item.country}</div>
        <div className="historyButtons">{new Date(item.id).toLocaleTimeString()}
            <Button variant="light" className="btn-rounded" onClick={performRepeatSearch}>
                <i className="fa-solid fa-magnifying-glass"></i>
            </Button>
            <Button variant="light" className="btn-rounded" onClick={deleteItem}>
                <i className="fa-solid fa-trash-can"></i>
            </Button>
        </div>
        <div style={{clear: "both"}}></div>
        
        <hr></hr>
    </>
}