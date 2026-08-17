
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  // =========================
  // PRODUCTS
  // =========================

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  // =========================
  // MAIN STATES
  // =========================

  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [detailQuantity, setDetailQuantity] = useState(1);
  const [page, setPage] = useState("home");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [notification, setNotification] = useState("");
  const [heroSlide, setHeroSlide] = useState(0);

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
  });

  // =========================
  // HERO SLIDES
  // =========================

  const heroSlides = [
    {
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=90",
      title: "Urban Runner",
      subtitle: "NEW DROP",
    },
    {
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=90",
      title: "Classic White",
      subtitle: "TIMELESS STYLE",
    },
    {
      image:
        "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=90",
      title: "Sport Flex",
      subtitle: "MOVE IN STYLE",
    },
  ];

  useEffect(() => {
    const slider = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 3000);

    return () => clearInterval(slider);
  }, []);

  // =========================
  // NOTIFICATION
  // =========================

  const showNotification = (message) => {
    setNotification(message);

    setTimeout(() => {
      setNotification("");
    }, 2000);
  };

  // =========================
  // CART
  // =========================

  const addToCart = (product, size = null, quantity = 1) => {
    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) => item.id === product.id && item.size === size
      );

      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id && item.size === size
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          size,
          quantity,
        },
      ];
    });

    showNotification(`${product.name} added to cart ✓`);
  };

  const increaseQuantity = (id, size) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id && item.size === size
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  const decreaseQuantity = (id, size) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id && item.size === size
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id, size) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => !(item.id === id && item.size === size)
      )
    );

    showNotification("Product removed from cart");
  };

  // =========================
  // WISHLIST
  // =========================

  const toggleWishlist = (product) => {
    const exists = wishlist.some(
      (item) => item.id === product.id
    );

    if (exists) {
      setWishlist((currentWishlist) =>
        currentWishlist.filter(
          (item) => item.id !== product.id
        )
      );

      showNotification(
        `${product.name} removed from wishlist`
      );
    } else {
      setWishlist((currentWishlist) => [
        ...currentWishlist,
        product,
      ]);

      showNotification(
        `${product.name} added to wishlist ♥`
      );
    }
  };

  const removeFromWishlist = (id) => {
    setWishlist((currentWishlist) =>
      currentWishlist.filter((item) => item.id !== id)
    );

    showNotification("Removed from wishlist");
  };

  // =========================
  // TOTALS
  // =========================

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  // =========================
  // CUSTOMER
  // =========================

  const handleCustomerChange = (e) => {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value,
    });
  };

 const placeOrder = async (e) => {
  e.preventDefault();

  if (
    !customer.name.trim() ||
    !customer.phone.trim() ||
    !customer.email.trim() ||
    !customer.address.trim() ||
    !customer.city.trim()
  ) {
    alert("Please fill all required fields.");
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  try {
    const orderData = {
      customer: customer,
      items: cart.map((item) => ({
        productId: item._id || item.id,
        name: item.name,
        category: item.category,
        price: item.price,
        image: item.image,
        size: item.size || null,
        quantity: item.quantity,
      })),
      total: subtotal,
      paymentMethod: "Cash on Delivery",
    };

    const response = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Order could not be placed.");
    }

    console.log("Order saved:", data);

    setOrderPlaced(true);
    setCart([]);
  } catch (error) {
    console.error("Order error:", error);
    alert("Order could not be placed. Please try again.");
  }
};

  // =========================
  // PRODUCT DETAILS
  // =========================

  const openProduct = (product) => {
    setSelectedProduct(product);
    setSelectedSize(null);
    setDetailQuantity(1);
    setPage("details");
  };

  // =========================
  // FILTER
  // =========================

  const filteredProducts = products.filter((product) => {
    const categoryMatch =
      category === "All" ||
      product.category === category;

    const searchMatch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return categoryMatch && searchMatch;
  });

  // =========================
  // NAVIGATION
  // =========================

  const openShop = (selectedCategory = "All") => {
    setCategory(selectedCategory);
    setSearch("");
    setPage("shop");
  };

  return (
    <div className="app">

      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="navbar">

        <button
          className="logo logo-button"
          onClick={() => setPage("home")}
        >
          SOLEA<span>.</span>
        </button>

        <div className="nav-links">

          <button onClick={() => setPage("home")}>
            Home
          </button>

          <button onClick={() => openShop("All")}>
            Shop
          </button>

          <button onClick={() => openShop("Men")}>
            Men
          </button>

          <button onClick={() => openShop("Women")}>
            Women
          </button>

          <button onClick={() => openShop("Kids")}>
            Kids
          </button>

          <button onClick={() => setPage("about")}>
            About
          </button>

          <button onClick={() => setPage("wishlist")}>
            Wishlist ♡
          </button>

        </div>

        <button
          className="cart-btn"
          onClick={() => setPage("cart")}
        >
          🛒 <span>{totalItems}</span>
        </button>

      </nav>

      {/* =========================
          NOTIFICATION
      ========================= */}

      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}

      {/* =========================
          HOME
      ========================= */}

      {page === "home" && (
        <>
          <section className="hero">

            <div className="hero-content">

              <p className="small-title">
                NEW COLLECTION 2026
              </p>

              <h1>
                STEP INTO
                <br />
                <em>YOUR STYLE</em>
              </h1>

              <p className="hero-text">
                Discover shoes designed for every step,
                every mood and every adventure.
              </p>

              <button
                className="shop-btn"
                onClick={() => openShop("All")}
              >
                SHOP COLLECTION →
              </button>

            </div>

            <div className="hero-image">

              <img
                src={heroSlides[heroSlide].image}
                alt={heroSlides[heroSlide].title}
              />

              <div className="image-label">
                <strong>
                  {heroSlides[heroSlide].subtitle}
                </strong>

                <span>
                  {heroSlides[heroSlide].title}
                </span>
              </div>

              <div className="slider-dots">

                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    className={
                      heroSlide === index
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setHeroSlide(index)
                    }
                    aria-label={`Slide ${index + 1}`}
                  />
                ))}

              </div>

            </div>

          </section>

          {/* CATEGORIES */}

          <section className="categories">

            <div className="section-heading">
              <p>SHOP BY CATEGORY</p>
              <h2>Find Your Perfect Pair</h2>
            </div>

            <div className="category-grid">

              <div
                className="category-card"
                onClick={() => openShop("Men")}
              >

                <img
                  src="https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=700&q=85"
                  alt="Men shoes"
                />

                <div className="category-info">
                  <h3>MEN</h3>
                  <p>Explore Collection →</p>
                </div>

              </div>

              <div
                className="category-card"
                onClick={() => openShop("Women")}
              >

                <img
                  src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=700&q=85"
                  alt="Women shoes"
                />

                <div className="category-info">
                  <h3>WOMEN</h3>
                  <p>Explore Collection →</p>
                </div>

              </div>

              <div
                className="category-card"
                onClick={() => openShop("Kids")}
              >

                <img
                  src="https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=700&q=85"
                  alt="Kids shoes"
                />

                <div className="category-info">
                  <h3>KIDS</h3>
                  <p>Explore Collection →</p>
                </div>

              </div>

            </div>

          </section>

          {/* FEATURES */}

          <section className="feature-strip">

            <div>
              <span>✦</span>
              <h3>FREE SHIPPING</h3>
              <p>On orders over Rs. 5,000</p>
            </div>

            <div>
              <span>↻</span>
              <h3>EASY RETURNS</h3>
              <p>7 days return policy</p>
            </div>

            <div>
              <span>✓</span>
              <h3>QUALITY FIRST</h3>
              <p>Premium footwear</p>
            </div>

          </section>
        </>
      )}

      {/* =========================
          SHOP
      ========================= */}

      {page === "shop" && (
        <section className="shop-page">

          <div className="shop-header">

            <div>

              <p className="small-title">
                SOLEA COLLECTION
              </p>

              <h1>
                Find Your
                <em> Perfect Pair</em>
              </h1>

            </div>

            <p className="shop-description">
              Explore stylish and comfortable footwear
              for men, women and kids.
            </p>

          </div>

          <div className="shop-controls">

            <input
              type="text"
              placeholder="Search shoes..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            <div className="filters">

              {["All", "Men", "Women", "Kids"].map(
                (item) => (
                  <button
                    key={item}
                    className={
                      category === item
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setCategory(item)
                    }
                  >
                    {item}
                  </button>
                )
              )}

            </div>

          </div>

          <div className="shop-grid">

            {filteredProducts.length === 0 ? (

              <div className="no-products">
                <h2>No shoes found</h2>
                <p>
                  Try another search or category.
                </p>
              </div>

            ) : (

              filteredProducts.map((product) => {

                const isLiked = wishlist.some(
                  (item) =>
                    item.id === product.id
                );

                return (
                  <div
                    className="shop-product-card"
                    key={product.id}
                    onClick={() =>
                      openProduct(product)
                    }
                  >

                    <div className="shop-product-image">

                      <button
                        className={
                          isLiked
                            ? "heart liked"
                            : "heart"
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product);
                        }}
                      >
                        {isLiked ? "♥" : "♡"}
                      </button>

                      <img
  src={`${product.image}?auto=format&fit=crop&w=800&q=90`}
  alt={product.name}
/>

                    </div>

                    <p className="product-category">
                      {product.category}
                    </p>

                    <h3>{product.name}</h3>

                    <div className="product-bottom">

                      <strong>
                        Rs.{" "}
                        {product.price.toLocaleString()}
                      </strong>

                      <button
                        className="add-cart"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                      >
                        Add +
                      </button>

                    </div>

                  </div>
                );
              })
            )}

          </div>

        </section>
      )}

      {/* =========================
          WISHLIST
      ========================= */}

      {page === "wishlist" && (
        <section className="shop-page">

          <div className="shop-header">

            <div>

              <p className="small-title">
                YOUR FAVORITES
              </p>

              <h1>
                My <em>Wishlist</em>
              </h1>

            </div>

            <p className="shop-description">
              Your favorite shoes are saved here.
            </p>

          </div>

          {wishlist.length === 0 ? (

            <div className="empty-cart">

              <div className="empty-icon">
                ♡
              </div>

              <h2>
                Your wishlist is empty
              </h2>

              <p>
                Click the heart on any shoe to save
                it here.
              </p>

              <button
                className="shop-btn"
                onClick={() => openShop("All")}
              >
                EXPLORE SHOES
              </button>

            </div>

          ) : (

            <div className="shop-grid">

              {wishlist.map((product) => (

                <div
                  className="shop-product-card"
                  key={product.id}
                  onClick={() =>
                    openProduct(product)
                  }
                >

                  <div className="shop-product-image">

                    <button
                      className="heart liked"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromWishlist(
                          product.id
                        );
                      }}
                    >
                      ♥
                    </button>

                    <img
                      src={product.image}
                      alt={product.name}
                    />

                  </div>

                  <p className="product-category">
                    {product.category}
                  </p>

                  <h3>{product.name}</h3>

                  <div className="product-bottom">

                    <strong>
                      Rs.{" "}
                      {product.price.toLocaleString()}
                    </strong>

                    <button
                      className="add-cart"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                    >
                      Add +
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>
      )}

      {/* =========================
          PRODUCT DETAILS
      ========================= */}

      {page === "details" && selectedProduct && (
        <section className="product-details-page">

          <button
            className="back-btn"
            onClick={() => setPage("shop")}
          >
            ← Back to Shop
          </button>

          <div className="product-details">

            <div className="details-image">

              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
              />

            </div>

            <div className="details-info">

              <p className="product-category">
                {selectedProduct.category}
              </p>

              <h1>
                {selectedProduct.name}
              </h1>

              <h2>
                Rs.{" "}
                {selectedProduct.price.toLocaleString()}
              </h2>

              <p className="details-description">
                Step into comfort and style with the{" "}
                {selectedProduct.name}. Designed for
                everyday wear with comfort, quality
                and modern style.
              </p>

              <h3>Select Size</h3>

              <div className="size-options">

                {[36, 37, 38, 39, 40, 41, 42].map(
                  (size) => (
                    <button
                      key={size}
                      className={
                        selectedSize === size
                          ? "selected-size"
                          : ""
                      }
                      onClick={() =>
                        setSelectedSize(size)
                      }
                    >
                      {size}
                    </button>
                  )
                )}

              </div>

              <div className="detail-quantity">

                <h3>Quantity</h3>

                <div className="quantity-box">

                  <button
                    onClick={() =>
                      setDetailQuantity(
                        Math.max(
                          1,
                          detailQuantity - 1
                        )
                      )
                    }
                  >
                    −
                  </button>

                  <span>
                    {detailQuantity}
                  </span>

                  <button
                    onClick={() =>
                      setDetailQuantity(
                        detailQuantity + 1
                      )
                    }
                  >
                    +
                  </button>

                </div>

              </div>

              <button
                className="details-cart-btn"
                onClick={() => {

                  if (!selectedSize) {
                    alert(
                      "Please select a shoe size."
                    );
                    return;
                  }

                  addToCart(
                    selectedProduct,
                    selectedSize,
                    detailQuantity
                  );

                  setDetailQuantity(1);
                  setSelectedSize(null);
                  setPage("cart");

                }}
              >
                ADD TO CART →
              </button>

            </div>

          </div>

        </section>
      )}

      {/* =========================
          CART
      ========================= */}

      {page === "cart" && (
        <section className="cart-page">

          <div className="cart-heading">

            <div>

              <p className="small-title">
                YOUR SHOPPING BAG
              </p>

              <h1>
                Shopping <em>Cart</em>
              </h1>

            </div>

            <button
              className="continue-btn"
              onClick={() => setPage("shop")}
            >
              ← Continue Shopping
            </button>

          </div>

          {cart.length === 0 ? (

            <div className="empty-cart">

              <div className="empty-icon">
                🛒
              </div>

              <h2>
                Your cart is empty
              </h2>

              <p>
                Add some beautiful shoes to your
                cart.
              </p>

              <button
                className="shop-btn"
                onClick={() => setPage("shop")}
              >
                START SHOPPING
              </button>

            </div>

          ) : (

            <div className="cart-layout">

              <div className="cart-items">

                {cart.map((item) => (

                  <div
                    className="cart-item"
                    key={`${item.id}-${item.size}`}
                  >

                    <img
                      src={item.image}
                      alt={item.name}
                    />

                    <div className="cart-item-info">

                      <p className="product-category">
                        {item.category}
                      </p>

                      <h3>
                        {item.name}
                      </h3>

                      {item.size && (
                        <p className="cart-size">
                          Size:{" "}
                          <strong>
                            {item.size}
                          </strong>
                        </p>
                      )}

                      <strong>
                        Rs.{" "}
                        {item.price.toLocaleString()}
                      </strong>

                      <div className="quantity">

                        <button
                          onClick={() =>
                            decreaseQuantity(
                              item.id,
                              item.size
                            )
                          }
                        >
                          −
                        </button>

                        <span>
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            increaseQuantity(
                              item.id,
                              item.size
                            )
                          }
                        >
                          +
                        </button>

                      </div>

                    </div>

                    <button
                      className="remove-btn"
                      onClick={() =>
                        removeFromCart(
                          item.id,
                          item.size
                        )
                      }
                    >
                      Remove
                    </button>

                  </div>

                ))}

              </div>

              <div className="order-summary">

                <h2>
                  Order Summary
                </h2>

                <div className="summary-line">
                  <span>Items</span>
                  <span>{totalItems}</span>
                </div>

                <div className="summary-line">
                  <span>Subtotal</span>
                  <span>
                    Rs.{" "}
                    {subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="summary-line">
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>

                <hr />

                <div className="summary-total">

                  <span>Total</span>

                  <strong>
                    Rs.{" "}
                    {subtotal.toLocaleString()}
                  </strong>

                </div>

                <button
                  className="checkout-btn"
                  onClick={() =>
                    setPage("checkout")
                  }
                >
                  PROCEED TO CHECKOUT →
                </button>

              </div>

            </div>

          )}

        </section>
      )}

      {/* =========================
          CHECKOUT
      ========================= */}

      {page === "checkout" && !orderPlaced && (
        <section className="checkout-page">

          <div className="checkout-heading">

            <p className="small-title">
              SECURE CHECKOUT
            </p>

            <h1>
              Complete Your <em>Order</em>
            </h1>

          </div>

          <div className="checkout-layout">

            <form
              className="customer-form"
              onSubmit={placeOrder}
            >

              <h2>
                Delivery Information
              </h2>

              <div className="form-row">

                <div className="form-group">

                  <label>
                    Full Name *
                  </label>

                  <input
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    value={customer.name}
                    onChange={
                      handleCustomerChange
                    }
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Phone Number *
                  </label>

                  <input
                    name="phone"
                    type="tel"
                    placeholder="03XX XXXXXXX"
                    value={customer.phone}
                    onChange={
                      handleCustomerChange
                    }
                    required
                  />

                </div>

              </div>

              <div className="form-group">

                <label>
                  Email Address *
                </label>

                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={customer.email}
                  onChange={
                    handleCustomerChange
                  }
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Delivery Address *
                </label>

                <textarea
                  name="address"
                  placeholder="Enter your complete address"
                  value={customer.address}
                  onChange={
                    handleCustomerChange
                  }
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  City *
                </label>

                <input
                  name="city"
                  type="text"
                  placeholder="Enter your city"
                  value={customer.city}
                  onChange={
                    handleCustomerChange
                  }
                  required
                />

              </div>

              <h2 className="payment-title">
                Payment Method
              </h2>

              <div className="payment-option">

                <input
                  type="radio"
                  checked
                  readOnly
                />

                <div>

                  <strong>
                    Cash on Delivery
                  </strong>

                  <p>
                    Pay when your order arrives.
                  </p>

                </div>

              </div>

              <button
                className="place-order-btn"
                type="submit"
              >
                PLACE ORDER →
              </button>

            </form>

            <div className="checkout-summary">

              <h2>Your Order</h2>

              {cart.map((item) => (

                <div
                  className="checkout-item"
                  key={`${item.id}-${item.size}`}
                >

                  <img
                    src={item.image}
                    alt={item.name}
                  />

                  <div>

                    <h3>
                      {item.name}
                    </h3>

                    {item.size && (
                      <p>
                        Size: {item.size}
                      </p>
                    )}

                    <p>
                      Qty: {item.quantity}
                    </p>

                    <strong>
                      Rs.{" "}
                      {(
                        item.price *
                        item.quantity
                      ).toLocaleString()}
                    </strong>

                  </div>

                </div>

              ))}

              <hr />

              <div className="summary-total">

                <span>Total</span>

                <strong>
                  Rs.{" "}
                  {subtotal.toLocaleString()}
                </strong>

              </div>

            </div>

          </div>

        </section>
      )}

      {/* =========================
          SUCCESS
      ========================= */}

      {orderPlaced && (
        <section className="success-page">

          <div className="success-card">

            <div className="success-icon">
              ✓
            </div>

            <p className="small-title">
              ORDER CONFIRMED
            </p>

            <h1>
              Thank You!
            </h1>

            <p>
              Your order has been placed
              successfully.
            </p>

            <p>
              We'll contact you soon for
              delivery.
            </p>

            <button
              className="shop-btn"
              onClick={() => {
                setOrderPlaced(false);
                setCategory("All");
                setSearch("");
                setPage("shop");
              }}
            >
              CONTINUE SHOPPING
            </button>

          </div>

        </section>
      )}

      {/* =========================
          ABOUT
      ========================= */}

      {page === "about" && (
        <section className="about-page">

          <div className="about-hero">

            <div>

              <p className="small-title">
                ABOUT SOLEA
              </p>

              <h1>
                Shoes that tell
                <em> your story.</em>
              </h1>

              <p>
                SOLEA is a modern footwear brand
                created for people who believe every
                step should feel confident,
                comfortable and stylish.
              </p>

            </div>

            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=90"
              alt="Shoe collection"
            />

          </div>

          <div className="about-values">

            <div>
              <span>01</span>
              <h2>Quality</h2>
              <p>
                We focus on comfortable materials
                and carefully selected footwear.
              </p>
            </div>

            <div>
              <span>02</span>
              <h2>Style</h2>
              <p>
                From everyday sneakers to statement
                shoes, there is something for every
                style.
              </p>
            </div>

            <div>
              <span>03</span>
              <h2>Comfort</h2>
              <p>
                Because great shoes should look good
                and feel good too.
              </p>
            </div>

          </div>

          {/* CONTACT */}

          <div className="contact-section">

            <div className="contact-info">

              <p className="small-title">
                GET IN TOUCH
              </p>

              <h2>
                We'd love to
                <em> hear from you.</em>
              </h2>

              <p>
                Have a question about an order or
                product? Send us a message and our
                team will get back to you.
              </p>

              <div className="contact-details">

                <div>
                  <strong>Email</strong>
                  <p>
                    hello@solea.com
                  </p>
                </div>

                <div>
                  <strong>Phone</strong>
                  <p>
                    +92 300 1234567
                  </p>
                </div>

                <div>
                  <strong>Hours</strong>
                  <p>
                    Mon – Sat, 10 AM – 7 PM
                  </p>
                </div>

              </div>

            </div>

            <form
              className="contact-form"
              onSubmit={(e) => {
                e.preventDefault();
                setContactSent(true);
              }}
            >

              <input
                type="text"
                placeholder="Your Name"
                required
              />

              <input
                type="email"
                placeholder="Your Email"
                required
              />

              <input
                type="text"
                placeholder="Subject"
                required
              />

              <textarea
                placeholder="Your Message"
                required
              />

              <button type="submit">
                SEND MESSAGE →
              </button>

              {contactSent && (
                <p className="contact-success">
                  ✓ Your message has been sent!
                </p>
              )}

            </form>

          </div>

        </section>
      )}

      {/* =========================
          FOOTER
      ========================= */}

      <footer>

        <div className="footer-logo">
          SOLEA<span>.</span>
        </div>

        <p>
          Walk your way. Wear your story.
        </p>

        <div className="footer-links">

          <button
            onClick={() => setPage("home")}
          >
            Home
          </button>

          <button
            onClick={() => openShop("All")}
          >
            Shop
          </button>

          <button
            onClick={() =>
              setPage("wishlist")
            }
          >
            Wishlist ♡
          </button>

          <button
            onClick={() => setPage("about")}
          >
            About
          </button>

        </div>

        <div className="copyright">
          © 2026 SOLEA. All rights reserved.
        </div>

      </footer>

    </div>
  );
}

export default App;

