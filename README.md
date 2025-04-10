# Stock Suggester 

A modern React application for tracking stock market data with interactive charts, news integration, and support for both US and Indian markets.

## Features 

- **Real-time Stock Data**: View current prices, market caps, and performance metrics
- **Interactive Charts**: Expandable charts with 1D, 1W, 1M, 1Y, and Max time periods
- **Multi-Currency Support**: 
 - ₹ INR for Indian stocks (ending with .NS)
 - $ USD for international stocks
- **Dark/Light Mode**: Toggle between color themes
- **Stock News**: Latest news articles related to searched stocks
- **Responsive Design**: Works on desktop and mobile devices

## Technologies Used 

### Frontend
- React.js
- Framer Motion (animations)
- Chart.js (interactive charts)
- Axios (API calls)
- CSS Modules (styling)

### Backend
- FastAPI (Python)
- yfinance (stock data)
- NewsAPI (stock news)

## Installation 

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- npm/yarn

### Backend Setup
1. Navigate to backend directory:
  ```bash
  cd backend
  ```

2. Install Python dependencies:
  ```bash
  pip install -r requirements.txt
  ```

3. Start FastAPI server:
  ```bash
  uvicorn main:app --reload
  ```

### Frontend Setup
1. Navigate to frontend directory:
  ```bash
  cd frontend
  ```

2. Install dependencies:
  ```bash
  npm install
  ```

3. Start development server:
  ```bash
  npm start
  ```

## Configuration 
Create a `.env` file in the backend directory with your NewsAPI key:
```bash
NEWS_API_KEY=your_newsapi_key_here
```

## Project Structure 
```bash
stock-suggester/
├── backend/               
│   ├── main.py            
│   └── requirements.txt   
│   └── .env               
│
├── frontend/              
│   ├── public/
│   ├── src/
│   │   ├── components/    
│   │   ├── App.js         
│   │   └── ...            
│   └── package.json
│
└── README.md
```

## Usage Guide 
1. **Search Stocks**: Enter a ticker symbol (e.g., `TSLA` or `RELIANCE.NS`)
2. **View Details**: Click on any stock card to see expanded information
3. **Chart Controls**:
  * Click "View Full Chart" to expand
  * Use period buttons (1D, 1W, etc.) to change time range
  * 1D view shows intraday hourly data
4. **Toggle Theme**: Use the moon/sun icon in header
