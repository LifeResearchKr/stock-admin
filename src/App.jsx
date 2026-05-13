import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [stocks, setStocks] = useState([]);

  const [selectedStock, setSelectedStock] = useState(null);
  const [keyword, setKeyword] = useState("");

  const [allStocks, setAllStocks] = useState([]);
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    fetch("/stocks.json")
      .then((res) => res.json())
      .then((data) => {
        setAllStocks(data);
      });
  }, []);

  useEffect(() => {
    const loadStocks = async () => {
      const querySnapshot = await getDocs(collection(db, "stocks"));

      const firebaseStocks = querySnapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }));

      if (firebaseStocks.length > 0) {
        setStocks(firebaseStocks);
        setSelectedStock(firebaseStocks[0]);
      }
    };

    loadStocks();
  }, []);

  const searchStock = (text) => {
    setKeyword(text);

    if (!text.trim()) {
      setSearchResult([]);
      return;
    }

    const filtered = allStocks.filter(
      (stock) =>
        stock.name.includes(text) ||
        stock.code.includes(text)
    );

    setSearchResult(filtered.slice(0, 5));
  };

  const addStock = async (stockFromSearch) => {
  const targetStock =
    stockFromSearch ||
    searchResult[0] || {
      name: keyword,
      code: Date.now().toString(),
      market: "미정",
    };

  if (!targetStock.name.trim()) return;

  const alreadyExists = stocks.some(
    (stock) => stock.code === targetStock.code
  );

  if (alreadyExists) {
    setKeyword("");
    setSearchResult([]);
    return;
  }

  const response = await fetch(
    `/api/stock-price?code=${targetStock.code}`
  );

  const stockData = await response.json();

  const newStock = {
    name: targetStock.name,
    code: targetStock.code,
    market: targetStock.market || "미정",

    price: stockData.price || 0,
    change: stockData.change || 0,
    volume: stockData.volume || 0,

    theme: "미정",
    rsi: 0,
    macd: "없음",
    volumeRate: 0,
    signal: "분석 전",
  };

  const docRef = await addDoc(collection(db, "stocks"), newStock);

  const savedStock = {
    ...newStock,
    id: docRef.id,
  };

  setStocks((prev) => [...prev, savedStock]);
  setSelectedStock(savedStock);
  setKeyword("");
  setSearchResult([]);
};

    const newStock = {
      name: targetStock.name,
      code: targetStock.code,
      market: targetStock.market || "미정",
      price: 0,
      change: 0,
      theme: "미정",
      rsi: 0,
      macd: "없음",
      volumeRate: 0,
      signal: "분석 전",
    };

    const docRef = await addDoc(collection(db, "stocks"), newStock);

    const savedStock = {
      ...newStock,
      id: docRef.id,
    };

    setStocks((prev) => [...prev, savedStock]);
    setSelectedStock(savedStock);
    setKeyword("");
    setSearchResult([]);
  };

  const removeStock = async (stock) => {
    if (stock.id) {
      await deleteDoc(doc(db, "stocks", stock.id));
    }

    const updatedStocks = stocks.filter(
      (item) => item.code !== stock.code
    );

    setStocks(updatedStocks);

    if (
      selectedStock?.code === stock.code &&
      updatedStocks.length > 0
    ) {
      setSelectedStock(updatedStocks[0]);
    }

    if (updatedStocks.length === 0) {
      setSelectedStock(null);
    }
  };

  return (
    <div className="app">
      <h1>나만의 주식 모니터링</h1>

      <div className="search-box">
        <input
          placeholder="종목명 또는 종목코드 입력"
          value={keyword}
          onChange={(e) => searchStock(e.target.value)}
        />

        <button onClick={() => addStock()}>
          추가
        </button>

        {searchResult.length > 0 && (
          <div className="search-result">
            {searchResult.map((stock) => (
              <div
                key={stock.code}
                className="search-item"
                onClick={() => addStock(stock)}
              >
                <strong>{stock.name}</strong>
                <span>
                  {stock.code} / {stock.market}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="layout">
        <div className="card">
          <h2>관심종목</h2>

          {stocks.map((stock) => (
            <div
              key={stock.id || stock.code}
              className={`stock-item ${
                selectedStock?.code === stock.code ? "active" : ""
              }`}
              onClick={() => setSelectedStock(stock)}
            >
              <div className="stock-header">
                <strong>{stock.name}</strong>

                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeStock(stock);
                  }}
                >
                  X
                </button>
              </div>

              <p>{stock.code}</p>
            </div>
          ))}
        </div>

        <div className="card detail-card">
          {selectedStock && (
            <>
              <h2>{selectedStock.name}</h2>

              <p>종목코드: {selectedStock.code}</p>

              <h1>
                {selectedStock.price.toLocaleString()}원
              </h1>

              <p
                className={
                  selectedStock.change >= 0 ? "up" : "down"
                }
              >
                {selectedStock.change > 0 ? "+" : ""}
                {selectedStock.change}%
              </p>

              <p>테마: {selectedStock.theme}</p>

              <div className="chart-box">
                <h3>차트 영역</h3>
                <p>나중에 실제 캔들차트</p>
              </div>

              <div className="indicator-box">
                <h3>보조지표</h3>

                <div className="indicator-row">
                  <span>RSI</span>
                  <strong>{selectedStock.rsi}</strong>
                </div>

                <div className="indicator-row">
                  <span>MACD</span>
                  <strong>{selectedStock.macd}</strong>
                </div>

                <div className="indicator-row">
                  <span>거래량</span>
                  <strong>{selectedStock.volumeRate}%</strong>
                </div>

                <div className="signal">
                  <span>판단</span>
                  <strong>{selectedStock.signal}</strong>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );


export default App;