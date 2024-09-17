export const applyToAllChildren = (
  currentNode: AppTypes.TreeViewNodeItem,
  key: string,
  fn: (id: any) => void
) => {
  if (currentNode.children) {
    for (const child of currentNode.children) {
      fn(child[key]);
      if (child.children) applyToAllChildren(child, key, fn);
    }
  }
};

export const gatherAllNodeIds = (
  currentNode: AppTypes.TreeViewNodeItem,
  key: string,
  res: any[]
) => {
  if (currentNode.children) {
    for (const child of currentNode.children) {
      res = [...res, child[key]];
      if (child.children) res = [...res, ...gatherAllNodeIds(child, key, res)];
    }
  }
  return [...res, currentNode[key]];
};

export const checkAllChildrenSelected = (
  selectedNodes: Set<any>,
  currentNode: AppTypes.TreeViewNodeItem,
  key: string,
  status: boolean
): boolean => {
  if (currentNode.children) {
    for (const child of currentNode.children) {
      if (child.children) {
        status =
          status &&
          selectedNodes!.has(child[key]) &&
          checkAllChildrenSelected(selectedNodes, child, key, status);
      } else {
        status = status && selectedNodes!.has(child[key]);
      }
    }
  }
  return status;
};

export const checkAtLeastOneChildSelected = (
  selectedNodes: Set<any>,
  currentNode: AppTypes.TreeViewNodeItem,
  key: string,
  status: boolean
): boolean => {
  if (currentNode.children) {
    for (const child of currentNode.children) {
      if (child.children) {
        status =
          status ||
          selectedNodes!.has(child[key]) ||
          checkAtLeastOneChildSelected(selectedNodes, child, key, status);
      } else {
        status = status || selectedNodes!.has(child[key]);
      }
    }
  }
  return status;
};

export const checkChildSelectStatus = (
  selectedNodes: Set<any>,
  item: AppTypes.TreeViewNodeItem,
  key: string,
  type: "all" | "atLeastOne"
) => {
  return type === "all"
    ? checkAllChildrenSelected(selectedNodes, item, key, true)
    : checkAtLeastOneChildSelected(selectedNodes, item, key, false);
};