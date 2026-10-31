# StockPilot – Inventory Management System

StockPilot is a full-stack inventory management application designed to help users manage products, monitor stock levels, record stock movements, and identify items that need restocking.

## Features

- **Dashboard** – View inventory summaries, low-stock alerts, and recent activity.
- **Current Stock** – View the available products and their stock quantities.
- **Add Product** – Add products with a name, category, quantity, and reorder level.
- **Product Movement** – Record stock coming in (IN) or going out (OUT).
- **Low-Stock Alerts** – Identify products whose quantity is at or below their reorder level.
- **Login screen** – Includes a simple demo login flow.

## Tech Stack

### Frontend
- React
- Vite
- CSS
- Google Fonts – Jost

### Backend
- Python
- FastAPI
- SQLite

## Project Structure

```text
StockPilot/
├── backend/
│   ├── main.py
│   └── requirements.txt
└── frontend/
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx
        └── App.css
```

> The exact folder layout may differ depending on how the project is arranged locally.

## Prerequisites

Install the following before running the project:

- Python 3.9+
- Node.js and npm

## Setup and Run

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd StockPilot
```

### 2. Start the backend

Open a terminal in the backend folder:

```bash
cd backend
python -m pip install fastapi uvicorn
python -m uvicorn main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

FastAPI interactive API documentation is available at:

```text
http://127.0.0.1:8000/docs
```

### 3. Start the frontend

Open a second terminal in the frontend folder:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually:

```text
http://localhost:5173
```

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/products` | Retrieve products |
| POST | `/products` | Add a product |
| PUT | `/products/{id}` | Update a product |
| POST | `/movement` | Record stock IN/OUT |
| GET | `/alerts` | Retrieve low-stock alerts |
| GET | `/movements` | Retrieve movement history |

## Database

StockPilot uses SQLite. The database file (`stock.db`) is created by the backend when the application initializes. It stores product information and stock movement records.

## Demo Login

The current frontend demo login uses:

- **Username:** `admin`
- **Password:** `stock123`

This is a hardcoded demonstration login, not production-grade authentication. Change it before deploying the application publicly.

## Notes

- Make sure the backend is running before using frontend features that call the API.
- The frontend API base URL should point to `http://127.0.0.1:8000` during local development.
- Do not commit passwords, API keys, database files containing private data, or other secrets to GitHub.

## Future Improvements

- Secure authentication and role-based access.
- Product search, filtering, and pagination.
- Export inventory reports.
- Barcode scanning.
- Deployment with a hosted database.

## License

This project is available for educational and demonstration purposes. Add a license file if you intend to distribute it under a specific open-source license.
