const STORAGE_KEY = 'pathos_fontes';

export function listarFontes() {
  const fontes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  return fontes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function salvarFonte({ nome, tipo, conteudo, origem = 'upload' }) {
  const fontes = listarFontes();

  const novaFonte = {
    id: crypto.randomUUID(),
    nome,
    tipo,
    origem,
    conteudo,
    chunks: quebrarEmTrechos(conteudo),
    etapas: [
      'Upload concluído',
      'Processamento textual finalizado',
      'Vetorização semântica simulada',
      'Armazenamento local concluído',
    ],
    createdAt: new Date().toISOString(),
  };

  const atualizadas = [novaFonte, ...fontes];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizadas));
  return novaFonte;
}

export function obterFontePorId(id) {
  return listarFontes().find((fonte) => fonte.id === id);
}

export async function lerArquivoComoTexto(file) {
  const extensao = file.name.split('.').pop()?.toLowerCase();

  if (extensao === 'txt' || file.type.startsWith('text/')) {
    return file.text();
  }

  return `Documento importado: ${file.name}\n\n` +
    `Este protótipo Pathos registrou o arquivo com sucesso e simulou a extração de conteúdo. ` +
    `Para uma versão completa, conecte um parser real de PDF/XLSX no backend. ` +
    `Enquanto isso, a interface já percorre o fluxo de upload, processamento, vetorização, armazenamento, consulta e resposta.\n\n` +
    `Trechos estimados para análise:\n` +
    `- origem: ${file.name}\n` +
    `- tipo: ${extensao?.toUpperCase() || 'documento'}\n` +
    `- tamanho aproximado: ${Math.ceil(file.size / 1024)} KB\n` +
    `- objetivo: gerar resumos, comparações, perguntas críticas e respostas contextualizadas.`;
}

export async function processarArquivo(file) {
  const conteudo = await lerArquivoComoTexto(file);
  return salvarFonte({
    nome: file.name,
    tipo: file.name.split('.').pop()?.toUpperCase() || 'DOC',
    conteudo,
  });
}

export async function perguntarIA(pergunta, fonteIds = []) {
  const fontes = listarFontes().filter((fonte) =>
    fonteIds.length ? fonteIds.includes(fonte.id) : true
  );

  const trechos = fontes.flatMap((fonte) =>
    fonte.chunks.map((chunk) => ({ ...chunk, fonte: fonte.nome }))
  );

  const relevantes = rankearTrechos(pergunta, trechos).slice(0, 3);

  const resposta = relevantes.length
    ? `Com base nas fontes selecionadas, identifiquei ${relevantes.length} trecho(s) relevante(s). ` +
      `A resposta sugere que ${sintetizarResposta(pergunta, relevantes)}.`
    : 'Ainda não encontrei trechos suficientes. Adicione fontes ou refine sua pergunta.';

  return {
    resposta,
    trechos: relevantes,
  };
}

function quebrarEmTrechos(texto) {
  return texto
    .split(/\n\n|\.\s+/)
    .map((parte) => parte.trim())
    .filter(Boolean)
    .map((textoParte, index) => ({
      id: `chunk-${index + 1}`,
      texto: textoParte,
      vetor: gerarVetor(textoParte),
    }));
}

function gerarVetor(texto) {
  return [
    texto.length % 17,
    texto.split(' ').length % 13,
    [...texto].reduce((acc, char) => acc + char.charCodeAt(0), 0) % 19,
  ];
}

function rankearTrechos(pergunta, trechos) {
  const termos = pergunta.toLowerCase().split(/\s+/).filter((t) => t.length > 2);

  return trechos
    .map((trecho) => ({
      ...trecho,
      score: termos.reduce((acc, termo) => {
        return trecho.texto.toLowerCase().includes(termo) ? acc + 1 : acc;
      }, 0),
    }))
    .sort((a, b) => b.score - a.score || b.texto.length - a.texto.length);
}

function sintetizarResposta(pergunta, trechos) {
  const base = trechos
    .map((trecho) => `na fonte ${trecho.fonte}, aparece a ideia de "${trecho.texto.slice(0, 110)}..."`)
    .join(' ');

  if (/resumo/i.test(pergunta)) return `o documento trata principalmente dos seguintes pontos: ${base}`;
  if (/compar/i.test(pergunta)) return `há relações comparáveis entre os conteúdos analisados, especialmente porque ${base}`;
  if (/cr[ií]tica|pergunta/i.test(pergunta)) return `existem pontos que merecem debate crítico, já que ${base}`;

  return `${base}`;
}
