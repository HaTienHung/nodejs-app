# 📚 BOOK_STORE API

A complete backend system for managing an online bookstore using **Node.js**, **Express**, and **MongoDB**, with real-time notifications via **Redis**, and data caching to boost performance.

---

## 🚀 Features

### 🔐 Authentication

- JWT-based Auth
- User registration & login

### 🛒 Shopping

- Add to cart
- Update/remove cart items
- Checkout & place orders

### 📦 Order Management

- Place order
- View user orders
- Cancel order with inventory rollback
- Admin can view/manage all orders

### 📚 Book & Inventory Management

- CRUD for books
- Track import/export transactions
- Real-time stock update
- View inventory logs

### 🏢 Publisher Management

- CRUD for publishers
- Assign books to publishers

### 🔔 Real-time Notifications

- Redis Pub/Sub for sending notifications to users (e.g., order status)
- Socket.IO for client push
- Notifications stored in MongoDB

### ⚡ Performance

- Redis-based data caching (e.g., book detail, category list)
- Cache invalidation on update/delete

---

## 🛠️ Tech Stack

| Tech       | Description                      |
| ---------- | -------------------------------- |
| Node.js    | Backend runtime                  |
| Express.js | Web framework                    |
| MongoDB    | NoSQL database                   |
| Mongoose   | MongoDB ODM                      |
| JWT        | Authentication                   |
| Redis      | Caching & real-time messaging    |
| Socket.IO  | Real-time communication          |
| Multer     | File upload                      |
| Cloudinary | (Optional) Image hosting service |

---

## 📂 Project Structure
