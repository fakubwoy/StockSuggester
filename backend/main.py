from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import yfinance as yf
import requests
from datetime import datetime
import os
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

NEWS_API_KEY = os.getenv("NEWS_API_KEY")

@app.get("/hot-stocks")
async def get_hot_stocks():
    hot_stocks = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "RELIANCE.NS", "TCS.NS", "HDFCBANK.NS"]
    stock_data = []
    for ticker in hot_stocks:
        stock = yf.Ticker(ticker)
        info = stock.info
        hist = stock.history(period="7d")
        
        is_indian_stock = ticker.endswith('.NS')
        
        stock_data.append({
            "info": {
                "symbol": ticker,
                "shortName": info.get("shortName", ticker),
                "currentPrice": info.get("currentPrice"),
                "currency": info.get("currency", "USD"),
                "changePercent": info.get("regularMarketChangePercent"),
                "marketCap": info.get("marketCap"),
                "sector": info.get("sector"),
                "industry": info.get("industry"),
                "website": info.get("website"),
                "fullTimeEmployees": info.get("fullTimeEmployees"),
                "isIndianStock": is_indian_stock
            },
            "quote": {
                "symbol": ticker,
                "price": info.get("currentPrice"),
                "change": info.get("regularMarketChange"),
                "changePercent": info.get("regularMarketChangePercent"),
                "currency": info.get("currency", "USD")
            },
            "chart": {
                "dates": hist.index.strftime('%Y-%m-%d').tolist(),
                "prices": hist['Close'].tolist()
            }
        })
    return stock_data

@app.get("/stock-news/{ticker}")
async def get_stock_news(ticker: str):
    url = f"https://newsapi.org/v2/everything?q={ticker}&sortBy=publishedAt&apiKey={NEWS_API_KEY}"
    response = requests.get(url)
    articles = response.json().get("articles", [])
    
    formatted_articles = []
    for article in articles[:5]:
        formatted_articles.append({
            "title": article.get("title", "No title"),
            "link": article.get("url", "#"),
            "source": article.get("source", {}).get("name", "Unknown"),
            "publishedAt": article.get("publishedAt", "")
        })
    
    return formatted_articles
@app.get("/stock-history/{ticker}")
async def get_stock_history(ticker: str, period: str = "1mo"):
    try:
        stock = yf.Ticker(ticker)
        
        interval = "1h" if period == "1d" else "1d"
        hist = stock.history(period=period, interval=interval)
        
        if hist.empty:
            return JSONResponse(status_code=404, content={"message": "No historical data found"})
        
        if period == "1d":
            dates = hist.index.strftime('%H:%M').tolist()  # Show hours:minutes
        else:
            dates = hist.index.strftime('%Y-%m-%d').tolist()
        
        return {
            "dates": dates,
            "prices": hist['Close'].tolist(),
            "period": period,
            "isIntraday": period == "1d"
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": f"Error fetching history: {str(e)}"})
    
@app.get("/search-stock/{query}")
def search_stock(query: str):
    try:
        stock = yf.Ticker(query)
        info = stock.info
        hist = stock.history(period="5d")
        
        if hist.empty:
            return JSONResponse(status_code=404, content={"message": "Stock not found"})
        
        is_indian_stock = query.endswith('.NS')
        
        return {
            "info": {
                "symbol": query,
                "shortName": info.get("shortName", query),
                "currentPrice": info.get("currentPrice"),
                "regularMarketPrice": info.get("regularMarketPrice"),
                "currency": info.get("currency", "USD"),
                "changePercent": info.get("regularMarketChangePercent"),
                "marketCap": info.get("marketCap"),
                "sector": info.get("sector"),
                "industry": info.get("industry"),
                "website": info.get("website"),
                "fullTimeEmployees": info.get("fullTimeEmployees"),
                "longBusinessSummary": info.get("longBusinessSummary"),
                "isIndianStock": is_indian_stock  
            },
            "quote": {
                "symbol": query,
                "price": info.get("currentPrice"),
                "change": info.get("regularMarketChange"),
                "changePercent": info.get("regularMarketChangePercent"),
                "currency": info.get("currency", "USD")
            },
            "chart": {
                "dates": hist.index.strftime('%Y-%m-%d').tolist(),
                "prices": hist['Close'].tolist()
            }
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": f"Internal Server Error: {str(e)}"})