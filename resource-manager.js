import { MOVE_TYPES, ORIENTATIONS, IMAGE_COUNT_BY_MOVE_TYPE } from "./constants.js";

export class ResourceManager {
  images = {};

  async loadFighterImages(fighterName) {
    this.images[fighterName] = {
      [ORIENTATIONS.LEFT]: {},
      [ORIENTATIONS.RIGHT]: {},
    };

    for (let moveName in MOVE_TYPES) {
      const moveType = MOVE_TYPES[moveName];
      this.images[fighterName][ORIENTATIONS.LEFT][moveType] = {};
      await this.loadImages(fighterName, ORIENTATIONS.LEFT, moveType);
      this.images[fighterName][ORIENTATIONS.RIGHT][moveType] = {};
      await this.loadImages(fighterName, ORIENTATIONS.RIGHT, moveType);
    }
  }

  async loadImages(fighterName, orientation, moveType) {
    const imagePromises = [];

    const totalCount = IMAGE_COUNT_BY_MOVE_TYPE[moveType];
    for (let i = 0; i < totalCount; i++) {
      const img = new Image();
      img.src = `./images/fighters/${fighterName}/${orientation}/${moveType}/${i}.png`;
      this.images[fighterName][orientation][moveType][i] = img;
      imagePromises.push(new Promise(resolve => img.onload = resolve));
    }

    await Promise.all(imagePromises);
  };

  getImage(fighterName, orientation, moveType, index) {
    return this.images[fighterName][orientation][moveType][index];
  }
}