import React, { useState } from "react";
import "./ConectarDB.css";
import { useNavigate } from "react-router-dom";

export default function ConectarMySQL() {
  const navigate = useNavigate();
  const [host, setHost] = useState("");
  const [user, setUser] = useState("");
  const [senha, setSenha] = useState("");

  return (
    <div className="db-wrapper">
      <h1>Conectar ao MySQL</h1>

      <input placeholder="Host" value={host} onChange={e => setHost(e.target.value)} />
      <input placeholder="Usuário" value={user} onChange={e => setUser(e.target.value)} />
      <input placeholder="Senha" type="password" value={senha} onChange={e => setSenha(e.target.value)} />

      <button className="btn-primary" onClick={() => navigate("/perguntas")}>
        Conectar
      </button>
    </div>
  );
}