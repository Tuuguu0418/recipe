import Search from "./model/Search";
import { elements, renderLoader, clearLoader } from "./view/base";
import * as searchView from "./view/searchView";
import Recipe from "./model/Recipe";
import List from "./model/List";
import * as listView from "./view/listView";
import Like from "./model/Like";
import * as likesView from "./view/likesView";
import {
  renderRecipe,
  clearRecipe,
  highlightSelectedRecipe,
} from "./view/recipeView";

// Web app tolow
// Hailtin query, ur dun
// Tuhain uzuulj bgaa jor
// like darsn joruud
// Zahialj bga jorin nairlaguud

const state = {};

const controlSearch = async () => {
  // 1. Webees hailtiin tulhuur ugig gargaj awna.
  const query = searchView.getInput();

  if (query) {
    // 2. Shineer hailtin object uusgej ogno.
    state.search = new Search(query);
    // 3. Hailt hiihed zoriulj UI g beldene.
    searchView.clearSearchQuery();
    searchView.clearSearchResult();
    renderLoader(elements.searchResultDiv);
    // 4. Hailtig guitsetgene.
    await state.search.doSearch();
    // 5. Hailtin ur dung delgetsend uzuulne.
    clearLoader();
    if (state.search.result === undefined) alert("Hailtaar ilertsgui");
    else searchView.renderRecipes(state.search.result);
  }
};

elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});

elements.pageButtons.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-inline");

  if (btn) {
    const gotoPageNumber = parseInt(btn.dataset.goto, 10);
    console.log(gotoPageNumber);
    searchView.clearSearchResult();
    searchView.renderRecipes(state.search.result, gotoPageNumber);
  }
});

// Jorin controller
const controlRecipe = async () => {
  // 1. URL aas id g salgah
  const id = window.location.hash.replace("#", "");

  // URl dr id bga esehig shalgana
  if (id) {
    // 2. Jorin model iig uusgej ogno
    state.recipe = new Recipe(id);
    // 3. UI delgetsig beltgene
    clearRecipe();
    renderLoader(elements.recipeDiv);
    highlightSelectedRecipe(id);
    // 4. Joroo tataj awcrana
    await state.recipe.getRecipe();
    // 5. Jorig guitsetgeh hugatsaa bolon ortsig toostsoolno
    clearLoader();
    state.recipe.calcTime();
    state.recipe.calcHuniiToo();
    // 6. Joroo delgetsend uzuulne
    renderRecipe(state.recipe, state.likes.isLiked(id));
  }
};

// window.addEventListener("hashchange", controlRecipe);
// window.addEventListener("load", controlRecipe);

["hashchange", "load"].forEach((e) =>
  window.addEventListener(e, controlRecipe)
);

window.addEventListener("load", (e) => {
  //Shiner like model iig app ehelhed uusgene.
  if (!state.likes) state.likes = new Like();

  likesView.toggleLikeMenu(state.likes.getNumberOfLikes());

  // Like uud bwl tsesig nemj haruulna
  state.likes.likes.forEach((like) => likesView.renderLike(like));
});
// Nairlagnii controller

const controlList = () => {
  // Nairlagni model iig uusgene.
  state.list = new List();
  listView.clearItems();
  state.recipe.ingredients.forEach((n) => {
    const item = state.list.addItem(n);
    // Tuhain nairlagig delgetsend haruulna
    listView.renderItem(item);
  });
};

const controlLike = () => {
  // 1. Like iin model iig uusgeh.
  if (!state.likes) state.likes = new Like();
  // 2. Odoo haragdaj bga jorin id g awah
  const currentRecipeId = state.recipe.id;
  // 3. Ene jorig like hiisen esehig shalgah
  if (state.likes.isLiked(currentRecipeId)) {
    state.likes.deleteLike(currentRecipeId);
    // Like iin tsesnees ustgana
    likesView.deleteLike(currentRecipeId);

    // Like towchnii like hiisn baidlig boliulah
    likesView.toggleLikeBtn(false);
  } else {
    const newLike = state.likes.addLike(
      currentRecipeId,
      state.recipe.title,
      state.recipe.publisher,
      state.recipe.image_url
    );

    likesView.renderLike(newLike);
    // Like towchnii like hiisn baidlig like hiisn bolgoh
    likesView.toggleLikeBtn(true);
  }

  likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
};

elements.recipeDiv.addEventListener("click", (e) => {
  if (e.target.matches(".recipe__btn, .recipe__btn *")) {
    controlList();
  } else if (e.target.matches(".recipe__love, .recipe__love * ")) {
    controlLike();
  }
});

elements.shoppingList.addEventListener("click", (e) => {
  // Click hiisen li elementin data-itemid attribute iig shuuj gargaj awna.
  const id = e.target.closest(".shopping__item").dataset.itemid;

  state.list.deleteItem(id);

  // Delgetsees iim id tai ortsig ustgana ustgana.
  listView.deleteItem(id);
});
