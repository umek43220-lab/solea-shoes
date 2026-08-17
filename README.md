# SOLEA Shoes 👟

SOLEA is a modern full-stack shoe e-commerce website designed to provide a simple and stylish online shopping experience for men, women and kids.

## ✨ Features

* 🏠 Modern home page
* 👟 Shoe collections for Men, Women and Kids
* 🔍 Product search
* 🏷️ Category filtering
* ❤️ Wishlist functionality
* 🛒 Shopping cart
* ➕ Increase/decrease product quantity
* 📦 Product details with size selection
* 💳 Checkout page
* 🚚 Cash on Delivery
* ✅ Order confirmation
* 📱 Responsive and clean design
* 🗄️ Products and orders connected with MongoDB

## 🛠️ Technologies Used

### Frontend

* React
* Vite
* JavaScript
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* CORS
* dotenv

## 📂 Project Structure

```text
solea-shoes/
│
├── backend/
│   ├── index.js
│   ├── package.json
│   └── .env
│
├── public/
│
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── api.js
│   ├── index.css
│   └── main.jsx
│
├── package.json
├── vite.config.js
└── README.md
```

## 🚀 How to Run

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/solea-shoes.git
```

### 2. Open the project

```bash
cd solea-shoes
```

### 3. Install frontend dependencies

```bash
npm install
```

### 4. Start the frontend

```bash
npm run dev
```

The frontend will run on a local Vite port such as:

```text
http://localhost:5173/
```

### 5. Start the backend

Open another terminal:

```bash
cd backend
npm install
node index.js
```

The backend will run on:

```text
http://localhost:5000
```

## 🔗 API Endpoints

| Method | Endpoint            | Description          |
| ------ | ------------------- | -------------------- |
| GET    | `/api/products`     | Get all products     |
| GET    | `/api/products/:id` | Get a single product |
| POST   | `/api/products`     | Add a product        |
| PUT    | `/api/products/:id` | Update a product     |
| DELETE | `/api/products/:id` | Delete a product     |
| POST   | `/api/orders`       | Place an order       |

## 🗄️ Database

The project uses **MongoDB** to store product and order information.

Create a `.env` file inside the `backend` folder and add your MongoDB connection string:

```text
MONGO_URI=your_mongodb_connection_string
```

> Never upload your `.env` file or database credentials to GitHub.

## 🛍️ Main Shopping Flow

```text
Home
  ↓
Shop
  ↓
Select Product
  ↓
Select Size
  ↓
Add to Cart
  ↓
Checkout
  ↓
Enter Delivery Information
  ↓
Place Order
  ↓
Order Confirmation
```

## 👩‍💻 Author

**SOLEA Shoes — Full Stack Web Project**

Built as a React + Node.js + MongoDB e-commerce project.

## 📄 License

This project is created for educational and portfolio purposes.

