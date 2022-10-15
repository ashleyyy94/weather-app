import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import axios from 'axios';

export const SearchItem = ({item, index, deleteSearch, setData, setError}) => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${item.city},${item.country}&units=metric&appid=3e5521f9e019fbeec2e81152df4324d7`
    const deleteItem = _ => deleteSearch(item)
    const performRepeatSearch = (event) => {
        if (event.key === 'Enter' || event.type === 'click') {
            setError('');
            axios.get(apiUrl).then((response) => {
            setData(response.data);
            console.log(response.data);
          }).catch((err) => {
            setData({});
            console.log(err.response.data.message)
            setError(err.response.data.message);
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