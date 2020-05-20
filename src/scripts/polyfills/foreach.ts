if (window.NodeList && !NodeList.prototype.forEach) {
  const noed: any = NodeList;

  noed.prototype.forEach = Array.prototype.forEach;
}
