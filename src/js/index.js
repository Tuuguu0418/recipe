import Search from "./model/Search";
import { elements, renderLoader, clearLoader } from "./view/base";
import * as searchView from "./view/searchView";

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
