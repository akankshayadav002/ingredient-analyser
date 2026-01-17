import React, { useState } from "react";
import IngredientForm from "./components/IngredientForm";
import ResultCard from "./components/ResultCard";

export default function App() {
  const [result, setResult] = useState(null);

  return (
    <div className="app-root">
      <div className="app-shell">
        <header className="app-header app-header-bar"
  onMouseEnter={() => document.body.classList.add("show-header")}
  onMouseLeave={() => document.body.classList.remove("show-header")}>
            <div className="header-left">
                <div className="app-logo">
                <span className="app-logo-dot" />
                <span className="app-logo-text">AI Product Ingredient Analyzer</span>
                </div>
            </div>

            <div className="header-right">
                <button className="button-primary">Login / Sign up</button>
            </div>
        </header>
        <section className="hero-center">

            <h1 className="app-title futuristic-title">AI Product Ingredient Analyzer</h1>

            <p className="app-subtitle">
                Paste any skincare or food ingredient list and get an instant,
                conservative safety review, warnings, and smarter alternatives.
            </p>
        </section>
        <main className="app-main">
          <IngredientForm onResult={setResult} />
          <div className="result-panel">
            <div className="result-panel-card">
              {!result && (
                <div className="empty-state-card">
                  <div>
                    <p className="empty-title">Waiting for ingredients</p>
                    <p className="empty-subtitle">
                      Paste a full ingredient list on the left and choose the
                      product type. You will see a breakdown of each ingredient&apos;s
                      safety level and overall product score here.
                    </p>
                  </div>
                </div>
              )}
              {result && <ResultCard data={result} />}
            </div>
          </div>
        </main>

      </div>
    </div>
  );
}
