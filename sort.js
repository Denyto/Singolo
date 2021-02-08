const container = document.querySelector(".image-list");
let arrayImgUrl = [],
items = 12;//подразумевается что это импорт???

const addArray = (items) => {
  for (let i = 1; i <= items; i++)
    arrayImgUrl.push(
      `<img src="./assets/img/portfolio-${i}.png" alt="circle"></img>`
    );
};

const clear = () => {
  container.innerHTML = "";
};

function getListContent() {
  let fragment = new DocumentFragment();
  for (let i = 0; i <= items - 1; i++) {
    let li = document.createElement("li");
    li.classList.add("image");
    li.innerHTML = arrayImgUrl[i];
    fragment.append(li);
  }
  return fragment;
}

const getSortImageList = () => {
  let fragment = new DocumentFragment();
  let ar = arrayImgUrl.sort(function () {
    return Math.random() - 0.5;
  });
  for (let i = 0; i <= items - 1; i++) {
    let li = document.createElement("li");
    li.classList.add("image");
    li.innerHTML = ar[i];
    fragment.append(li);
  }
  return fragment;
};

const removeTag = () => {
  let tags = document.querySelectorAll(".nav-portfolio .tag");
  tags.forEach((tag) => {
    tag.classList.remove("tag-selected");
    tag.classList.add("tag-inactive");
  });
};

const selectTag = (clickedTag) => {
  clickedTag.classList.add("tag-selected");
  clickedTag.classList.remove("tag-inactive");
};

function addTagClickHandler() {
  let tags = document.querySelector(".nav-portfolio");
  tags.addEventListener("click", (e) => {
    if (e.target.classList.contains("tag")) {
      let clickedTag = e.target;
      removeTag();
      selectTag(clickedTag);
      clear();
      container.append(getSortImageList());
    }
  });
}
addArray(items);
addTagClickHandler();
container.append(getListContent());
