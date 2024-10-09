// script.js

const nodes = [];
const edges = [];
const container = document.getElementById('mynetwork');
const data = { nodes, edges };
const options = {  
    nodes: {
      font: {
        size: 16,
        color: 'black'
      },
      shape: 'circle',
      borderWidth: 2
    },
    edges: {
      color: {
        color: 'blue'
      },
      width: 2
    },
    physics: {
      enabled: true,
      forceAtlas2Based: {
        gravitationalConstant: -50
      }
    }
 };


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
      if(!nodes.find(node => node.id === source)){
        nodes.push({ id: source, label: source });
      }
      if(!nodes.find(node => node.id === target)){
        nodes.push({ id: target, label: target});
      }
      edges.push({ from: source, to: target, weight });
    }
  });

  // Criar a visualização do grafo
  return network = new vis.Network(container, data, options);
}

// Função para encontrar o caminho mínimo
function findShortestPath() {
  const source = parseInt(document.getElementById('source').value);
  const target = parseInt(document.getElementById('target').value);
 
  // Inicialização do algoritmo de Dijkstra
  const distances = {};
  const previous = {};
  const visited = new Set();
  const nodes = [...data.nodes]; // Criar uma cópia para não modificar o original

  nodes.forEach(node => {
    distances[node.id] = Infinity;
    previous[node.id] = null;
  });
  distances[source] = 0;

  while (nodes.length > 0) {
    // Encontrar o vértice não visitado com a menor distância
    let closest = null;
    for (let node of nodes) {
      if (closest === null || distances[node.id] < distances[closest.id]) {
        closest = node;
      }
    }

    // Remover o vértice mais próximo da lista de não visitados
    nodes.splice(nodes.indexOf(closest), 1);
    visited.add(closest.id);

    // Atualizar as distâncias dos vizinhos
    const neighbors = network.getNeighbors(closest.id);
    for (let neighbor of neighbors) {
      const edge = network.getEdge(closest.id, neighbor);
      const alt = distances[closest.id] + edge.weight;
      if (alt < distances[neighbor]) {
        distances[neighbor] = alt;
        previous[neighbor] = closest.id;
      }
    }
  }

  // Construir o caminho
  const path = [];
  let current = target;
  while (current != null) {
    path.unshift(current);
    current = previous[current];
  }

  // Visualizar o caminho mínimo
  const highlightedEdges = [];
  for (let i = 0; i < path.length - 1; i++) {
    highlightedEdges.push({ from: path[i], to: path[i + 1] });
  }
  network.setOptions({ edges: { color: { color: '#ff0000' } } });
  network.setData({ edges: [...data.edges, ...highlightedEdges] });
}

// Carregar o grafo inicial
const network = loadGraph('./assets/data.txt');