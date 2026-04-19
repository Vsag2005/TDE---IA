import React, { useMemo, useState } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import { listarFontes } from '../../services/iaService';

const estudios = [
  'Resumo ritual',
  'Comparação de manuscritos',
  'Perguntas críticas',
  'Linha argumentativa',
];

export default function Home() {
  const navigate = useNavigate();
  const [ordem, setOrdem] = useState('recentes');
  const fontes = listarFontes();

  const fontesOrdenadas = useMemo(() => {
    const copia = [...fontes];
    return ordem === 'antigas'
      ? copia.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      : copia.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [fontes, ordem]);

  const ultimaFonte = fontesOrdenadas[0];

  return (
    <div className="pathos-shell home-page">
      <aside className="pathos-sidebar left-panel">
        <div className="panel-header">
          <span className="panel-kicker">Arquivo dos escribas</span>
          <h2>Fontes</h2>
        </div>

        <button className="ghost-search" onClick={() => navigate('/nova-fonte')}>
          + Adicionar fonte
        </button>

        <div className="source-list">
          {fontesOrdenadas.length ? (
            fontesOrdenadas.slice(0, 6).map((fonte) => (
              <button
                key={fonte.id}
                className="source-item"
                onClick={() => navigate('/perguntas', { state: { sourceId: fonte.id } })}
              >
                <strong>{fonte.nome}</strong>
                <span>{fonte.tipo} • {new Date(fonte.createdAt).toLocaleDateString('pt-BR')}</span>
              </button>
            ))
          ) : (
            <div className="empty-note">
              Nenhum pergaminho foi adicionado ainda. Envie um PDF ou XLSX para iniciar o arquivo de Pathos.
            </div>
          )}
        </div>
      </aside>

      <main className="pathos-main home-main">
        <header className="topbar">
          <div>
            <p className="brand-mark">scriptorium // interface apócrifa</p>
            <h1>Pathos</h1>
          </div>

          <div className="topbar-actions">
            <button onClick={() => navigate('/nova-fonte')}>+ Criar análise</button>
            <button onClick={() => navigate('/perguntas')}>Abrir estúdio</button>
          </div>
        </header>

        <section className="hero-panel parchment-frame">
          <p className="hero-overline">Leitura semântica de documentos</p>
          <h2>Envie seus manuscritos digitais para análise, indexação e resposta contextual.</h2>
          <p>
            O fluxo de Pathos segue o rito completo: <strong>Upload → Processamento → Vetorização → Armazenamento → Consulta → Resposta</strong>.
          </p>

          <div className="hero-actions">
            <button className="primary-ritual" onClick={() => navigate('/nova-fonte')}>
              Enviar arquivos
            </button>
            <button className="secondary-ritual" onClick={() => navigate('/perguntas')}>
              Ir ao estúdio
            </button>
          </div>
        </section>

        <section className="flow-grid">
          {['Upload', 'Processamento', 'Vetorização', 'Armazenamento', 'Consulta', 'Resposta'].map((etapa) => (
            <div key={etapa} className="flow-card">
              <span>{etapa}</span>
            </div>
          ))}
        </section>

        <section className="library-section">
          <div className="library-header">
            <h3>Arquivo recente</h3>
            <select value={ordem} onChange={(e) => setOrdem(e.target.value)}>
              <option value="recentes">Mais recentes</option>
              <option value="antigas">Mais antigas</option>
            </select>
          </div>

          <div className="library-grid">
            <button className="new-source-card" onClick={() => navigate('/nova-fonte')}>
              <span>+</span>
              <strong>Adicionar nova fonte</strong>
              <p>Importe PDFs, XLSX ou textos para iniciar uma nova análise.</p>
            </button>

            <div className="highlight-card">
              {ultimaFonte ? (
                <>
                  <p className="card-label">Último registro</p>
                  <h4>{ultimaFonte.nome}</h4>
                  <p>{ultimaFonte.etapas.join(' • ')}</p>
                  <button onClick={() => navigate('/perguntas', { state: { sourceId: ultimaFonte.id } })}>
                    Consultar fonte
                  </button>
                </>
              ) : (
                <>
                  <p className="card-label">Sem fontes registradas</p>
                  <h4>Seu arquivo ainda está vazio</h4>
                  <p>Faça o primeiro upload para ver a biblioteca ganhar vida.</p>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <aside className="pathos-sidebar right-panel">
        <div className="panel-header">
          <span className="panel-kicker">Câmara de interpretação</span>
          <h2>Estúdio</h2>
        </div>

        <div className="studio-list">
          {estudios.map((item) => (
            <button key={item} className="studio-item" onClick={() => navigate('/perguntas')}>
              {item}
            </button>
          ))}
        </div>

        <div className="studio-note">
          Após inserir suas fontes, Pathos consulta os trechos mais relevantes e devolve uma resposta fundada no conteúdo real do documento.
        </div>
      </aside>
    </div>
  );
}
