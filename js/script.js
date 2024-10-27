// script.js

const nodes = [];
const edges = [];
const container = document.getElementById('mynetwork');
const data = { nodes, edges };
const options = 
{
  edges:{
    arrows: {
      to: {
        enabled: true
      },
      from:{
        enabled: true
      }
    }
  }
};
const graph = {};

async function addGraph(qtdeNos) {
  // Constrói as arestas que formam o caminho mínimo
  const weight = 1;
  for (let i = 1; i < qtdeNos; i++) {
    const source = i;
    const target = i+1;
    nodes.push({ id: source, label: sorce.toString()});
    graph[source] = {};
    edges.push({ from: source, to: targe, weight, label:weight.toString() });
    graph[source][target] = weight;
    graph[target][source] = weight; // Supondo que o grafo seja não-direcionado
  }
  // Criar a visualização do grafo
  return new vis.Network(container, data, options);
}


// Função para ler o arquivo e criar o grafo
async function loadGraph() {
  const response = await fetch('./assets/data.txt');
  const text = await response.text();
  const lines = text.split('\n');

  lines.forEach(line => {
    const parts = line.split(' ');
    if (parts.length === 3) {
      const source = parseInt(parts[0]);
      const target = parseInt(parts[1]);
      const weight = parseInt(parts[2]);
      if(!nodes.find(node => node.id === source)){
        nodes.push({ id: source, label: source.toString()});
        graph[source] = {};
      }
      if(!nodes.find(node => node.id === target)){
        nodes.push({ id: target, label: target.toString()});
        graph[target] = {};
      }
      edges.push({ from: source, to: target, weight, label:weight.toString() });
      graph[source][target] = weight;
      graph[target][source] = weight; // Supondo que o grafo seja não-direcionado
    }
  });

  // Criar a visualização do grafo
  return new vis.Network(container, data, options);
}

// Função para encontrar o caminho mínimo
function findShortestPath() {
  const source = parseInt(document.getElementById('source').value);
  const target = parseInt(document.getElementById('target').value);
 
  const { distances, previous } = dijkstra(source);
  
  // Reconstrói o caminho mínimo de A até D
  const path = reconstructPath(previous, target);

  window.alert("Caminho mínimo: "+path); // Exibe o caminho mínimo
  console.log("Caminho mínimo:", path);
  
  // Suponha que 'network' e 'data' sejam as variáveis que representam o grafo visualizado
  visualizeShortestPath(path); // Destaca o caminho mínimo na visualização
}

// Função para visualizar o caminho mínimo no grafo
function visualizeShortestPath(path) {
  const highlightedEdges = [];

  // Constrói as arestas que formam o caminho mínimo
  for (let i = 0; i < path.length - 1; i++) {
      highlightedEdges.push({ from: path[i], to: path[i + 1], color: { color: '#ff0000' } }); // Define a cor
  }

  // Atualiza os dados do grafo com as novas arestas destacadas
  //network.setData({ edges: [...data.edges, ...highlightedEdges] });
}


// Função de Dijkstra para calcular a menor distância
function dijkstra(start) {
  let distances = {};
  let previous = {}; // Armazena o nó anterior no caminho mais curto
  let visited = new Set();

  let nodes = Object.keys(graph);

  // Inicializa as distâncias como infinito e previous como nulo
  for (let node of nodes) {
      distances[node] = Infinity;
      previous[node] = null;
  }

  // A distância do nó de início é 0
  distances[start] = 0;

  while (nodes.length) {
      // Ordena os nós pela menor distância e seleciona o nó mais próximo
      nodes.sort((a, b) => distances[a] - distances[b]);
      let closestNode = nodes.shift();

      // Se a distância for infinita, o resto dos nós é inacessível
      if (distances[closestNode] === Infinity) break;

      visited.add(closestNode);

      // Atualiza a distância para os nós vizinhos
      for (let neighbor in graph[closestNode]) {
          if (!visited.has(neighbor)) {
              let newDistance = distances[closestNode] + graph[closestNode][neighbor];
              if (newDistance < distances[neighbor]) {
                  distances[neighbor] = newDistance;
                  previous[neighbor] = closestNode; // Atualiza o nó anterior
              }
          }
      }
  }

  return { distances, previous }; // Retorna as distâncias e os nós anteriores
}

// Função para reconstruir o caminho mínimo
function reconstructPath(previous, target) {
  const path = [];
  let current = target.toString();

  // Reconstroi o caminho, começando do nó de destino até o de origem
  while (current != null) {
      path.unshift(current);
      current = previous[current];
  }

  return path;
}

