export default class Likes {
  constructor() {
    this.readDatafromLocalStorage();

    if (!this.likes) this.likes = [];
  }

  addLike(id, title, publisher, img) {
    const like = { id, title, publisher, img };
    this.likes.push(like);
    this.saveDatatoLocalStorage();
    return like;
  }

  deleteLike(id) {
    const index = this.likes.findIndex((el) => el.id === id);
    this.likes.splice(index, 1);

    this.saveDatatoLocalStorage();
  }

  isLiked(id) {
    // if(this.likes.findIndex(el=>el.id ===id)===-1) return false;
    // else return true;

    return this.likes.findIndex((el) => el.id === id) !== -1;
  }

  getNumberOfLikes() {
    return this.likes.length;
  }

  saveDatatoLocalStorage() {
    localStorage.setItem("likes", JSON.stringify(this.likes));
  }

  readDatafromLocalStorage() {
    this.likes = JSON.parse(localStorage.getItem("likes"));
  }
}
