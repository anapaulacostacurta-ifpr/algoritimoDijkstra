// script.js
const nodes = [];
const edges = [];
const container = document.getElementById('mynetwork');
const data = { nodes, edges };
const options = {};

// Função para ler o arquivo e criar o grafo
async function loadGraph(file) {
  const response = await fetch(file);
  const text = await response.text();
  const lines = text.split('\n');

  lines.forEach(line => {
    const parts = line.split(' ');
    if (parts.length === 3) {
      const source = parseInt(parts[0]);
      const target = parseInt(parts[1]);
      const weight = parseInt(parts[2]);
      nodes.push({ id: source });
      nodes.push({ id: target });
      edges.push({ from: source, to: target, weight });
    }
  });

  // Criar a visualização do grafo
  const network = new vis.Network(container, data, options);
}

// Função para encontrar o caminho mínimo
function findShortestPath() {
  const source = parseInt(document.getElementById('source').value);
  const target = parseInt(document.getElementById('target').value);

  // Implementar o algoritmo de Dijkstra aqui
  // ...

  // Visualizar o caminho mínimo no grafo
  // ...
}

// Carregar o grafo inicial
loadGraph('data.txt');