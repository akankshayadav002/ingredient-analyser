import React, { useState } from "react";
import { analyze } from "../api";

export default function IngredientForm({ onResult }) {
  const [productType, setProductType] = useState("skincare");
  const [ingredientsText, setIngredientsText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        product_type: productType,
        ingredients_text: ingredientsText,
        user_profile: {},
      };

      const res = await analyze(payload);
      onResult(res);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-and-features">
      <form onSubmit={submit} className="ingredient-form-card">
        <div className="ingredient-grid ingredient-grid-inner">
          <div>
            <label className="form-label">Product type</label>
            <select
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              className="form-select"
            >
              <option value="skincare">Skincare</option>
              <option value="food">Food</option>
            </select>
          </div>

          <div>
            <label className="form-label">Ingredients</label>
            <textarea
              rows={5}
              value={ingredientsText}
              onChange={(e) => setIngredientsText(e.target.value)}
              placeholder="Aqua, Niacinamide, Glycerine, Perfume"
              className="form-textarea"
            />
          </div>
        </div>

        <div className="form-footer">
          <button type="submit" disabled={loading} className="button-primary">
            {loading && <span className="button-spinner" />}
            <span>{loading ? "Analyzing…" : "Analyze"}</span>
          </button>

          {error && <p className="form-error">{error}</p>}
        </div>
      </form>

      <div className="feature-pill-row">
  <div className="feature-pill safe">
    <span className="feature-pill-dot green" />
    <div>
      <p className="feature-pill-title">Safety Signal System</p>
      <p className="feature-pill-text">Green · Yellow · Red classification</p>
    </div>
  </div>

  <div className="feature-pill score">
    <span className="feature-pill-dot blue" />
    <div>
      <p className="feature-pill-title">Instant Product Score</p>
      <p className="feature-pill-text">Conservative overall safety rating</p>
    </div>
  </div>

  <div className="feature-pill suggest">
    <span className="feature-pill-dot purple" />
    <div>
      <p className="feature-pill-title">Smarter Alternatives</p>
      <p className="feature-pill-text">Gentler ingredient suggestions</p>
    </div>
  </div>
</div>

    </div>
  );
}
