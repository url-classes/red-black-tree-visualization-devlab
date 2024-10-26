"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedBlackNode = exports.RedBlackTree = void 0;
class RedBlackNode {
    constructor(value) {
        this.value = value;
        this.color = 'RED';
        this.left = null;
        this.right = null;
        this.parent = null;
    }
}
exports.RedBlackNode = RedBlackNode;
class RedBlackTree {
    constructor() {
        this.root = null;
    }
    insert(value) {
        const newNode = new RedBlackNode(value);
        if (!this.root) {
            this.root = newNode;
            this.root.color = 'BLACK';
        }
        else {
            let current = this.root;
            while (current) {
                if (value < current.value) {
                    if (!current.left) {
                        current.left = newNode;
                        newNode.parent = current;
                        break;
                    }
                    current = current.left;
                }
                else {
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
    rotateLeft(node) {
        const rightChild = node.right;
        if (!rightChild)
            return;
        node.right = rightChild.left;
        if (rightChild.left)
            rightChild.left.parent = node;
        rightChild.parent = node.parent;
        if (!node.parent) {
            this.root = rightChild;
        }
        else if (node === node.parent.left) {
            node.parent.left = rightChild;
        }
        else {
            node.parent.right = rightChild;
        }
        rightChild.left = node;
        node.parent = rightChild;
    }
    rotateRight(node) {
        const leftChild = node.left;
        if (!leftChild)
            return;
        node.left = leftChild.right;
        if (leftChild.right)
            leftChild.right.parent = node;
        leftChild.parent = node.parent;
        if (!node.parent) {
            this.root = leftChild;
        }
        else if (node === node.parent.right) {
            node.parent.right = leftChild;
        }
        else {
            node.parent.left = leftChild;
        }
        leftChild.right = node;
        node.parent = leftChild;
    }
    fixInsert(node) {
        while (node.parent && node.parent.color === 'RED') {
            const grandparent = node.parent.parent;
            if (!grandparent)
                break;
            if (node.parent === grandparent.left) {
                const uncle = grandparent.right;
                if (uncle && uncle.color === 'RED') {
                    node.parent.color = 'BLACK';
                    uncle.color = 'BLACK';
                    grandparent.color = 'RED';
                    node = grandparent;
                }
                else {
                    if (node === node.parent.right) {
                        node = node.parent;
                        this.rotateLeft(node);
                    }
                    if (node.parent)
                        node.parent.color = 'BLACK'; // check for null
                    grandparent.color = 'RED';
                    this.rotateRight(grandparent);
                }
            }
            else {
                const uncle = grandparent.left;
                if (uncle && uncle.color === 'RED') {
                    node.parent.color = 'BLACK';
                    uncle.color = 'BLACK';
                    grandparent.color = 'RED';
                    node = grandparent;
                }
                else {
                    if (node === node.parent.left) {
                        node = node.parent;
                        this.rotateRight(node);
                    }
                    if (node.parent)
                        node.parent.color = 'BLACK'; // check for null
                    grandparent.color = 'RED';
                    this.rotateLeft(grandparent);
                }
            }
        }
        if (this.root)
            this.root.color = 'BLACK';
    }
    getRoot() {
        return this.root;
    }
}
exports.RedBlackTree = RedBlackTree;
