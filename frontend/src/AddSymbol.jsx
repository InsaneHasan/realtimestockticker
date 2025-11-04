
import React, { useState } from 'react';
export default function AddSymbol({ onAdd }) {
  const [val, setVal] = useState('');
  return (
    <form onSubmit={e=>{e.preventDefault(); if(val.trim()){onAdd(val.trim()); setVal('');}}}>
      <input value={val} onChange={e=>setVal(e.target.value)} placeholder='Add symbol (TSLA)'/>
      <button>Add</button>
    </form>
  );
}
