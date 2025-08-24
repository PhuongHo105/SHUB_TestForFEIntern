import React from 'react'
import './Combobox.css'

export default function Combobox({ options, onChange, value, name }) {
    return (
        <div className='input-container'>
            <label htmlFor={name}>{name}</label>
            <select value={value} onChange={onChange}>
                <option value="" selected disabled>
                    Chọn {name}
                </option>
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>

    )
}
