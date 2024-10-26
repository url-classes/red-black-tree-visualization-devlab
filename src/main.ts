import * as d3 from 'd3';

// Definición de clases para el árbol rojo-negro
class RedBlackNode {
  public value: number;
  public color: 'RED' | 'BLACK';
  public left: RedBlackNode | null = null;
  public right: RedBlackNode | null = null;
  public parent: RedBlackNode | null = null;
  public x: number = 0;  // Coordenada x para visualización
  public y: number = 0;  // Coordenada y para visualización

  constructor(value: number) {
    this.value = value;
    this.color = 'RED';
  }
}

class RedBlackTree {
  private root: RedBlackNode | null = null;

  insert(value: number): void {
    const newNode = new RedBlackNode(value);
    if (!this.root) {
      this.root = newNode;
      this.root.color = 'BLACK';
    } else {
      let current: RedBlackNode | null = this.root;
      while (current) {
        if (value < current.value) {
          if (!current.left) {
            current.left = newNode;
            newNode.parent = current;
            break;
          }
          current = current.left;
        } else {
          if (!current.right) {
            current.right = newNode;
            newNode.parent = current;
            break;
          }
          current = current.right;
        }
      }
      this.fixInsert(newNode);
    }
  }

  private rotateLeft(node: RedBlackNode): void {
    const rightChild = node.right;
    if (!rightChild) return;
    node.right = rightChild.left;
    if (rightChild.left) rightChild.left.parent = node;
    rightChild.parent = node.parent;
    if (!node.parent) {
      this.root = rightChild;
    } else if (node === node.parent.left) {
      node.parent.left = rightChild;
    } else {
      node.parent.right = rightChild;
    }
    rightChild.left = node;
    node.parent = rightChild;
  }

  private rotateRight(node: RedBlackNode): void {
    const leftChild = node.left;
    if (!leftChild) return;
    node.left = leftChild.right;
    if (leftChild.right) leftChild.right.parent = node;
    leftChild.parent = node.parent;
    if (!node.parent) {
      this.root = leftChild;
    } else if (node === node.parent.right) {
      node.parent.right = leftChild;
    } else {
      node.parent.left = leftChild;
    }
    leftChild.right = node;
    node.parent = leftChild;
  }

  private fixInsert(node: RedBlackNode): void {
    while (node.parent && node.parent.color === 'RED') {
      const grandparent = node.parent.parent;
      if (!grandparent) break;
      if (node.parent === grandparent.left) {
        const uncle = grandparent.right;
        if (uncle && uncle.color === 'RED') {
          node.parent.color = 'BLACK';
          uncle.color = 'BLACK';
          grandparent.color = 'RED';
          node = grandparent;
        } else {
          if (node === node.parent.right) {
            node = node.parent;
            this.rotateLeft(node);
          }
          if (node.parent) node.parent.color = 'BLACK';
          grandparent.color = 'RED';
          this.rotateRight(grandparent);
        }
      } else {
        const uncle = grandparent.left;
        if (uncle && uncle.color === 'RED') {
          node.parent.color = 'BLACK';
          uncle.color = 'BLACK';
          grandparent.color = 'RED';
          node = grandparent;
        } else {
          if (node === node.parent.left) {
            node = node.parent;
            this.rotateRight(node);
          }
          if (node.parent) node.parent.color = 'BLACK';
          grandparent.color = 'RED';
          this.rotateLeft(grandparent);
        }
      }
    }
    if (this.root) this.root.color = 'BLACK';
  }

  getRoot(): RedBlackNode | null {
    return this.root;
  }

  // Obtiene los enlaces entre nodos para visualización
  getLinks(): Link[] {
    const links: Link[] = [];
    if (this.root) {
      this.traverseAndCollectLinks(this.root, links);
    }
    return links;
  }

  private traverseAndCollectLinks(node: RedBlackNode, links: Link[]): void {
    if (node.left) {
      links.push({ source: node, target: node.left });
      this.traverseAndCollectLinks(node.left, links);
    }
    if (node.right) {
      links.push({ source: node, target: node.right });
      this.traverseAndCollectLinks(node.right, links);
    }
  }

  // Obtiene todos los nodos para visualización
  getNodes(): RedBlackNode[] {
    const nodes: RedBlackNode[] = [];
    if (this.root) {
      this.traverseAndCollectNodes(this.root, nodes);
    }
    return nodes;
  }

  private traverseAndCollectNodes(node: RedBlackNode, nodes: RedBlackNode[]): void {
    nodes.push(node);
    if (node.left) this.traverseAndCollectNodes(node.left, nodes);
    if (node.right) this.traverseAndCollectNodes(node.right, nodes);
  }
}

// Interfaces para los tipos de datos de D3
interface Node {
  x: number;
  y: number;
}

interface Link {
  source: Node;
  target: Node;
}

// Función para visualizar el árbol en el SVG
function renderTree(tree: RedBlackTree): void {
  const links = tree.getLinks();
  const nodes = tree.getNodes();

  // Seleccionar el SVG
  const svg = d3.select('#tree')
    .attr('width', 800)
    .attr('height', 600);

  // Limpiar el SVG antes de redibujar
  svg.selectAll('*').remove();

  // Dibujar enlaces
  svg.selectAll('line')
    .data(links)
    .enter()
    .append('line')
    .attr('x1', (d) => d.source.x)
    .attr('y1', (d) => d.source.y)
    .attr('x2', (d) => d.target.x)
    .attr('y2', (d) => d.target.y)
    .attr('stroke', 'black');

  // Dibujar nodos
  svg.selectAll('circle')
    .data(nodes) // Usar los nodos directamente
    .enter()
    .append('circle')
    .attr('cx', (d) => d.x)
    .attr('cy', (d) => d.y)
    .attr('r', 10)
    .attr('fill', (d: RedBlackNode) => d.color === 'RED' ? 'red' : 'black');
}

// Ejemplo de uso
const tree = new RedBlackTree();
tree.insert(10);
tree.insert(5);
tree.insert(15);
tree.insert(3);
tree.insert(8);
tree.insert(13);
tree.insert(18);

// Renderiza el árbol
renderTree(tree);
console.log()