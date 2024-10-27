# Descrição do trabalho
## Fase 1: 
O trabalho terá como entrada um arquivo texto (data.txt) do tipo:

- Cada linha com “ORIGEM    DESTINO    PESO_DO_ENLACE”
- A ultima linha será em branco.

Exemplo:   
   1 2 1
   1 4 1
   2 3 1
   2 4 1
   3 4 1

- O trabalho deverá:

1. Apresentar de forma visual o grafo de entrada.
2. Requisitar o ponto de origem e de destino.
3. Apresentar o menor caminho entre os dois pontos, com todos os pontos intermediários.
4. Voltar ao 2.

## Fase 2
Considerando uma rede sem fio faça uma proposta de como seria a descoberta do grafo da rede

Implemente essa proposta usando como base para o seu algoritmo de escolha do menor caminho

Dados de entrada: números de nós

- Criar uma topologia aleatória
- Criar tabela de roteamento em cada nó para todos os destinos da rede com a menor rota (valor dos enlaces = 1)

Requisitos: implementar a descoberta da topologia de forma distribuída, mostrar as mensagens trocadas entre o nó origem e demais nós para a descoberta da topologia pelo nó origem

Apresentar: grafo da rede, tabela de roteamento de cada um dos nós

## Fase 3 

**REFÊRENCIAS:**
[1] VIS.JS. **BIBLIOTECA VIS NETWORK.** Disponível em: https://visjs.github.io/vis-network/docs/network/. Acesso em: 14/10/2024.
