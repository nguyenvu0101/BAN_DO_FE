import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import cartService from "../services/cartService";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isLoggedIn) {
      setCartItems([]);
      return;
    }
    try {
      setLoading(true);
      const res = await cartService.getCart();
      setCartItems(res.data || []);
    } catch {
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    await cartService.addToCart({ productId, quantity });
    await fetchCart();
  };

  const updateItem = async (productId, quantity) => {
    await cartService.updateItem(productId, { quantity });
    await fetchCart();
  };

  const removeItem = async (productId) => {
    await cartService.removeItem(productId);
    await fetchCart();
  };

  const clearCart = async () => {
    await cartService.clearCart();
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.quantity * (item.product?.price || 0),
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        cartCount,
        cartTotal,
        addToCart,
        updateItem,
        removeItem,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);
