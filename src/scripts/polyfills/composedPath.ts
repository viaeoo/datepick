if (!Event.prototype.composedPath) {
  const getComposedPath: any = function (node: any) {
    let parent: any;

    if (node.parentNode) {
      parent = node.parentNode;
    } else if (node.host) {
      parent = node.host;
    } else if (node.defaultView) {
      parent = node.defaultView;
    }

    if (parent !== undefined) {
      return [node].concat(getComposedPath(parent));
    }

    return [node];
  };

  Event.prototype.composedPath = function () {
    return getComposedPath(this.target);
  };
}
