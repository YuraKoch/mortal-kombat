export class ResourceManager {
  constructor(limit = 20) {
    this.images = {};
    this.limit = limit;
    this.urlsToLoad = [];
  }

  async loadImages(urls) {
    this.urlsToLoad = [...urls];
    const promises = [];
    for (let i = 0; i < this.limit; i++) {
      promises.push(this.loadNextImage());
    }
    await Promise.all(promises);
  }

  async loadNextImage() {
    if (this.urlsToLoad.length === 0) return;
    const url = this.urlsToLoad.pop();
    await this.loadImage(url);
    await this.loadNextImage();
  };

  async loadImage(url) {
    const img = new Image();
    img.src = url;
    this.images[url] = img;
    await new Promise(resolve => {
      img.onload = resolve;
      img.onerror = () => this.loadImage(url).then(resolve);
    });
  };

  getImage(url) {
    return this.images[url];
  }
}