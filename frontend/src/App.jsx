import React from "react";
import TokenForm from "./components/Tokenform";
import Navbar from "./components/Navbar";

function App() {
  const handleFormSubmit = (formData) => {
    console.log("Form Data:", formData);
  };

  return (
    <div className="App">
      <div className="flex flex-col items-center mt-4">
        <Navbar />
        <TokenForm onSubmit={handleFormSubmit} />
      </div>
    </div>
  );
}

export default App;
