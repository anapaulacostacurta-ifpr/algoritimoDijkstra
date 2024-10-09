// script.js

const nodes = [];
const edges = [];
const container = document.getElementById('mynetwork');
const data = { nodes, edges };
const options = { };


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
  return new vis.Network(container, data, options);
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

const graph = {
  A: { B: 1, C: 4 },       // Node A is connected to Node B with a weight of 1 and Node C with a weight of 4
  B: { A: 1, C: 2, D: 5 }, // ... and so on for other nodes
  C: { A: 4, B: 2, D: 1 },
  D: { B: 5, C: 1 }
};

function dijkstra(graph, start) {
  // Create an object to store the shortest distance from the start node to every other node
  let distances = {};

  // A set to keep track of all visited nodes
  let visited = new Set();

  // Get all the nodes of the graph
  let nodes = Object.keys(graph);

  // Initially, set the shortest distance to every node as Infinity
  for (let node of nodes) {
      distances[node] = Infinity;
  }
  
  // The distance from the start node to itself is 0
  distances[start] = 0;

  // Loop until all nodes are visited
  while (nodes.length) {
      // Sort nodes by distance and pick the closest unvisited node
      nodes.sort((a, b) => distances[a] - distances[b]);
      let closestNode = nodes.shift();

      // If the shortest distance to the closest node is still Infinity, then remaining nodes are unreachable and we can break
      if (distances[closestNode] === Infinity) break;

      // Mark the chosen node as visited
      visited.add(closestNode);

      // For each neighboring node of the current node
      for (let neighbor in graph[closestNode]) {
          // If the neighbor hasn't been visited yet
          if (!visited.has(neighbor)) {
              // Calculate tentative distance to the neighboring node
              let newDistance = distances[closestNode] + graph[closestNode][neighbor];
              
              // If the newly calculated distance is shorter than the previously known distance to this neighbor
              if (newDistance < distances[neighbor]) {
                  // Update the shortest distance to this neighbor
                  distances[neighbor] = newDistance;
              }
          }
      }
  }

  // Return the shortest distance from the start node to all nodes
  return distances;
}

// Example: Find shortest distances from node A to all other nodes in the graph
console.log(dijkstra(graph, "A")); // Outputs: { A: 0, B: 1, C: 3, D: 4 }