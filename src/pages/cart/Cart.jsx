import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:3001";

  // GET CART

  const getCart = async () => {
    try {
      if (!token) {
        console.log("Token missing");
        setLoading(false);
        return;
      }

      const res = await axios.post(
        `${API_URL}/api/cart`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Cart Response:", res.data);

      if (res.data.success) {
        setCart(res.data.cart || []);
      }
    } catch (err) {
      console.log("Cart Error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // REMOVE CART

  const removeCart = async (cartId) => {
    try {
      if (!token) {
        console.log("Token missing");
        return;
      }

      const res = await axios.post(
        `${API_URL}/api/cart/${cartId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Remove Response:", res.data);

      if (res.data.success) {
        setCart((prevCart) => prevCart.filter((item) => item._id !== cartId));
      }
    } catch (err) {
      console.log("Remove Cart Error:", err.response?.data || err.message);
    }
  };

  // IMAGE URL

  const getImageUrl = (image) => {
    if (!image) {
      return "";
    }

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    if (image.startsWith("/uploads/")) {
      return `${API_URL}${image}`;
    }

    if (image.startsWith("uploads/")) {
      return `${API_URL}/${image}`;
    }

    return `${API_URL}/uploads/${image}`;
  };

  // PRODUCT DETAILS

  const openProductDetails = (product) => {
    navigate("/product-details", {
      state: {
        product: product,
      },
    });
  };

  // GET CART

  useEffect(() => {
    getCart();
  }, []);

  // LOADING

  if (loading) {
    return (
      <div className="cart-container">
        <h2>Loading Cart...</h2>
      </div>
    );
  }

  // EMPTY CART

  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <h2 className="cart-title">My Cart</h2>

        <h4>Cart is Empty</h4>
      </div>
    );
  }

  // CART

  return (
    <div className="cart-container">
      <h2 className="cart-title">My Cart</h2>

      {cart.map((item) => {
        const product = item.productId;

        if (!product) {
          return null;
        }

        const productImage =
          product.images && product.images.length > 0 ? product.images[0] : "";

        const imageUrl = getImageUrl(productImage);

        const total = Number(product.price || 0) * Number(item.quantity || 0);

        return (
          <div className="cart-card" key={item._id}>
         

            <div
              className="cart-product-click"
              onClick={() => openProductDetails(product)}
            >

              <div className="cart-image">
                {productImage ? (
                  <img src={imageUrl} alt={product.name || "Product"} />
                ) : (
                  <div className="no-image">No Image</div>
                )}
              </div>

              {/* PRODUCT DETAILS */}

              <div className="cart-details">
                <h5 className="product-name">{product.name}</h5>

                <p className="product-description">{product.description}</p>

                <h4 className="product-price">₹ {product.price}</h4>

                <p className="product-quantity">Quantity: {item.quantity}</p>

                <p className="product-total">Total: ₹ {total}</p>
              </div>
            </div>

            {/* REMOVE BUTTON */}

            <button
              type="button"
              className="remove-btn"
              onClick={(e) => {
                e.stopPropagation();
                removeCart(item._id);
              }}
            >
              Remove
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Cart;
