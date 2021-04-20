import FileTree from './fileTree';

export function createFileTree(input) {

  const fileTree = new FileTree();

  const newArr = [...input]
  const arr = newArr.splice(0, 1)
  let ID = arr[0].id

  // let children = input.filter(item => item.parentId)
  // let rootDir = input.filter(item => !item.parenId)
  // let sortedChildren = children.sort((a, b) => a.id - b.id)
  // let arr = rootDir.concat(sortedChildren)

  for (let i = 0; i < newArr.length; i += 1 ) {
    const node = newArr.find(el => el.parentId === ID);
    arr.push(node);
    ID = node.id;
  }
  

  for (const inputNode of arr) {
    const parentNode = inputNode.parentId
      ? fileTree.findNodeById(inputNode.parentId)
      : null;

    fileTree.createNode(
      inputNode.id,
      inputNode.name,
      inputNode.type,
      parentNode
    );
  }

  return fileTree;
}

