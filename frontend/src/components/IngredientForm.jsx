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
user_profile: {}, // user profile intentionally disabled for now
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
<form
onSubmit={submit}
className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
>
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
<div>
<label className="block text-sm font-medium text-slate-700 mb-1">
Product type
</label>
<select
value={productType}
onChange={(e) => setProductType(e.target.value)}
className="w-full rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
>
<option value="skincare">Skincare</option>
<option value="food">Food</option>
</select>
</div>


<div className="md:col-span-2">
<label className="block text-sm font-medium text-slate-700 mb-1">
Ingredients
</label>
<textarea
rows={5}
value={ingredientsText}
onChange={(e) => setIngredientsText(e.target.value)}
placeholder="Aqua, Niacinamide, Glycerine, Perfume"
className="w-full rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
/>
</div>
</div>


<div className="mt-6 flex items-center gap-4">
<button
type="submit"
disabled={loading}
className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
>
{loading ? "Analyzing…" : "Analyze ingredients"}
</button>


{error && <p className="text-sm text-red-600">{error}</p>}
</div>
</form>
);
}