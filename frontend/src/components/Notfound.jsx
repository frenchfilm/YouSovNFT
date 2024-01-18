import React from "react";
import { Link } from "react-router-dom";

export default function Notfound() {
  return (
    <div className="flex flex-col items-center mt-4">
      <h1 className="text-3xl">404</h1>
      <p className="text-xl">Page not found</p>
      <Link to="/" className="text-blue-500 hover:underline">
        Go back home
      </Link>
    </div>
  );
}


