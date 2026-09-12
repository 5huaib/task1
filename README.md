### ZuperMoney - Retailer Recharge History Module.

A full-stack application built for the ZuperMoney Developer Intern Take-Home Task. This application allows retailers to view, filter, paginate, and submit mobile recharge records.

🛠️ Tech Stack
Backend: Laravel 11, MySQL, Eloquent ORM
Frontend: React, Vite, Axios
Database: MySQL 8.x

🚀 Features
Server-Side Filtering: Filter recharge records dynamically by status, operator, retailer_id, and date range (from/to) directly via MySQL queries.
Server-Side Pagination: Paginated results (10 items per page) returning meta payload and total counts.
Mock Recharge Submission: Trigger new recharge entries with server-side validation (amount > 0, valid mobile number format, valid operator).
Graceful Error Handling: Handles empty filter states and invalid form submissions without crashing.


💻 Setup & Installation
Prerequisites
PHP 8.2+
Composer
Node.js (v18+) & NPM
MySQL Server

____________
1. Backend Setup (Laravel)
Navigate to the backend directory:
cd backend
Install PHP dependencies:
composer install
Create environment configuration file:
cp .env.example .env
Generate application key:
php artisan key:generate

___________________________
Configure your .env file with your local MySQL database credentials:
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=zupermoney_recharges
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
Run database migrations and seed fake recharge data:
php artisan migrate:fresh --seed
Start the Laravel development server:
php artisan serve
The backend API will run at http://127.0.0.1:8000.
_______________________
3. Frontend Setup (React + Vite)
Open a new terminal window and navigate to the frontend directory:
cd frontend
Install JavaScript dependencies:
npm install
Start the Vite development server:
npm run dev
The React application will run at http://localhost:5173.
📡 API Endpoints
1. Fetch Recharges (Filtered & Paginated)
Endpoint: GET /api/recharges
Query Parameters: retailer_id, status, operator, from, to, page
2. Create Recharge
Endpoint: POST /api/recharges
Payload:
{
"retailer_id": 1,
"mobile_number": "9876543210",
"operator": "Airtel",
"amount": 299,
"status": "success"
}



###### What I Would Do Differently With More Time
Given additional time, I would focus on enhancing security, performance, and developer experience:
Authentication & Authorization: Implement Laravel Sanctum/JWT authentication to ensure retailers can only view and create recharges associated with their authenticated session rather than submitting arbitrary retailer_id values.
Automated Testing: Write end-to-end unit and feature tests using PHPUnit/Pest for API endpoints and Vitest/React Testing Library for UI components.
Database Indexing & Optimization: Add composite database indexes on (retailer_id, status, created_at) to optimize query performance as the recharges table scales to millions of rows.
Real-Time Updates: Integrate WebSockets (Laravel Reverb / Pusher) to update pending recharge statuses live on the frontend grid without requiring manual refreshes.
Enhanced UX & Analytics: Add CSV/Excel export functionality for history logs and visual summary charts (total spent, success rate percentage) on the retailer dashboard.
