import React from "react";

const Circle = ({ progress, text }) => {
    const strokeDashoffset = 100 - progress; // Calculate the stroke offset based on the progress percentage

    return (
        <div className="relative size-40">
            <svg
                className="size-full -rotate-90"
                viewBox="0 0 36 36"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Background Circle */}
                <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    className="stroke-current text-gray-200 dark:text-neutral-700"
                    strokeWidth="2"
                />
                {/* Progress Circle */}
                <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    className="stroke-current text-blue-600 dark:text-blue-500"
                    strokeWidth="2"
                    strokeDasharray="100"
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                />
            </svg>
            {/* Percentage Text */}
            <div className="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
        <span className="text-center text-2xl font-bold text-blue-600 dark:text-blue-500">
            {text}
        </span>
            </div>
        </div>
    );
};

export default Circle;
