import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const product = location.state?.product;
  const initialQuantity = location.state?.quantity || 1;

  const [quantity, setQuantity] = useState(initialQuantity);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  // PAYMENT METHOD
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [placingOrder, setPlacingOrder] = useState(false);

  // ==========================================
  // PRODUCT CHECK
  // ==========================================

  if (!product) {
    return (
      <div className="checkout-page">
        <div className="checkout-not-found">
          <div className="checkout-not-found-icon">🛒</div>

          <h2>Product Not Found</h2>

          <p>
            Product data nahi mila. Please cart se product dobara open karein.
          </p>

          <button className="back-cart-btn" onClick={() => navigate("/cart")}>
            ← Go To Cart
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // TOTAL
  // ==========================================

  const total = Number(product.price) * Number(quantity);

  // ==========================================
  // PLACE ORDER
  // ==========================================

  const placeOrder = async (e) => {
    e.preventDefault();

    if (!address.trim()) {
      alert("Please enter delivery address");
      return;
    }

    if (!phone.trim()) {
      alert("Please enter mobile number");
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Please enter a valid 10 digit mobile number");
      return;
    }

    if (!paymentMethod) {
      alert("Please select payment method");
      return;
    }

    try {
      setPlacingOrder(true);

      const orderDetails = {
        productId: product._id,
        quantity: quantity,
        price: product.price,
        total: total,
        address: address,
        phone: phone,
        paymentMethod: paymentMethod,
      };

      console.log("Order Details:", orderDetails);

      alert(
        paymentMethod === "COD"
          ? "Order placed successfully!"
          : "Online payment selected. Payment gateway backend me connect karna hoga.",
      );

      navigate("/cart");
    } catch (error) {
      console.log("Order Error:", error);

      alert("Order place nahi ho saka");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="checkout-page">
          {/* PAGE TITLE */}

      <div className="checkout-header">
        <button className="checkout-back-btn" onClick={() => navigate("/cart")}>
          ← Back To Cart
        </button>

        <h1 className="checkout-title">Checkout</h1>
      </div>

          CHECKOUT LAYOUT

      <div className="checkout-layout">
            {/* PRODUCT SUMMARY */}

        <div className="checkout-product">
          <div className="checkout-section-title">
            <span>🛍️</span>
            <h3>Product Details</h3>
          </div>

          {/* PRODUCT IMAGE */}

          {product.images && product.images.length > 0 ? (
            <div className="checkout-product-image">
              <img src={product.images[0]} alt={product.name} />
            </div>
          ) : (
            <div className="checkout-no-image">🖼️</div>
          )}

          <h2 className="checkout-product-name">{product.name}</h2>

          <p className="checkout-product-price">Price: ₹ {product.price}</p>

          {/* QUANTITY */}

          <div className="checkout-quantity-section">
            <span className="quantity-label">Quantity</span>

            <div className="quantity-box">
              <button
                type="button"
                onClick={() => {
                  if (quantity > 1) {
                    setQuantity(quantity - 1);
                  }
                }}
              >
                −
              </button>

              <span>{quantity}</span>

              <button
                type="button"
                onClick={() => {
                  if (quantity < Number(product.stock)) {
                    setQuantity(quantity + 1);
                  }
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* TOTAL */}

          <div className="checkout-total">
            <span>Total Amount</span>

            <strong>₹ {total}</strong>
          </div>
        </div>

        {/* ======================================
            DELIVERY + PAYMENT FORM
        ====================================== */}

        <form className="checkout-form" onSubmit={placeOrder}>
          {/* DELIVERY DETAILS */}

          <div className="checkout-section-title">
            <span>📦</span>
            <h3>Delivery Details</h3>
          </div>

          {/* PHONE */}

          <div className="checkout-field">
            <label>Mobile Number</label>

            <input
              type="tel"
              value={phone}
              maxLength="10"
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter 10 digit mobile number"
            />
          </div>

          {/* ADDRESS */}

          <div className="checkout-field">
            <label>Delivery Address</label>

            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter complete delivery address"
              rows="5"
            />
          </div>

          {/* ======================================
              PAYMENT METHOD
          ====================================== */}

          <div className="payment-section">
            <div className="checkout-section-title">
              <span>💳</span>
              <h3>Payment Method</h3>
            </div>

            {/* COD */}

            <label
              className={`payment-option ${
                paymentMethod === "COD" ? "payment-selected" : ""
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />

              <div className="payment-icon">💵</div>

              <div className="payment-info">
                <strong>Cash on Delivery</strong>

                <span>Pay when your order is delivered</span>
              </div>
            </label>

            {/* ONLINE PAYMENT */}

            <label
              className={`payment-option ${
                paymentMethod === "ONLINE" ? "payment-selected" : ""
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="ONLINE"
                checked={paymentMethod === "ONLINE"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />

              <div className="payment-icon">💳</div>

              <div className="payment-info">
                <strong>Online Payment</strong>

                <span>Pay securely using online payment</span>
              </div>
            </label>
          </div>

          {/* ======================================
              ORDER SUMMARY
          ====================================== */}

          <div className="order-summary">
            <div>
              <span>Product</span>
              <strong>₹ {product.price}</strong>
            </div>

            <div>
              <span>Quantity</span>
              <strong>{quantity}</strong>
            </div>

            <div className="summary-total">
              <span>Total</span>

              <strong>₹ {total}</strong>
            </div>
          </div>

          {/* ======================================
              PLACE ORDER
          ====================================== */}

          <button
            type="submit"
            className="place-order-btn"
            disabled={placingOrder}
          >
            {placingOrder
              ? "Placing Order..."
              : paymentMethod === "ONLINE"
                ? `Pay ₹ ${total}`
                : "Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
