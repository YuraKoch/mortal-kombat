export class ResourceManager {
  images = {};
  limit = 20;
  counter = 0;

  async loadImages(urls) {
    const urlsToLoad = [...urls];

    while (urlsToLoad.length > 0) {
      if (this.counter < this.limit) {
        this.counter++;
        const url = urlsToLoad.pop();
        this.loadImage(url).then(() => {
          this.counter--;
        });
      } else {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }
  }

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