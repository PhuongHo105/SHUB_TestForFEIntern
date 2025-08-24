import React from 'react'
import './Input.css'

export default function Input({ type, name }) {
    let defaultValue = '';
    let minValue;
    if (type === 'number') {
        defaultValue = 0;
        minValue = 0;
    }
    if (type === 'date') {
        const now = new Date();
        defaultValue = now.toISOString().slice(0, 10);
    }
    if (type === 'datetime-local') {
        const now = new Date();
        const pad = n => n.toString().padStart(2, '0');
        defaultValue = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    }
    return (
        <div className='input-container'>
            <label htmlFor={name}>{name}</label>
            <input
                type={type}
                id={name}
                defaultValue={defaultValue}
                {...(type === 'number' ? { min: minValue } : {})}
                {...arguments[0]}
            />
        </div>
    )
}