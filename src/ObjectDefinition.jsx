class ObjectDefinition {
  constructor({ position, scale, rotation, updateCb }) {
    this.position = position;
    this.scale = scale;
    this.rotation = rotation;
  }

  update(ms) {
    this.updateCb(ms);
  }
};

export default ObjectDefinition;
