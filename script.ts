class RBNode {
    data: number | null;
    color: string;
    left: RBNode;
    right: RBNode;
    parent: RBNode | null;

    constructor(data: number | null) {
        this.data = data;
        this.color = 'red';
        this.left = this;  
        this.right = this; 
        this.parent = null;
    }
}

//implementacion del codigo que practicamos en clase 
class RedBlackTree {
    NIL: RBNode;
    root: RBNode;

    constructor() {
        this.NIL = new RBNode(null);
        this.NIL.color = 'black';
        this.NIL.left = this.NIL;
        this.NIL.right = this.NIL;
        this.root = this.NIL;
    }

    insert(data: number): void {
        const newNode = new RBNode(data);
        newNode.left = this.NIL;
        newNode.right = this.NIL;
        
        let y = this.NIL;
        let x = this.root;

        while (x !== this.NIL) {
            y = x;
            if (newNode.data! < x.data!) {
                x = x.left;
            } else {
                x = x.right;
            }
        }

        newNode.parent = y;
        if (y === this.NIL) {
            this.root = newNode;
        } else if (newNode.data! < y.data!) {
            y.left = newNode;
        } else {
            y.right = newNode;
        }

        newNode.color = 'red';
        this.fixInsert(newNode);
    }

    fixInsert(k: RBNode): void {
        while (k.parent && k.parent.color === 'red') { 
            if (k.parent === k.parent.parent?.left) { 
                let u = k.parent.parent?.right; 
                if (u && u.color === 'red') { 
                    k.parent.color = 'black';
                    u.color = 'black';
                    k.parent.parent.color = 'red';
                    k = k.parent.parent;
                } else {
                    if (k === k.parent.right) {
                        k = k.parent;
                        this.rotateLeft(k);
                    }
                    if (k.parent) { 
                        k.parent.color = 'black'; 
                        if (k.parent.parent) { 
                            k.parent.parent.color = 'red'; 
                            this.rotateRight(k.parent.parent!); 
                        }
                    }
                }
            } else {
                let u = k.parent.parent?.left; 
                if (u && u.color === 'red') { 
                    k.parent.color = 'black';
                    u.color = 'black';
                    if (k.parent.parent) { 
                        k.parent.parent.color = 'red'; 
                        k = k.parent.parent; 
                    }
                } else {
                    if (k === k.parent.left) {
                        k = k.parent;
                        this.rotateRight(k);
                    }
                    if (k.parent) { 
                        k.parent.color = 'black'; 
                        if (k.parent.parent) { 
                            k.parent.parent.color = 'red'; 
                            this.rotateLeft(k.parent.parent!); 
                        }
                    }
                }
            }
        }
        this.root.color = 'black';
    }

    rotateLeft(x: RBNode): void {
        let y = x.right;
        x.right = y.left;
        if (y.left !== this.NIL) {
            y.left.parent = x;
        }
        y.parent = x.parent;
        if (x.parent === this.NIL) {
            this.root = y;
        } else if (x.parent) { 
            if (x === x.parent.left) { 
                x.parent.left = y; 
            } else {
                x.parent.right = y; 
            }
        }
        y.left = x;
        x.parent = y;
    }

    rotateRight(y: RBNode): void {
        let x = y.left;
        y.left = x.right;
        if (x.right !== this.NIL) {
            x.right.parent = y;
        }
        x.parent = y.parent;
        if (y.parent === this.NIL) {
            this.root = x;
        } else if (y.parent) { 
            if (y === y.parent.right) {
                y.parent.right = x; 
            } else {
                y.parent.left = x; 
            }
        }
        x.right = y;
        y.parent = x;
    }

        search(data: number): boolean {
        let node = this.root;
        while (node !== this.NIL) {
            if (data === node.data) {
                return true;
            }
            if(node.data)
                node = data < node.data ? node.left : node.right;
        }
        return false;
    }

    visualize(ctx: CanvasRenderingContext2D): void {
        ctx.clearRect(0, 0, 800, 600);
        this.drawNode(ctx, this.root, 400, 50, 200);
    }

    drawNode(ctx: CanvasRenderingContext2D, node: RBNode, x: number, y: number, offset: number): void {
        if (node !== this.NIL) {
            ctx.fillStyle = node.color;
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "white";
            ctx.fillText(String(node.data), x - 7, y + 5);

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

    //aqui meter las partes de fernando y portillo en el recorridos
    inorder(node: RBNode = this.root, result: number[] = []): number[] {
        if (node !== this.NIL) {
            this.inorder(node.left!, result);
            if(node.data)
                result.push(node.data);
                this.inorder(node.right!, result);
        }
        return result;
    }

    preorder(node: RBNode = this.root, result: number[] = []): number[] {
        if (node !== this.NIL) {
            if(node.data)
                result.push(node.data);
                this.preorder(node.left!, result);
                this.preorder(node.right!, result);
        }
        return result;
    }

    postorder(node: RBNode = this.root, result: number[] = []): number[] {
        if (node !== this.NIL) {
            this.postorder(node.left!, result);
            this.postorder(node.right!, result);
            if(node.data)
                result.push(node.data);
        }
        return result;
    } 
}
