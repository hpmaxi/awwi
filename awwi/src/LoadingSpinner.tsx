import React from "react";

export const LoadingSpinner = () => (
  <>
    <div className="flex justify-center items-center h-40 w-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
    <div className="flex justify-center items-center">
      <h1>loading pxe assets...</h1>
    </div>
  </>
);
