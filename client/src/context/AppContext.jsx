import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dummyProducts } from '../assets/assets';
import toast from 'react-hot-toast';
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [seller, setSeller] = useState(null);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [showSellerLogin, setShowSellerLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeller, setSelectedSeller] = useState(null);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get('/api/user/is-auth');
      if (data.success) {
        setUser(data.user);
        // <-- always sync cart from server (even when empty)
        setCartItems(data.user.cartItems || {});
      } else {
        setUser(null);
        setCartItems({});
      }
    } catch {
      setUser(null);
      setCartItems({});
    }
  };

  const fetchSeller = async () => {
    try {
      const { data } = await axios.get('/api/seller/is-auth');
      if (data.success) {
        setSeller(data.seller);
      } else {
        setSeller(null);
      }
    } catch {
      setSeller(null);
    }
  };

  const fetchProducts = async (sellerId = null) => {
    try {
      const { data } = await axios.get(
        sellerId ? `/api/user/${sellerId}/products` : '/api/user/products'
      );
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch products');
    }
  };

  useEffect(() => {
    if (seller?._id) {
      fetchProducts(seller._id);
    }
  }, [seller]);

  useEffect(() => {
    if (selectedSeller) {
      setCartItems({});
      setSearchQuery('');
      fetchProducts(selectedSeller._id);
    }
  }, [selectedSeller]);

  useEffect(() => {
    fetchUser();
    fetchSeller();
  }, []);



  useEffect(() => {
    const updateCart = async () => {
      try {
        const { data } = await axios.post('/api/cart/update', { cartItems });
        if (!data.success) {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (user) {
      updateCart();
    }
  }, [cartItems]);

  useEffect(() => {
    if (selectedSeller) {
      setCartItems({});
    }
  }, [selectedSeller]);

  useEffect(() => {
    if (!seller) {
      setProducts([]);
    }
  }, [seller]);

  // Cart handlers
  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = (cartData[itemId] || 0) + 1;
    setCartItems(cartData);
    toast.success('Added to Cart');
  };

  const updateCartItem = (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success('Cart Updated');
  };

  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }
    setCartItems(cartData);
    toast.success('Removed from Cart');
  };

  const getCartCount = () => {
    return Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const id in cartItems) {
      const product = products.find((p) => p._id === id);
      if (product) {
        totalAmount += product.offerPrice * cartItems[id];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  const value = {
    navigate,
    user,
    setUser,
    seller,
    setSeller,
    showUserLogin,
    setShowUserLogin,
    showSellerLogin,
    setShowSellerLogin,
    products,
    currency,
    addToCart,
    updateCartItem,
    removeFromCart,
    cartItems,
    setCartItems,
    getCartAmount,
    getCartCount,
    searchQuery,
    setSearchQuery,
    axios,
    fetchProducts,
    selectedSeller,
    setSelectedSeller,
    fetchUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContextProvider };
export const useAppContext = () => {
  return useContext(AppContext);
};
