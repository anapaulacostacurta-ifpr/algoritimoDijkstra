// script.js

var nodes = [];
var edges = [];
var container = document.getElementById('mynetwork');
var network;
var data = { nodes, edges };
const options = {
  nodes:{
    fixed: {
      x:false,
      y:false
    },
  },
  edges:{
    arrows: {
      to: {
        enabled: true
      },
      from:{
        enabled: false
      }
    }
  }
};
var graph = {};


async function limparDados(){
  nodes = [];
  edges = [];   
  data = { nodes, edges };
}


async function addGraph() {
  limparDados();
  const qtdeNos = parseInt(document.getElementById('qtdeNos').value);
  for (let i = 0; i < qtdeNos; i++) {
    var weight = Math.floor(Math.random() * 2);; //Métrica aditiva: (atraso )
    var source = i;
    if(target <qtdeNos){
      if(source>0){
        carregarDados(source, source+2, weight+3);
      }else{
        if(source==qtdeNos){
          carregarDados(source, source-1, weight+2);
        }else{
          carregarDados(source, source+1, weight)+5;
        }
      }
    }
  }
  // Criar a visualização do grafo
  network = new vis.Network(container, data, options);
}

function carregarDados(source, target, weight){
  if (source != 0){
    if (!edges.find(edges => edges.from === source) || !edges.find(edges => edges.from === target)){
      if(!nodes.find(node => node.id === source)){
        nodes.push({ id: source, label: source.toString(), x: Math.random() * 800, y: Math.random() * 600 });
        graph[source] = {};
      }
      if(!nodes.find(node => node.id === target)){
        nodes.push({ id: target, label: target.toString(), x: Math.random() * 800, y: Math.random() * 600 }); // Posição inicial aleatória
        graph[target] = {};
      }
      edges.push({ from: source, to: target, weight: weight, label:weight.toString() });
      graph[source][target] = weight; 
    }
  }
}

// Função para encontrar o caminho mínimo
function findShortestPath() {
  const source = parseInt(document.getElementById('source').value);
  const target = parseInt(document.getElementById('target').value);
 
  let pos_source = nodes.findIndex(node => node.id === source);
  let pos_target = nodes.findIndex(node => node.id === target);
  if(pos_source == -1 || pos_target == -1){
    alert("source ou target não exite!");
    return [];
  }
  const { distances, previous } = dijkstra(source);
  
  // Reconstrói o caminho mínimo de A até D
  const path = reconstructPath(previous, target);

  alert('Caminho mínimo: '+path);
  
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
          if (!visited.has(neighbor)){
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

function movernode(){
    // get original positions
    var positions = network.getPositions();
    const nodeid = parseInt(document.getElementById('nodeid').value);
    edges.forEach(edge =>{
        if(edge.from == nodeid){
          console.log("Label anterior:"+edge.weight.toString());
          edge.weight = edge.weight+2; // + 2 segundos
          edge.label = edge.weight.toString();
          console.log("Label novo:"+edge.weight.toString());
          graph[edge.from][edge.to] = edge.weight+2;
        }
        if(edge.to == nodeid){
          console.log("Label anterior:"+edge.weight.toString());
          edge.weight = edge.weight+5; // + 5 segundos
          edge.label = edge.weight.toString();
          console.log("Label:"+edge.weight.toString());
          graph[edge.from][edge.to] = edge.weight+5;
        }
      }); 
      network = new vis.Network(container, data, options);
 
		  // get target positions 
			var x_target = positions[nodeid].x * (Math.random() * 5);
			var y_target = positions[nodeid].y * (Math.random() * 5);
			
			// compute the convex combination of x_start and x_target to find intermediate x and move node to it, same for y
			var xt = x_target * 0.5;
			var yt = y_target * 0.5;
			
			// move node
		  network.moveNode(nodeid,xt,yt);
  
}