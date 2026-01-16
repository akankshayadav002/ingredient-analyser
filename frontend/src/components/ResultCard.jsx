import React from "react";


function SafetyBadge({ level }) {
const styles = {
safe: "bg-green-100 text-green-700",
caution: "bg-amber-100 text-amber-700",
avoid: "bg-red-100 text-red-700",
};


return (
<span
className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${styles[level]}`}
>
{level}
</span>
);
}


export default function ResultCard({ data }) {
const {
parsed_ingredients = [],
warnings = [],
alternative_suggestions = [],
} = data;
return (
<div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
<h2 className="text-xl font-semibold text-slate-800 mb-4">Results</h2>


<div className="space-y-4">
{parsed_ingredients.map((ing, idx) => (
<div
key={idx}
className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3"
>
<div>
<p className="font-medium text-slate-800">{ing.name}</p>
<p className="text-sm text-slate-600">{ing.explanation}</p>
</div>
<SafetyBadge level={ing.safety_level} />
</div>
))}
</div>


{warnings.length > 0 && (
<div className="mt-6 rounded-xl bg-amber-50 p-4">
<h3 className="font-semibold text-amber-800 mb-2">Warnings</h3>
<ul className="list-disc list-inside text-sm text-amber-700">
{warnings.map((w, i) => (
<li key={i}>{w}</li>
))}
</ul>
</div>
)}
{alternative_suggestions.length > 0 && (
<div className="mt-6 rounded-xl bg-emerald-50 p-4">
<h3 className="font-semibold text-emerald-800 mb-2">Suggestions</h3>
<ul className="list-disc list-inside text-sm text-emerald-700">
{alternative_suggestions.map((s, i) => (
<li key={i}>{s}</li>
))}
</ul>
</div>
)}
</div>
);
}