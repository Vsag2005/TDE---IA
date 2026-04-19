import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";


export default function Conexao() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const tipo = state?.tipo;

  const [host, setHost] = useState("");
  const [user, setUser] = useState("");
  const [senha, setSenha] = useState("");

  const conectar = () => {
    navigate("/perguntas", {
      state: { tipo, conexao: { host, user, senha } },
    });
  };

  return (
    <div className="conexao-container">
      <h2>Conectar ao {tipo === "mongo" ? "MongoDB" : "MySQL"}</h2>

      <input placeholder="Host" value={host} onChange={(e) => setHost(e.target.value)} />
      <input placeholder="Usuário" value={user} onChange={(e) => setUser(e.target.value)} />
      <input placeholder="Senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />

      <button onClick={conectar}>Conectar</button>
    </div>
  );
}