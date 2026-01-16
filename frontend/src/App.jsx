import React, { useState } from "react";
import IngredientForm from "./components/IngredientForm";
import ResultCard from "./components/ResultCard";


export default function App() {
const [result, setResult] = useState(null);


return (
<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
<div className="max-w-5xl mx-auto px-4 py-10">
<header className="mb-8">
<h1 className="text-3xl font-bold text-slate-800">
AI Product Ingredient Analyzer
</h1>
<p className="text-slate-600 mt-2">
Analyze skincare or food ingredients for safety and suitability
</p>
</header>


<IngredientForm onResult={setResult} />


{result && (
<div className="mt-10">
<ResultCard data={result} />
</div>
)}
</div>
</div>
);
}
