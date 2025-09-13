import React, { useState, useEffect } from "react";

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    category: "",
    description: "",
    code: "",
  });
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("intent-cookbook");
    if (stored) setRecipes(JSON.parse(stored));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("intent-cookbook", JSON.stringify(recipes));
  }, [recipes]);

  // Add a new recipe
  const addRecipe = () => {
    if (!newRecipe.title || !newRecipe.code) {
      alert("Title and code are required");
      return;
    }
    const r = { ...newRecipe, id: Math.random().toString(36).slice(2), createdAt: new Date().toISOString(), forks: 0, deployCount: 0 };
    setRecipes([r, ...recipes]);
    setNewRecipe({ title: "", category: "", description: "", code: "" });
  };

  return (
    <div className="min-h-screen" style={{background:"#f3f4f6", padding:24}}>
      <div style={{maxWidth:980, margin:"0 auto"}}>
        <h1 style={{textAlign:"center", fontSize:28, marginBottom:18}}>🌱 Intent Cookbook</h1>

        <div style={{background:"#fff", padding:16, borderRadius:12, boxShadow:"0 6px 20px rgba(12,12,12,0.06)", marginBottom:18}}>
          <h2 style={{margin:0}}>➕ Add New Recipe</h2>
          <input value={newRecipe.title} onChange={e=>setNewRecipe({...newRecipe, title:e.target.value})} placeholder="Title" style={{width:"100%", padding:10, marginTop:8}}/>
          <input value={newRecipe.category} onChange={e=>setNewRecipe({...newRecipe, category:e.target.value})} placeholder="Category (e.g. Payments, Auctions)" style={{width:"100%", padding:10, marginTop:8}}/>
          <textarea value={newRecipe.description} onChange={e=>setNewRecipe({...newRecipe, description:e.target.value})} placeholder="Description" rows={3} style={{width:"100%", padding:10, marginTop:8}}/>
          <textarea value={newRecipe.code} onChange={e=>setNewRecipe({...newRecipe, code:e.target.value})} placeholder="Code snippet" rows={6} style={{width:"100%", padding:10, marginTop:8, fontFamily:"monospace"}}/>
          <div style={{marginTop:10}}>
            <button onClick={addRecipe} style={{padding:"8px 12px", background:"#16a34a", color:"#fff", borderRadius:8}}>Add Recipe</button>
          </div>
        </div>

        <section>
          <h2>📖 Cookbook Library</h2>
          {recipes.length === 0 && <p style={{color:"#6b7280"}}>No recipes yet. Add one above!</p>}
          <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:12, marginTop:12}}>
            {recipes.map((r) => (
              <div key={r.id} style={{background:"#fff", padding:12, borderRadius:12, boxShadow:"0 4px 12px rgba(12,12,12,0.06)"}}>
                <div style={{display:"flex", justifyContent:"space-between"}}>
                  <div>
                    <h3 style={{margin:0}}>{r.title}</h3>
                    <div style={{color:"#6b7280", fontSize:13}}>{r.category}</div>
                  </div>
                  <div style={{textAlign:"right", fontSize:12, color:"#6b7280"}}>
                    <div>Deployed: {r.deployCount||0}</div>
                    <div>Forks: {r.forks||0}</div>
                  </div>
                </div>
                <p style={{marginTop:8}}>{r.description}</p>
                <div style={{marginTop:8}}>
                  <button onClick={()=>setSelectedRecipe(r)} style={{marginRight:8}}>View →</button>
                  <button onClick={()=>{
                    const rem = {...r, id: Math.random().toString(36).slice(2), title:r.title+' (Remix)', createdAt:new Date().toISOString(), forks:0, deployCount:0};
                    setRecipes(prev => [rem, ...prev.map(x=> x.id === r.id ? {...x, forks:(x.forks||0)+1} : x)]);
                  }}>Remix</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {selectedRecipe && (
          <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", padding:20}} onClick={()=>setSelectedRecipe(null)}>
            <div style={{background:"#fff", padding:18, borderRadius:12, maxWidth:720, width:"100%"}} onClick={e=>e.stopPropagation()}>
              <button onClick={()=>setSelectedRecipe(null)} style={{float:"right", border:"none", background:"transparent", fontSize:18}}>✖</button>
              <h2>{selectedRecipe.title}</h2>
              <div style={{color:"#6b7280", marginBottom:8}}>{selectedRecipe.category}</div>
              <p>{selectedRecipe.description}</p>
              <pre style={{background:"#f8fafc", padding:12, borderRadius:8}}>{selectedRecipe.code}</pre>
              <button onClick={()=>{
                setSelectedRecipe(null);
                setNewRecipe(prev => ({...prev, title: selectedRecipe.title + ' (Remix)', code: selectedRecipe.code}));
              }} style={{marginTop:12, padding:"8px 12px", background:"#2563eb", color:"#fff", borderRadius:8}}>Remix Recipe</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}