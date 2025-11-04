
import React from 'react';
export default function Ticker({ symbol, data={}, onRemove }) {
  const price = data.price ?? '—';
  const prev = data.prev ?? null;
  const up = prev != null && price > prev;
  const down = prev != null && price < prev;
  return (
    <div className={'ticker ' + (up?'up':down?'down':'')}>
      <span className='sym'>{symbol}</span>
      <span className='price'>{typeof price==='number'?price.toFixed(2):price}</span>
      <button onClick={onRemove}>✕</button>
    </div>
  );
}
