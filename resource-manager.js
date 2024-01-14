export class ResourceManager {
  images = {};
  limit = 20;

  async loadImages(urls) {
    const urlsToLoad = [...urls];
    const promises = [];
    for (let i = 0; i < this.limit; i++) {
      promises.push(this.loadNextImage(urlsToLoad));
    }
    await Promise.all(promises);
  }

  async loadNextImage(urlsToLoad) {
    if (urlsToLoad.length === 0) return;
    const url = urlsToLoad.pop();
    await this.loadImage(url);
    await this.loadNextImage(urlsToLoad);
  };

  async loadImage(url) {
    const img = new Image();
    img.src = url;
    this.images[url] = img;
    await new Promise(resolve => {
      img.onload = resolve;
      img.onerror = () => {
        console.warn(`Error loading image at URL: ${url}. Retrying...`);
        this.loadImage(url).then(resolve);
      };
    });
  };

  getImage(url) {
    return this.images[url];
  }
}