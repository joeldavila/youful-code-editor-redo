import React from 'react'
const Button = ({title, onClick}) => {
    return (
        <div>
            <button
                className = "button"
                style={{
                    maxWidth: "140px",
                    minWidth: "80px",
                    height: "50px",
                    marginRight: "5px",
                }}
                onClick={onClick}
            >
                {title}
            </button>
        </div>
    )
}
export default Button
