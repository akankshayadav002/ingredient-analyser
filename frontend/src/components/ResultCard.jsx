import React from "react";

function SafetyBadge({ level }) {
  const styles = {
    safe: "badge badge-safe",
    caution: "badge badge-caution",
    avoid: "badge badge-avoid",
    default: "badge badge-default",
  };

  const normalized = (level || "").toLowerCase();
  const label =
    normalized.charAt(0).toUpperCase() + normalized.slice(1) || "Unknown";
  const style = styles[normalized] || styles.default;

  return <span className={style}>{label}</span>;
}

export default function ResultCard({ data }) {
  const {
    parsed_ingredients = [],
    warnings = [],
    alternative_suggestions = [],
    overall_score,
  } = data;

  const counts = parsed_ingredients.reduce(
    (acc, ing) => {
      const key = (ing.safety_level || "").toLowerCase();
      if (key === "safe") acc.safe += 1;
      else if (key === "caution") acc.caution += 1;
      else if (key === "avoid") acc.avoid += 1;
      return acc;
    },
    { safe: 0, caution: 0, avoid: 0 }
  );

  return (
    <div className="result-card">
      <h2 className="result-header-title">Analysis summary</h2>
      <p className="result-header-subtitle">
        Ingredient safety, suitability, and any important warnings for this
        product.
      </p>

      {overall_score && (
        <div className="summary-grid">
          <div className="summary-score">
            <div className="summary-score-circle">
              <span className="summary-score-value">
                {overall_score.safety_score.toFixed(1)}
              </span>
            </div>
            <div>
              <p className="summary-score-label">Overall safety score</p>
              <p className="summary-score-summary">
                {overall_score.summary}
              </p>
            </div>
          </div>
          <div>
            <p className="summary-suitability-label">Suitability</p>
            <div className="summary-suitability-bar">
              <div
                className="summary-suitability-fill"
                style={{
                  width: `${
                    Math.min(
                      100,
                      Math.max(
                        0,
                        (overall_score.suitability_score || 0) * 10
                      )
                    ) || 0
                  }%`,
                }}
              />
            </div>
            <p className="summary-suitability-text">
              {overall_score.suitability_score.toFixed(1)} / 10 suitability
            </p>
          </div>
        </div>
      )}

      {parsed_ingredients.length > 0 && (
        <div className="pill-row">
          <span className="pill">
            <span className="pill-dot-safe" />
            <span>{counts.safe} safe</span>
          </span>
          <span className="pill">
            <span className="pill-dot-caution" />
            <span>{counts.caution} caution</span>
          </span>
          <span className="pill">
            <span className="pill-dot-avoid" />
            <span>{counts.avoid} avoid</span>
          </span>
        </div>
      )}

      <div className="ingredient-list">
        {parsed_ingredients.map((ing, idx) => (
          <div key={idx} className="ingredient-card">
            <div>
              <p className="ingredient-name">
                {ing.name}
                {ing.category && (
                  <span className="ingredient-category">{ing.category}</span>
                )}
              </p>
              {ing.explanation && (
                <p className="ingredient-explanation">{ing.explanation}</p>
              )}
            </div>
            <div>
              <SafetyBadge level={ing.safety_level} />
            </div>
          </div>
        ))}
      </div>

      {warnings.length > 0 && (
        <div className="warning-card">
          <h3 className="warning-title">Warnings</h3>
          <ul className="warning-list">
            {warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {alternative_suggestions.length > 0 && (
        <div className="suggestion-card">
          <h3 className="suggestion-title">Suggestions</h3>
          <ul className="suggestion-list">
            {alternative_suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
