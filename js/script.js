// script.js

const nodes = [];
const edges = [];
const container = document.getElementById('mynetwork');
const data = { nodes, edges };
const options = {
  edges:{
    arrows: 'to, from',
    color: {
      color:'#848484',
      highlight:'#848484',
      hover: '#848484',
      inherit: 'from',
      opacity:1.0
    },
    font: '12px arial #ff0000',
    scaling:{
      label: true,
    },
    shadow: true,
    smooth: true,
  },
  nodes:{
    color: {
      border: '#2B7CE9',
      background: '#97C2FC',
      highlight: {
        border: '#2B7CE9',
        background: '#D2E5FF'
      },
      hover: {
        border: '#2B7CE9',
        background: '#D2E5FF'
      }
    },
    fixed: false,
    font: '12px arial red',
    scaling: {
      label: true
    },
    shadow: true
  } 
};

const graph ={};

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
        nodes.push({ id: source});
  
      }
      if(!nodes.find(node => node.id === target)){
        nodes.push({ id: target});
      }
      edges.push({ from: source, to: target, weight });
    }
  });

  // Criar a visualização do grafo
  return new vis.Network(container, data, options);
}

// Função para encontrar o caminho mínimo
function findShortestPath() {
  const source = parseInt(document.getElementById('source').value);
  const target = parseInt(document.getElementById('target').value);
 
  graph = convertGraphToAdjacencyList(nodes, edges);
  
  const { distances, previous } = dijkstra(graph, source);
  
  // Reconstrói o caminho mínimo de A até D
  const path = reconstructPath(previous, target);

  console.log("Caminho mínimo:", path); // Exibe o caminho mínimo
  
  // Suponha que 'network' e 'data' sejam as variáveis que representam o grafo visualizado
  visualizeShortestPath(path); // Destaca o caminho mínimo na visualização
}


// Função para converter o grafo de formato de lista de adjacências para o formato anterior (nós e arestas)
function convertGraphToAdjacencyList(nodes, edges) {

  // Inicializa o grafo com os nós
  nodes.forEach(node => {
      graph[node.id] = {};
  });

  // Popula as arestas no formato de lista de adjacências
  edges.forEach(edge => {
      graph[edge.from][edge.to] = edge.weight;
      graph[edge.to][edge.from] = edge.weight; // Supondo que o grafo seja não-direcionado
  });

  return graph;
}

// Função de Dijkstra para calcular a menor distância
function dijkstra(graph, start) {
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
  let current = target;

  // Reconstroi o caminho, começando do nó de destino até o de origem
  while (current != null) {
      path.unshift(current);
      current = previous[current];
  }

  return path;
}

// Função para visualizar o caminho mínimo no grafo
function visualizeShortestPath(path) {
  const highlightedEdges = [];

  // Constrói as arestas que formam o caminho mínimo
  for (let i = 0; i < path.length - 1; i++) {
      highlightedEdges.push({ from: path[i], to: path[i + 1] });
  }

  // Define as opções de visualização (arestas em vermelho)
  //network.setOptions({ edges: { color: { color: '#ff0000' } } });

  // Atualiza os dados da visualização com as arestas destacadas
  network.setData({ edges: [...data.edges, ...highlightedEdges] });
}


// Carregar o grafo inicial
const network = (loadGraph('./assets/data.txt'));