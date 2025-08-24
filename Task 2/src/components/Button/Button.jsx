import React from 'react'

export default function Button({ onClick, text }) {
    return (
        <button style={{
            borderRadius: '8px',
            border: '1px solid transparent',
            padding: '0.6em 1.2em',
            fontSize: '1em',
            fontWeight: 500,
            backgroundColor: '#126BF9',
            color: 'white',
            height: '100%',
            cursor: 'pointer',
            transition: 'border-color 0.25s',
        }}
            onClick={onClick}>
            {text}
        </button>
    )
}
