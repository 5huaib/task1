# 💰 ZuperMoney — Retailer Recharge History Module

A full-stack web application developed as part of the **ZuperMoney Developer Intern Take-Home Task**.

The application allows retailers to **view, filter, paginate, and submit mobile recharge records** through a React-based frontend and Laravel REST API.

---

## 🛠️ Tech Stack

### Backend

* **Laravel 11**
* **PHP 8.2+**
* **MySQL 8.x**
* **Eloquent ORM**
* RESTful API

### Frontend

* **React**
* **Vite**
* **Axios**
* JavaScript

### Database

* **MySQL 8.x**

---

## ✨ Features

### 🔍 Server-Side Filtering

Recharge records can be dynamically filtered directly through MySQL queries using:

* Retailer ID
* Recharge status
* Mobile operator
* Date range (`from` / `to`)

### 📄 Server-Side Pagination

* 10 recharge records per page
* Pagination handled by the Laravel backend
* Returns pagination metadata and total record count

### 📱 Mock Recharge Submission

Create new recharge records through the API with server-side validation.

Validation includes:

* Amount must be greater than `0`
* Mobile number must follow a valid format
* Operator must be valid
* Required fields must be provided

### ⚠️ Graceful Error Handling

The application handles:

* Empty filter results
* Invalid form submissions
* Invalid API requests
* Validation errors

without crashing the application.

---

# 📂 Project Structure

```text
zupermoney-recharges/
│
├── backend/
│   ├── app/
│   ├── database/
│   ├── routes/
│   ├── .env.example
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
└── README.md
```

---

# 🚀 Setup & Installation

## Prerequisites

Make sure the following are installed on your system:

* PHP **8.2+**
* Composer
* Node.js **18+**
* NPM
* MySQL Server **8.x**

---

# 1️⃣ Backend Setup — Laravel

Navigate to the backend directory:

```bash
cd backend
```

### Install PHP Dependencies

```bash
composer install
```

### Create Environment File

```bash
cp .env.example .env
```

### Generate Application Key

```bash
php artisan key:generate
```

---

## 🗄️ Configure MySQL Database

Create a MySQL database:

```sql
CREATE DATABASE zupermoney_recharges;
```

Then configure your `.env` file:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=zupermoney_recharges
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
```

Replace:

```text
your_mysql_password
```

with your local MySQL password.

---

## 🌱 Run Migrations & Seed Data

Run:

```bash
php artisan migrate:fresh --seed
```

This will:

* Create the required database tables
* Run all migrations
* Insert fake recharge records for testing

---

## ▶️ Start Laravel Server

```bash
php artisan serve
```

The backend API will be available at:

```text
http://127.0.0.1:8000
```

---

# 2️⃣ Frontend Setup — React + Vite

Open a **new terminal window** and navigate to the frontend directory:

```bash
cd frontend
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

The React application will be available at:

```text
http://localhost:5173
```

---

# 📡 API Endpoints

## 1. Fetch Recharge History

### `GET /api/recharges`

Fetch recharge records with optional filtering and pagination.

### Query Parameters

| Parameter     | Description               | Example      |
| ------------- | ------------------------- | ------------ |
| `retailer_id` | Filter by retailer        | `1`          |
| `status`      | Filter by recharge status | `success`    |
| `operator`    | Filter by mobile operator | `Airtel`     |
| `from`        | Starting date             | `2026-01-01` |
| `to`          | Ending date               | `2026-01-31` |
| `page`        | Page number               | `2`          |

### Example Request

```http
GET /api/recharges?retailer_id=1&status=success&operator=Airtel&page=1
```

---

## 2. Create Recharge

### `POST /api/recharges`

Creates a new recharge record.

### Request Payload

```json
{
  "retailer_id": 1,
  "mobile_number": "9876543210",
  "operator": "Airtel",
  "amount": 299,
  "status": "success"
}
```

### Example cURL Request

```bash
curl -X POST http://127.0.0.1:8000/api/recharges \
-H "Content-Type: application/json" \
-d '{
  "retailer_id": 1,
  "mobile_number": "9876543210",
  "operator": "Airtel",
  "amount": 299,
  "status": "success"
}'
```

---

# 🧪 Testing the Application

After starting both servers:

### Backend

```text
http://127.0.0.1:8000
```

### Frontend

```text
http://localhost:5173
```

Open the frontend URL in your browser to:

1. View recharge history
2. Filter recharge records
3. Navigate between pages
4. Submit a new recharge
5. Test validation and error handling

---

# 🔮 What I Would Do Differently With More Time

Given additional development time, I would focus on improving **security, performance, testing, and user experience**.

### 🔐 Authentication & Authorization

Implement **Laravel Sanctum or JWT authentication** so that:

* Retailers authenticate securely
* Retailers can only access their own recharge history
* `retailer_id` cannot be arbitrarily submitted by users
* API endpoints can be protected with authorization middleware

---

### 🧪 Automated Testing

Add comprehensive automated tests including:

**Backend**

* PHPUnit / Pest
* Laravel Feature Tests
* API validation tests
* Database tests

**Frontend**

* Vitest
* React Testing Library
* Component tests
* API interaction tests

---

### ⚡ Database Indexing & Optimization

As the recharge table grows to millions of records, I would introduce optimized indexes, particularly around frequently queried columns such as:

```text
retailer_id
status
operator
created_at
```

A composite index could also be evaluated based on actual query patterns:

```text
(retailer_id, status, created_at)
```

---

### 🔄 Real-Time Recharge Updates

Integrate **Laravel Reverb or Pusher** with WebSockets to provide real-time updates.

For example:

```text
Pending → Success
```

The frontend could automatically update the recharge status without requiring the retailer to refresh the page.

---

### 📊 Enhanced UX & Analytics

Add a retailer dashboard containing:

* Total recharge amount
* Total successful recharges
* Failed recharge count
* Success-rate percentage
* Recharge trends over time
* Interactive charts

---

### 📥 Export Functionality

Allow retailers to export their recharge history as:

* CSV
* Excel
* PDF

with the currently applied filters.

---

# 📌 Future Improvements

| Area             | Planned Improvement                    |
| ---------------- | -------------------------------------- |
| 🔐 Security      | Authentication & authorization         |
| 🧪 Testing       | PHPUnit/Pest + Vitest                  |
| ⚡ Performance    | Database indexing & query optimization |
| 🔄 Real-Time     | Laravel Reverb / Pusher                |
| 📊 Analytics     | Dashboard & charts                     |
| 📥 Export        | CSV / Excel / PDF                      |
| 🛡️ API          | Rate limiting & stronger validation    |
| 📝 Documentation | OpenAPI / Swagger documentation        |

---

# 👨‍💻 Author

Developed as part of the **ZuperMoney Developer Intern Take-Home Task**.

---

## ⭐ If you found this project useful

Feel free to **star ⭐ the repository** and explore the code to learn more about building a full-stack application using **Laravel, React, MySQL, and REST APIs**.
