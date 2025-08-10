// src/App.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Dashboard from "./components/Dashboard";
import { Toaster } from "react-hot-toast";

export default function App(){
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAudits = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/audit"); // or /api/audits depending on route
      setAudits(res.data);
    } catch(e){
      console.error("fetch audits", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{ fetchAudits(); }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Toaster position="top-right"/>
      <div className="max-w-7xl mx-auto p-6">
        <Dashboard audits={audits} loading={loading} refresh={fetchAudits}/>
      </div>
    </div>
  );
}
