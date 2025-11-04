
import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import Ticker from './Ticker';
import AddSymbol from './AddSymbol';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

export default function App() {
  const [symbols, setSymbols] = useState(['AAPL','MSFT']);
  const [prices, setPrices] = useState({});
  const socketRef = useRef(null);

  useEffect(() => {
    const s = io(BACKEND);
    socketRef.current = s;
    s.on('connect', () => s.emit('subscribe', symbols));
    s.on('price_update', (items) => {
      setPrices(prev => {
        const next = { ...prev };
        for (const it of items) {
          const old = prev[it.symbol]?.price ?? null;
          next[it.symbol] = { price: it.price, prev: old };
        }
        return next;
      });
    });
    return () => s.disconnect();
  }, []);

  useEffect(() => { socketRef.current?.emit('subscribe', symbols); }, [symbols]);

  function addSymbol(sym) {
    const up = sym.toUpperCase();
    if (!symbols.includes(up)) setSymbols(s => [...s, up]);
    socketRef.current?.emit('add_symbol', up);
  }

  function removeSymbol(sym) {
    setSymbols(s => s.filter(x => x !== sym));
    socketRef.current?.emit('remove_symbol', sym);
  }

  return (
    <div className='app'>
      <h1>📈 Real-time Stock Ticker</h1>
      <AddSymbol onAdd={addSymbol}/>
      <div className='list'>
        {symbols.map(s =>
          <Ticker key={s} symbol={s} data={prices[s]} onRemove={()=>removeSymbol(s)}/>
        )}
      </div>
    </div>
  );
}
