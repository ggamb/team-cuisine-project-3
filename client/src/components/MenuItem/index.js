import React from "react";
import { useStoreContext } from "../../utils/GlobalState";
import { ADD_TO_CART, UPDATE_CART_QUANTITY } from "../../utils/actions";
import { idbPromise } from "../../utils/helpers";
import {
  Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button
} from 'reactstrap'

function MenuItem(menuItem) {
  const [state, dispatch] = useStoreContext();

  const { _id, itemName, itemPriceString, itemPriceFloat, category } = menuItem;
  console.log("Menu Item", menuItem);
  const { cart } = state;

  let {description} = menuItem;

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  description = capitalizeFirstLetter(description);

  const addToCart = () => {
    const itemInCart = cart.find((cartItem) => cartItem._id === _id)
    if (itemInCart) {
      dispatch({
        type: UPDATE_CART_QUANTITY,
        _id: _id,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });
      idbPromise('cart', 'put', {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });
    } else {
      dispatch({
        type: ADD_TO_CART,
        product: { ...menuItem, purchaseQuantity: 1 }
      });
      // idbPromise('cart', 'put', { ...item, purchaseQuantity: 1 });
    }
  }

  return (
    <>
      <Card color="light" className="card-style">
        <CardBody>
          <CardTitle tag='h5'>
            {itemName}
          </CardTitle>
          <CardSubtitle className="mb-2 text-muted" tag="h6">
            {category ? (
              <>{category}</>
            ) : null}
          </CardSubtitle>
          <p>{itemPriceString}</p>
          <p className="last-menu-item">{description}</p>
        </CardBody>
        <Button
            className="menu-button"
            active
            block
            color="primary"
            size="sm"
            onClick={addToCart}>
            Add to order
          </Button>
      </Card>
    </>
  );
};


export default MenuItem;