class Node {
    constructor(data) {
        this.data = data;
        this.color = 'red'; 
        this.left = null;
        this.right = null;
        this.parent = null;
    }
}

class RedBlackTree {
    constructor() {
        this.NIL = new Node(null); 
        this.NIL.color = 'black';
        this.root = this.NIL;
    }

    
    insert(data) {
        const newNode = new Node(data);
        newNode.left = this.NIL;
        newNode.right = this.NIL;

        let y = this.NIL;
        let x = this.root;

       
        while (x !== this.NIL) {
            y = x;
            if (newNode.data < x.data) {
                x = x.left;
            } else {
                x = x.right;
            }
        }

        newNode.parent = y;
        if (y === this.NIL) {
            this.root = newNode; 
        } else if (newNode.data < y.data) {
            y.left = newNode;
        } else {
            y.right = newNode;
        }

        newNode.color = 'red'; // Nuevo nodo es rojo
        this.fixInsert(newNode); // Balancear el árbol
    }

    // Método para arreglar el árbol después de la inserción
    fixInsert(k) {
        while (k.parent.color === 'red') {
            if (k.parent === k.parent.parent.left) {
                let u = k.parent.parent.right; // Tío
                if (u.color === 'red') { // Caso 1: Tío rojo
                    k.parent.color = 'black';
                    u.color = 'black';
                    k.parent.parent.color = 'red';
                    k = k.parent.parent;
                } else {
                    if (k === k.parent.right) { // Caso 2: K es hijo derecho
                        k = k.parent;
                        this.rotateLeft(k);
                    }
                    // Caso 3: K es hijo izquierdo
                    k.parent.color = 'black';
                    k.parent.parent.color = 'red';
                    this.rotateRight(k.parent.parent);
                }
            } else {
                let u = k.parent.parent.left; // Tío
                if (u.color === 'red') { // Caso 1: Tío rojo
                    k.parent.color = 'black';
                    u.color = 'black';
                    k.parent.parent.color = 'red';
                    k = k.parent.parent;
                } else {
                    if (k === k.parent.left) { // Caso 2: K es hijo izquierdo
                        k = k.parent;
                        this.rotateRight(k);
                    }
                    // Caso 3: K es hijo derecho
                    k.parent.color = 'black';
                    k.parent.parent.color = 'red';
                    this.rotateLeft(k.parent.parent);
                }
            }
        }
        this.root.color = 'black'; // Asegurar que la raíz sea negra
    }

    // Rotación a la izquierda
    rotateLeft(x) {
        let y = x.right;
        x.right = y.left;
        if (y.left !== this.NIL) {
            y.left.parent = x;
        }
        y.parent = x.parent;
        if (x.parent === this.NIL) {
            this.root = y;
        } else if (x === x.parent.left) {
            x.parent.left = y;
        } else {
            x.parent.right = y;
        }
        y.left = x;
        x.parent = y;
    }

    // Rotación a la derecha
    rotateRight(y) {
        let x = y.left;
        y.left = x.right;
        if (x.right !== this.NIL) {
            x.right.parent = y;
        }
        x.parent = y.parent;
        if (y.parent === this.NIL) {
            this.root = x;
        } else if (y === y.parent.right) {
            y.parent.right = x;
        } else {
            y.parent.left = x;
        }
        x.right = y;
        y.parent = x;
    }

    // Método para buscar un número
    search(data) {
        let node = this.root;
        while (node !== this.NIL) {
            if (data === node.data) {
                return true; // Encontrado
            }
            node = data < node.data ? node.left : node.right;
        }
        return false; // No encontrado
    }

    // Método para visualizar el árbol
    visualize(ctx) {
        ctx.clearRect(0, 0, 800, 600);
        this.drawNode(ctx, this.root, 400, 50, 200);
    }

    // Método recursivo para dibujar nodos
    drawNode(ctx, node, x, y, offset) {
        if (node !== this.NIL) {
            ctx.fillStyle = node.color;
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "white";
            ctx.fillText(node.data, x - 7, y + 5);

            if (node.left !== this.NIL) {
                ctx.beginPath();
                ctx.moveTo(x, y + 20);
                ctx.lineTo(x - offset, y + 70);
                ctx.stroke();
                this.drawNode(ctx, node.left, x - offset, y + 70, offset / 2);
            }
            if (node.right !== this.NIL) {
                ctx.beginPath();
                ctx.moveTo(x, y + 20);
                ctx.lineTo(x + offset, y + 70);
                ctx.stroke();
                this.drawNode(ctx, node.right, x + offset, y + 70, offset / 2);
            }
        }
    }

    // Recorridos
    inorder(node, result) {
        if (node !== this.NIL) {
            this.inorder(node.left, result);
            result.push(node.data);
            this.inorder(node.right, result);
        }
    }

    preorder(node, result) {
        if (node !== this.NIL) {
            result.push(node.data);
            this.preorder(node.left, result);
            this.preorder(node.right, result);
        }
    }

    postorder(node, result) {
        if (node !== this.NIL) {
            this.postorder(node.left, result);
            this.postorder(node.right, result);
            result.push(node.data);
        }
    }
}

// Inicialización del árbol y el canvas
const tree = new RedBlackTree();
const canvas = document.getElementById("treeCanvas");
const ctx = canvas.getContext("2d");

document.getElementById("insertButton").onclick = function() {
    const value = parseInt(document.getElementById("value").value);
    if (!isNaN(value)) {
        tree.insert(value);
        tree.visualize(ctx);
        document.getElementById("value").value = ""; // Limpiar campo de entrada
    }
};

document.getElementById("searchButton").onclick = function() {
    const value = parseInt(document.getElementById("value").value);
    if (!isNaN(value)) {
        const found = tree.search(value);
        const output = document.getElementById("output");
        output.textContent = found ? `Número ${value} encontrado.` : `Número ${value} no encontrado.`;
    }
};

document.getElementById("inorderButton").onclick = function() {
    const result = [];
    tree.inorder(tree.root, result);
    document.getElementById("output").textContent = `Recorrido Inorden: ${result.join(', ')}`;
};

document.getElementById("preorderButton").onclick = function() {
    const result = [];
    tree.preorder(tree.root, result);
    document.getElementById("output").textContent = `Recorrido Preorden: ${result.join(', ')}`;
};

document.getElementById("postorderButton").onclick = function() {
    const result = [];
    tree.postorder(tree.root, result);
    document.getElementById("output").textContent = `Recorrido Postorden: ${result.join(', ')}`;
};
