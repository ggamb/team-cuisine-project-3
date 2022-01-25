import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import MenuItem from '../MenuItem';
import { ADD_PRODUCT } from '../../utils/mutations';
import { useMutation } from '@apollo/client';

//const SerpApi = require('google-search-results-nodejs');

function Menu() {

  //Sample data for use if key not working
  /*let [menuData, setMenuData] = useState([
    { _id: '2797408369084165701', menu_item_name: '6 Point', menu_item_price: 3.5, itemPriceString: '$3.50', subsection: 'Draft Beer', menu_item_description: 'A beer' },
    {
      _id: '5668391956307511358', menu_item_name: 'The Rooster', menu_item_price: 15, itemPriceString: '$15.00', subsection: 'Burgers & Sandwiches', menu_item_description: 'a tasty sandwich'
    }
  ]);*/

  //State setter used to display menu data
  let [menuData, setMenuData] = useState([]);
  const { id } = useParams();

  //API key in .env in root of client folder
  const apiKey = process.env.REACT_APP_API;

  //GraphQL mutation to add products to databased
  const [addProduct, {data, loading, error}] = useMutation(ADD_PRODUCT);


  useEffect(() => {
    let sampleMenuData = [];

    fetch(`https://api.documenu.com/v2/restaurant/${id}/menuitems`, {
      "method": "GET",
      "headers": {
        "x-api-key": apiKey
      }
    })
      .then(response => response.json())
      .then(menu => {
        menu.data.forEach(menuItem => {
          //Adds all menu items to sampleMenuData array to be used in setter below
          sampleMenuData.push(menuItem);

          //Adds all products to database based on graphQL mutation
          addProduct({
            variables: { 
              name: menuItem.menu_item_name,
              price: menuItem.menu_item_price,
              description: menuItem.menu_item_description
             }
          })
        })

        setMenuData(sampleMenuData);

      })
      .catch(err => {
        console.error(err);
      });
  }, []);


  console.log(menuData);

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
      <div className="my-2">
        <h2>Choose from the following menu items:</h2>
        {menuData.length ? (
          <div className="flex-row">
            {menuData.map(menuItem => (
              <MenuItem
                key={menuItem.item_id}
                _id={menuItem.item_id}
                itemName={menuItem.menu_item_name}
                itemPriceFloat={menuItem.menu_item_price}
                itemPriceString={menuItem.menu_item_pricing[0].priceString}
                category={menuItem.subsection}
                description={menuItem.menu_item_description}
              />
            ))}
          </div>
        ) : (
          <h3>There is no menu data for this restaurant :(</h3>
        )}
      </div>
    </>
  );
}

export default Menu;
