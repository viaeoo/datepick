if (!Element.prototype.matches) {
  const proto: any = Element.prototype;

  Element.prototype.matches = proto.msMatchesSelector || proto.webkitMatchesSelector;
}
