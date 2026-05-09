import React from 'react';

const LoadingSkeleton = ({ count = 3, className = "h-24" }) => {
    return (
        <div className="w-full flex flex-col gap-4">
            {Array(count).fill(0).map((_, idx) => (
                <div key={idx} className={`skeleton rounded-xl ${className}`}></div>
            ))}
        </div>
    );
};

export default LoadingSkeleton;
