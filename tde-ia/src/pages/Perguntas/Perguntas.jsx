import React, { useEffect, useMemo, useState } from 'react';
import './Perguntas.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { listarFontes, perguntarIA } from '../../services/iaService';

const sugestoes = [
  'Faça um resumo do documento principal',
  'Compare as ideias centrais entre as fontes',
  'Crie perguntas críticas a partir do conteúdo',
];

export default function Perguntas() {
  const navigate = useNavigate();
  const location = useLocation();
  const fontesIniciais = listarFontes();
  const sourceId = location.state?.sourceId;

  const [fontes, setFontes] = useState(
    fontesIniciais.map((fonte) => ({
      ...fonte,
      selecionado: sourceId ? fonte.id === sourceId : true,
    }))
  );
  const [mensagem, setMensagem] = useState('');
  const [chat, setChat] = useState([
    {
      tipo: 'ia',
      texto: 'Pathos aguarda sua consulta. Selecione as fontes e invoque um resumo, uma comparação ou uma pergunta crítica.',
    },
  ]);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    setFontes(
      listarFontes().map((fonte) => ({
        ...fonte,
        selecionado: sourceId ? fonte.id === sourceId : true,
      }))
    );
  }, [sourceId]);

  const fontesSelecionadas = useMemo(
    () => fontes.filter((fonte) => fonte.selecionado),
    [fontes]
  );

  function toggleFonte(id) {
    setFontes((estadoAtual) =>
      estadoAtual.map((fonte) =>
        fonte.id === id ? { ...fonte, selecionado: !fonte.selecionado } : fonte
      )
    );
  }

  async function enviarMensagem(textoForcado) {
    const texto = (textoForcado || mensagem).trim();
    if (!texto) return;

    setChat((estado) => [...estado, { tipo: 'user', texto }]);
    setMensagem('');
    setCarregando(true);

    const resultado = await perguntarIA(
      texto,
      fontesSelecionadas.map((fonte) => fonte.id)
    );

    setChat((estado) => [
      ...estado,
      {
        tipo: 'ia',
        texto: resultado.resposta,
        trechos: resultado.trechos,
      },
    ]);
    setCarregando(false);
  }

  return (
    <div className="pathos-chat-page">
      <aside className="chat-sidebar left">
        <div className="chat-sidebar-header">
          <span className="chat-kicker">Fontes ativas</span>
          <h2>Arquivo</h2>
        </div>

        <button className="sidebar-action" onClick={() => navigate('/nova-fonte')}>
          + Adicionar fonte
        </button>

        <div className="fontes-lista-scroll">
          {fontes.length ? (
            fontes.map((fonte) => (
              <label key={fonte.id} className="fonte-item-pathos">
                <input
                  type="checkbox"
                  checked={fonte.selecionado}
                  onChange={() => toggleFonte(fonte.id)}
                />
                <div>
                  <strong>{fonte.nome}</strong>
                  <span>{fonte.tipo} • {fonte.chunks.length} trechos</span>
                </div>
              </label>
            ))
          ) : (
            <div className="empty-sidebar-card">
              Nenhuma fonte presente. Volte e envie um documento para abrir o estúdio semântico.
            </div>
          )}
        </div>
      </aside>

      <main className="chat-main">
        <header className="chat-topbar">
          <button onClick={() => navigate('/')}>← Início</button>
          <div className="chat-brand">
            <p>estúdio apócrifo</p>
            <h1>Pathos</h1>
          </div>
          <button onClick={() => navigate('/nova-fonte')}>Nova fonte</button>
        </header>

        <section className="prompt-card">
          <h2>Consulte seus documentos</h2>
          <p>
            A IA responde com base nas fontes selecionadas, percorrendo o fluxo de consulta semântica antes de gerar a resposta.
          </p>

          <div className="suggestion-row">
            {sugestoes.map((sugestao) => (
              <button key={sugestao} onClick={() => enviarMensagem(sugestao)}>
                {sugestao}
              </button>
            ))}
          </div>
        </section>

        <section className="chat-scroll-area">
          {chat.map((msg, index) => (
            <div key={index} className={`message-card ${msg.tipo}`}>
              <span className="message-author">{msg.tipo === 'user' ? 'Você' : 'Pathos'}</span>
              <p>{msg.texto}</p>

              {msg.trechos?.length ? (
                <div className="trechos-box">
                  {msg.trechos.map((trecho) => (
                    <div key={`${trecho.fonte}-${trecho.id}`} className="trecho-item">
                      <strong>{trecho.fonte}</strong>
                      <span>{trecho.texto}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ))}

          {carregando && <div className="message-card ia">Pathos está examinando os manuscritos...</div>}
        </section>

        <footer className="chat-composer">
          <textarea
            placeholder="Pergunte algo sobre as fontes..."
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                enviarMensagem();
              }
            }}
          />
          <button onClick={() => enviarMensagem()}>Enviar</button>
        </footer>
      </main>

      <aside className="chat-sidebar right">
        <div className="chat-sidebar-header">
          <span className="chat-kicker">Painel de leitura</span>
          <h2>Consulta</h2>
        </div>

        <div className="insight-box">
          <strong>Fontes selecionadas</strong>
          <p>{fontesSelecionadas.length} de {fontes.length}</p>
        </div>

        <div className="insight-box">
          <strong>Fluxo ativo</strong>
          <p>Consulta → Recuperação de trechos → Resposta contextual.</p>
        </div>

        <div className="insight-box">
          <strong>Modo</strong>
          <p>Leitura crítica, semântica e comparativa.</p>
        </div>
      </aside>
    </div>
  );
}
