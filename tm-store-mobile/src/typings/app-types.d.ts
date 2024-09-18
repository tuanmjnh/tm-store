declare namespace AppTypes {
  //Tree
  type TreeViewSelectionMode = "independent" | "leaf";
  interface TreeViewNodeItem {
    id: number;
    name: string;
    icon?: string;
    checked?: boolean;
    disabled?: boolean;
    children?: TreeViewNodeItem[];
  }
}