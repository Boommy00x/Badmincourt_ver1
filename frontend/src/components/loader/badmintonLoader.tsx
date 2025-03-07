import React from 'react'

const BadmintonLoader: React.FC = () => {
  return (
    <div className="badminton-loader">
      <svg
        width="50"
        height="50"
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="badminton"
      >
        <circle cx="25" cy="25" r="20" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
        <path
          d="M25 5C25 15 35 25 45 25"
          stroke="#000000"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M25 5C25 15 15 25 5 25"
          stroke="#000000"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
          }
          75% {
            transform: translateY(10%) rotate(360deg);
          }
          100% {
            transform: translateY(0) rotate(420deg);
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0) rotate(420deg);
          }
          50% {
            transform: translateY(-20px) rotate(390deg);
          }
        }
        
        .badminton-loader {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        
        .badminton {
          animation: fall 1s ease-in forwards, bounce 0.5s ease-in-out 1s infinite;
        }
      `}</style>
    </div>
  )
}

export default BadmintonLoader

