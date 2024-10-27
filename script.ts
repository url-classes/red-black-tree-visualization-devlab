class TreeNode {
    data: number;
    color: 'red' | 'black';
    left: TreeNode | null;
    right: TreeNode | null;
    parent: TreeNode | null;

    constructor(data: number, color: 'red' | 'black') {
        this.data = data;
        this.color = color;
        this.left = null;
        this.right = null;
        this.parent = null;
    }
}

class RedBlackTree {
    NIL: TreeNode;
    root: TreeNode;

    constructor() {
        this.NIL = new TreeNode(0, 'black');
        this.NIL.left = this.NIL;
        this.NIL.right = this.NIL;
        this.NIL.parent = null;
        this.root = this.NIL;
    }

    insert(data: number) {
        const newNode = new TreeNode(data, 'red');
        newNode.left = this.NIL;
        newNode.right = this.NIL;
        let y: TreeNode | null = null;
        let x = this.root;

        while (x !== this.NIL) {
            y = x;
            if (newNode.data < x.data) {
                x = x.left!;
            } else {
                x = x.right!;
            }
        }

        newNode.parent = y;
        if (y === null) {
            this.root = newNode;
        } else if (newNode.data < y.data) {
            y.left = newNode;
        } else {
            y.right = newNode;
        }

        newNode.color = 'red';
        this.fixInsert(newNode);
    }

    private fixInsert(k: TreeNode) {
        while (k.parent && k.parent.color === 'red') {
            if (k.parent === k.parent.parent?.left) {
                let u = k.parent.parent?.right ?? this.NIL;
                if (u.color === 'red') {
                    k.parent.color = 'black';
                    u.color = 'black';
                    k.parent.parent!.color = 'red';
                    k = k.parent.parent!;
                } else {
                    if (k === k.parent.right) {
                        k = k.parent;
                        this.rotateLeft(k);
                    }
                    k.parent!.color = 'black';
                    k.parent!.parent!.color = 'red';
                    this.rotateRight(k.parent!.parent!);
                }
            } else {
                let u = k.parent.parent?.left ?? this.NIL;
                if (u.color === 'red') {
                    k.parent.color = 'black';
                    u.color = 'black';
                    k.parent.parent!.color = 'red';
                    k = k.parent.parent!;
                } else {
                    if (k === k.parent.left) {
                        k = k.parent;
                        this.rotateRight(k);
                    }
                    k.parent!.color = 'black';
                    k.parent!.parent!.color = 'red';
                    this.rotateLeft(k.parent!.parent!);
                }
            }
        }
        this.root.color = 'black';
    }

    private rotateLeft(x: TreeNode) {
        let y = x.right!;
        x.right = y.left;
        if (y.left !== this.NIL) {
            y.left!.parent = x;
        }
        y.parent = x.parent;
        if (x.parent === null) {
            this.root = y;
        } else if (x === x.parent.left) {
            x.parent.left = y;
        } else {
            x.parent.right = y;
        }
        y.left = x;
        x.parent = y;
    }

    private rotateRight(y: TreeNode) {
        let x = y.left!;
        y.left = x.right;
        if (x.right !== this.NIL) {
            x.right!.parent = y;
        }
        x.parent = y.parent;
        if (y.parent === null) {
            this.root = x;
        } else if (y === y.parent.right) {
            y.parent.right = x;
        } else {
            y.parent.left = x;
        }
        x.right = y;
        y.parent = x;
    }

    search(data: number): TreeNode | null {
        let node = this.root;
        while (node !== this.NIL) {
            if (data === node.data) {
                return node;
            }
            node = data < node.data ? node.left! : node.right!;
        }
        return null;
    }

    inorder(node: TreeNode = this.root, result: number[] = []): number[] {
        if (node !== this.NIL) {
            this.inorder(node.left!, result);
            result.push(node.data);
            this.inorder(node.right!, result);
        }
        return result;
    }

    preorder(node: TreeNode = this.root, result: number[] = []): number[] {
        if (node !== this.NIL) {
            result.push(node.data);
            this.preorder(node.left!, result);
            this.preorder(node.right!, result);
        }
        return result;
    }

    postorder(node: TreeNode = this.root, result: number[] = []): number[] {
        if (node !== this.NIL) {
            this.postorder(node.left!, result);
            this.postorder(node.right!, result);
            result.push(node.data);
        }
        return result;
    }

    drawTree(ctx: CanvasRenderingContext2D) {
        if (this.root !== this.NIL) {
            this.drawNode(ctx, this.root, 400, 30, 200);
        }
    }

    private drawNode(ctx: CanvasRenderingContext2D, node: TreeNode, x: number, y: number, offset: number) {
        if (node === this.NIL) return;

        ctx.fillStyle = node.color === 'red' ? '#ff4d4d' : '#000';
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.fillText(node.data.toString(), x - 7, y + 5);

        if (node.left !== this.NIL) {
            ctx.strokeStyle = '#000';
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x - offset, y + 70);
            ctx.stroke();
            if (node.left) {
                this.drawNode(ctx, node.left, x - offset, y + 70, offset / 2);
            }
        }

        if (node.right !== this.NIL) {
            ctx.strokeStyle = '#000';
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + offset, y + 70);
            ctx.stroke();
            if (node.right) {
                this.drawNode(ctx, node.right, x + offset, y + 70, offset / 2);
            }
        }
    }
}
