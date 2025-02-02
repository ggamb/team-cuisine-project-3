import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import MenuItem from '../MenuItem';
import { ADD_PRODUCT } from '../../utils/mutations';
import { useMutation } from '@apollo/client';
import { useLocation } from 'react-router-dom';
import { Loader } from "@googlemaps/js-api-loader";
import Category from '../Category';
const axios = require("axios");

function Menu() {

  //Sample data for use if key not working
  /*let [menuData, setMenuData] = useState([
    { _id: '2797408369084165701', menu_item_name: '6 Point', menu_item_price: 3.5, itemPriceString: '$3.50', subsection: 'Draft Beer', menu_item_description: 'A beer' },
    {
      _id: '5668391956307511358', menu_item_name: 'The Rooster', menu_item_price: 15, itemPriceString: '$15.00', subsection: 'Burgers & Sandwiches', menu_item_description: 'a tasty sandwich'
    }
  ]);*/

  //State setter used to display menu data and related info
  let [menuData, setMenuData] = useState([]);
  const { id } = useParams();

  //API key in .env in root of client folder
  const apiKey = process.env.REACT_APP_API_MEALME;
  const googleApiKey = process.env.REACT_APP_API_GOOGLE;

  //GraphQL mutation to add products to database
  const [addProduct, { data, loading, error }] = useMutation(ADD_PRODUCT);

  //useLocation needed to pass props from RestaurantList component
  const location = useLocation();

  //Load for google maps
  const loader = new Loader({
    apiKey: googleApiKey,
    version: "weekly",
  });

  //Sets menu items based on call to API
  useEffect(() => {
    let sampleMenuData = [];

    const options = {
      method: 'GET',
      url: 'https://mealme.p.rapidapi.com/restaurants/details/menu',
      params: {
        quote_id: id,
      },
      headers: {
        'X-RapidAPI-Host': 'mealme.p.rapidapi.com',
        'X-RapidAPI-Key': apiKey
      }
    };

    axios.request(options).then(function (response) {
      response.data.categories.forEach(menuItem => {
        console.log(response.data.categories)
        sampleMenuData.push(menuItem);
      });
      setMenuData(sampleMenuData);

    }).catch(function (error) {
      console.error(error);
    });
  }, []);

  //Gives location of restaurant via call to Google Maps API to get lat/long and then call to Google Maps again to display map
  useEffect(() => {
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${location.state.address}&key=${googleApiKey}`)
      .then(response => response.json())
      .then(locationData => {
        const restaurantLocation = {
          lat: locationData.results[0].geometry.location.lat,
          lng: locationData.results[0].geometry.location.lng
        }

        loader.load().then(() => {
          const map = new google.maps.Map(document.getElementById("map"), {
            center: { lat: restaurantLocation.lat, lng: restaurantLocation.lng },
            zoom: 16
          });

          const marker = new google.maps.Marker({
            position: { lat: restaurantLocation.lat, lng: restaurantLocation.lng },
            map: map,
          });
        })
          .catch(err => {
            console.error(err);
          });
      }, []);
  })


  /*<h1>Select your items:</h1>
  {resturants.map((item) => (
  <button
    key={item._id}
    onClick={() => {
      handleClick(item._id);
    }}
  >
    {item.name}
  </button>
))}*/

  return (
    <>
      <Link to="/">← Back to restaurants</Link>
      <p className='now-viewing'>Now viewing:</p> <br></br>

      <div className='box-border'>
        {location.state.priceRange ?
          (<h1>{location.state.name} ({location.state.priceRange})</h1>)
          : (<h1>{location.state.name}</h1>)
        }
        <h3>{location.state.address}</h3>
        <h3>{location.state.phoneNumber}</h3>
        {/*This API does not have websites <h3><a href={location.state.website}>Website</a></h3> */}
      </div>

      <br></br>

      <div id='map'></div>

      <br></br>

      <div className="my-2">
        <br></br>
        {menuData.length ? (
          <div className="flex-start">
              <>
                <Category
                  categoryDetail = {menuData}
                />
              </>
          </div>
        ) : (
          <h3>There is no menu data for this restaurant :(</h3>
        )}
      </div>
    </>
  );
}

export default Menu;
