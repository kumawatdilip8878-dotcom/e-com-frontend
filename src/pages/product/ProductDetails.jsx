import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ProductDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const product = location.state?.product;

  const API_URL = "http://localhost:3001";

  console.log("Product Details Data:", product);

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

  // PRODUCT NOT FOUND
  //

  if (!product) {
    return (
      <div className="product-not-found">
        <div className="not-found-card">
          <div className="not-found-icon">🛒</div>

          <h2>Product Not Found</h2>

          <p>
            Product data nahi mila. Please cart se product dobara open karein.
          </p>

          <button className="back-cart-btn" onClick={() => navigate("/cart")}>
            ← Back To Cart
          </button>
        </div>
      </div>
    );
  }

  // BUY NOW

  const buyNow = () => {
    navigate("/checkout", {
      state: {
        product: product,
        quantity: 1,
      },
    });
  };

  // MAIN

  return (
    <div className="product-details-page">
      {/* BACK BUTTON */}

      <button className="product-back-btn" onClick={() => navigate("/cart")}>
        ← Back To Cart
      </button>

      {/* /          PRODUCT CARD */}

      <div className="product-details-card">
        {/* IMAGE SECTION */}

        <div className="product-image-section">
          <div className="main-product-image">
            {product.images && product.images.length > 0 ? (
              <img
                src={getImageUrl(product.images[0])}
                alt={product.name}
                onError={(e) => {
                  console.log("Image URL:", getImageUrl(product.images[0]));

                  e.target.style.display = "none";
                }}
              />
            ) : (
              <div className="no-product-image">
                <span>🖼️</span>
                <p>No Image Available</p>
              </div>
            )}
          </div>

        
        </div>


        <div className="product-details-content">
          {/* PRODUCT LABEL */}

          <span className="product-label">PRODUCT</span>

          {/* PRODUCT NAME */}

          <h1 className="product-title">{product.name}</h1>

          {/* RATING */}

          <div className="product-rating">
            <span>★★★★★</span>

            <span className="rating-text">4.8</span>
          </div>

          <div className="product-price-box">
            <span className="product-price">₹ {product.price}</span>
          </div>

          <div className="product-description">
            <h3>Description</h3>

            <p>
              {product.description ||
                "No description available for this product."}
            </p>
          </div>

          <div className="product-info">
            <div className="info-row">
              <span className="info-label">Stock</span>

              <span className="info-value">{product.stock}</span>
            </div>

            <div className="info-row">
              <span className="info-label">Status</span>

              <span
                className={
                  product.status === "Y"
                    ? "status-available"
                    : "status-unavailable"
                }
              >
                {product.status === "Y" ? "Available" : "Unavailable"}
              </span>
            </div>
          </div>

          <button
            className="buy-now-btn"
            onClick={buyNow}
            disabled={Number(product.stock) <= 0 || product.status !== "Y"}
          >
            {Number(product.stock) > 0 && product.status === "Y"
              ? "Buy Now"
              : "Out Of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
