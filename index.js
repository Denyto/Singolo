const menu = document.getElementById("menu");

menu.addEventListener("click", (event) => {
  menu
    .querySelectorAll("a")
    .forEach((el) => el.classList.remove("navigation-link-colored"));
  event.target.classList.add("navigation-link-colored");
  menu
    .querySelectorAll("li")
    .forEach((el) => el.classList.remove("navigation-link-colored"));
});

window.onload = function () {
  console.log("Hello!");
  addTagsClickHandler();
};

const addTagsClickHandler = () => {
  document.querySelector(".nav-portfolio").addEventListener("click", (e) => {
    if (e.target.classList.contains("tag")) {
        let clickedTag = e.target;
        removeSelectedTags();
        selectClickedTag(clickedTag);
        if (clickedTag.innerText === 'All') {
            showAllStrategies();
        } else {
            filterStrategyBySelectedTag(clickedTag.innerText);
        }
    }
  });
};
const removeSelectedTags = () => {
    let tags = document.querySelectorAll('.nav-portfolio .tag');
    tags.forEach(tag => {
        tag.classList.remove('tag-selected');
        tag.classList.add('tag-inactive');
    })
}
const selectClickedTag = (clickedTag) => {
    clickedTag.classList.add("tag-selected");
    clickedTag.classList.remove("tag-inactive");
  }

  const showAllStrategies = () => {

  }

  const filterStrategyBySelectedTag = (selectedTag) => {

  }
