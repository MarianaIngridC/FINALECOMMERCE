import {createContext, useReducer} from 'react'

export const Store = createContext()

const initialState = {
  useInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
  cart: {
    shippingAddress: localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')) :{},
    paymentMethod: localStorage.getItem('paymentMethod') ? localStorage.getItem('paymentMethod') : '',
    cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
    
  }
};
//console.log(localStorage.getItem('cartItems'))

function reducer(state, action){
  switch(action.type) {
    case 'CART_ADD_ITEM':
      //add to cart
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find((item) => item._id === newItem._id);
      //if item already exists on the cart then return whatever it comes from action.payload, otherwise return the items that already exist on the state whithout a change
      const cartItems = existItem 
      ? state.cart.cartItems.map((item) => item._id === existItem._id ? newItem : item)
      //if item does not exists on the cart state(ie existItem is undefined), then add it to the cart state
      : [...state.cart.cartItems, newItem];

      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems}
        };

    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter((item) => item._id !== action.payload._id);

      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return {
        ...state,
        cart: {...state.cart, cartItems}
      }
    };
    case 'CART_CLEAR':
      return { ...state, cart: {...state.cart, cartItems: []}};

    case 'USER_SIGNIN':
      return {
        ...state,
        userInfo: action.payload
      };
    
    case 'USER_SIGNOUT':
      return {
        ...state,
        userInfo: null,
        cart: {
          cartItems: [],
          shippingAddress: {},
          paymentMethod: ''
        }
      };
    
    case 'SAVE_SHIPPING_ADDRESS':
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload
        }
      }
    
    case 'SAVE_PAYMENT_METHOD':
      return {
        ...state,
        cart: {
          ...state.cart,
          paymentMethod: action.payload
        }
      }
    default:
      return state;
  }
}

export function StoreProvider (props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = {state, dispatch};

  return <Store.Provider value={value}>{props.children}</Store.Provider>
}

