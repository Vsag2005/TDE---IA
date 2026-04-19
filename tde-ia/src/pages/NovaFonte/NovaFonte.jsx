import React, { useRef, useState } from 'react';
import './NovaFonte.css';
import { useNavigate } from 'react-router-dom';
import { processarArquivo } from '../../services/iaService';

const passos = ['Upload', 'Processamento', 'Vetorização', 'Armazenamento', 'Consulta', 'Resposta'];

export default function NovaFonte() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [status, setStatus] = useState('Aguardando documentos...');
  const [carregando, setCarregando] = useState(false);
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [ultimoArquivo, setUltimoArquivo] = useState(null);

  async function lidarArquivos(files) {
    const lista = Array.from(files || []);
    if (!lista.length) return;

    setCarregando(true);
    setStatus('Invocando o upload do manuscrito...');

    try {
      for (let i = 0; i < passos.length - 1; i += 1) {
        setEtapaAtual(i);
        await new Promise((resolve) => setTimeout(resolve, 450));
      }

      const fonte = await processarArquivo(lista[0]);
      setUltimoArquivo(fonte);
      setEtapaAtual(5);
      setStatus(`Fonte ${fonte.nome} adicionada ao arquivo de Pathos.`);
      setTimeout(() => {
        navigate('/perguntas', { state: { sourceId: fonte.id } });
      }, 800);
    } catch (error) {
      setStatus('Não foi possível concluir o rito de importação.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="pathos-upload-page">
      <header className="upload-topbar">
        <button onClick={() => navigate('/')}>← Voltar ao arquivo</button>
        <h1>Pathos</h1>
        <button onClick={() => navigate('/perguntas')}>Abrir estúdio</button>
      </header>

      <main className="upload-layout">
        <section className="upload-left parchment-box">
          <p className="small-kicker">Nova fonte documental</p>
          <h2>Envie PDFs, XLSX ou textos para alimentar o oráculo semântico.</h2>
          <p>
            Aqui acontece o rito completo de importação. O conteúdo é processado, fragmentado em trechos,
            vetorizado e salvo para consultas futuras.
          </p>

          <div
            className="dropzone"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              lidarArquivos(e.dataTransfer.files);
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.xlsx,.xls,.txt"
              hidden
              onChange={(e) => lidarArquivos(e.target.files)}
            />

            <strong>Arraste e solte seus arquivos</strong>
            <span>pdf, planilhas, textos e outros documentos</span>

            <div className="dropzone-actions">
              <button type="button">Enviar arquivos</button>
              <button type="button">Texto copiado</button>
            </div>
          </div>

          <div className="upload-status">{status}</div>
        </section>

        <aside className="upload-right parchment-box">
          <h3>Fluxo ritual</h3>
          <div className="steps-list">
            {passos.map((passo, index) => (
              <div
                key={passo}
                className={`step-item ${index <= etapaAtual ? 'active' : ''} ${carregando && index === etapaAtual ? 'current' : ''}`}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{passo}</strong>
              </div>
            ))}
          </div>

          {ultimoArquivo && (
            <div className="last-source-card">
              <p className="small-kicker">Último arquivo sacramentado</p>
              <h4>{ultimoArquivo.nome}</h4>
              <p>{ultimoArquivo.tipo} • {ultimoArquivo.chunks.length} trechos semânticos</p>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}
