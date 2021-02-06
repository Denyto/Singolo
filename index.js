"use strict";
let hamburger = document.querySelector(".hamburger");
let menu = document.querySelector(".menu-box");
let logo = document.querySelector(".logotype");
let singolo = document.querySelector(".singolo");

hamburger.addEventListener("click", function () {
  hamburger.classList.toggle("rotate");
  menu.classList.toggle("available");
});

let isOpen = false;

hamburger.onclick = function () {
  isOpen = !isOpen;

  menu.style.height = isOpen ? "250px" : "0px";
  menu.style.opacity = isOpen ? "1" : "0";
};

var multiItemSlider = (function () {
  function _isElementVisible(element) {
    var rect = element.getBoundingClientRect(),
      vWidth = window.innerWidth || doc.documentElement.clientWidth,
      vHeight = window.innerHeight || doc.documentElement.clientHeight,
      elemFromPoint = function (x, y) {
        return document.elementFromPoint(x, y);
      };
    if (
      rect.right < 0 ||
      rect.bottom < 0 ||
      rect.left > vWidth ||
      rect.top > vHeight
    )
      return false;
    return (
      element.contains(elemFromPoint(rect.left, rect.top)) ||
      element.contains(elemFromPoint(rect.right, rect.top)) ||
      element.contains(elemFromPoint(rect.right, rect.bottom)) ||
      element.contains(elemFromPoint(rect.left, rect.bottom))
    );
  }

  return function (selector, config) {
    var _mainElement = document.querySelector(selector), // основный элемент блока
      _sliderWrapper = _mainElement.querySelector(".slider-new-wrapper"), // обертка для .slider-item
      _sliderItems = _mainElement.querySelectorAll(".slider__item"), // элементы (.slider-item)
      _sliderControls = _mainElement.querySelectorAll(".slider__control"), // элементы управления
      _sliderControlLeft = _mainElement.querySelector(".slider__control_right"), // кнопка "LEFT"
      _sliderControlRight = _mainElement.querySelector(".slider__control_left"), // кнопка "RIGHT"
      _wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width), // ширина обёртки
      _itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width), // ширина одного элемента
      _positionLeftItem = 0, // позиция левого активного элемента
      _transform = 0, // значение транфсофрмации .slider_wrapper
      _step = (_itemWidth / _wrapperWidth) * 100, // величина шага (для трансформации)
      _items = [], // массив элементов
      _interval = 0,
      _html = _mainElement.innerHTML,
      _states = [
        { active: false, minWidth: 0, count: 1 },
        { active: false, minWidth: 980, count: 2 },
      ],
      _config = {
        isCycling: false, // автоматическая смена слайдов
        direction: "right", // направление смены слайдов
        interval: 1000, // интервал между автоматической сменой слайдов
        pause: true, // устанавливать ли паузу при поднесении курсора к слайдеру
      };

    for (var key in config) {
      if (key in _config) {
        _config[key] = config[key];
      }
    }

    // наполнение массива _items
    _sliderItems.forEach(function (item, index) {
      _items.push({ item: item, position: index, transform: 0 });
    });

    var _setActive = function () {
      var _index = 0;
      var width = parseFloat(document.body.clientWidth);
      _states.forEach(function (item, index, arr) {
        _states[index].active = false;
        if (width >= _states[index].minWidth) _index = index;
      });
      _states[_index].active = true;
    };

    var _getActive = function () {
      var _index;
      _states.forEach(function (item, index, arr) {
        if (_states[index].active) {
          _index = index;
        }
      });
      return _index;
    };

    var position = {
      getItemMin: function () {
        var indexItem = 0;
        _items.forEach(function (item, index) {
          if (item.position < _items[indexItem].position) {
            indexItem = index;
          }
        });
        return indexItem;
      },
      getItemMax: function () {
        var indexItem = 0;
        _items.forEach(function (item, index) {
          if (item.position > _items[indexItem].position) {
            indexItem = index;
          }
        });
        return indexItem;
      },
      getMin: function () {
        return _items[position.getItemMin()].position;
      },
      getMax: function () {
        return _items[position.getItemMax()].position;
      },
    };

    var _transformItem = function (direction) {
      var nextItem;
      if (!_isElementVisible(_mainElement)) {
        return;
      }
      if (direction === "right") {
        _positionLeftItem++;
        if (
          _positionLeftItem + _wrapperWidth / _itemWidth - 1 >
          position.getMax()
        ) {
          nextItem = position.getItemMin();
          _items[nextItem].position = position.getMax() + 1;
          _items[nextItem].transform += _items.length * 100;
          _items[nextItem].item.style.transform =
            "translateX(" + _items[nextItem].transform + "%)";
        }
        _transform -= _step;
      }
      if (direction === "left") {
        _positionLeftItem--;
        if (_positionLeftItem < position.getMin()) {
          nextItem = position.getItemMax();
          _items[nextItem].position = position.getMin() - 1;
          _items[nextItem].transform -= _items.length * 100;
          _items[nextItem].item.style.transform =
            "translateX(" + _items[nextItem].transform + "%)";
        }
        _transform += _step;
      }
      _sliderWrapper.style.transform = "translateX(" + _transform + "%)";
    };

    var _cycle = function (direction) {
      if (!_config.isCycling) {
        return;
      }
      _interval = setInterval(function () {
        _transformItem(direction);
      }, _config.interval);
    };

    // обработчик события click для кнопок "назад" и "вперед"
    var _controlClick = function (e) {
      if (e.target.classList.contains("slider__control")) {
        e.preventDefault();
        var direction = e.target.classList.contains("slider__control_right")
          ? "left"
          : "right";
        _transformItem(direction);
        clearInterval(_interval);
        _cycle(_config.direction);
      }
    };

    // обработка события изменения видимости страницы
    var _handleVisibilityChange = function () {
      if (document.visibilityState === "hidden") {
        clearInterval(_interval);
      } else {
        clearInterval(_interval);
        _cycle(_config.direction);
      }
    };

    var _refresh = function () {
      clearInterval(_interval);
      _mainElement.innerHTML = _html;
      _sliderWrapper = _mainElement.querySelector(".slider-new-wrapper");
      _sliderItems = _mainElement.querySelectorAll(".slider__item");
      _sliderControls = _mainElement.querySelectorAll(".slider__control");
      _sliderControlLeft = _mainElement.querySelector(".slider__control_left");
      _sliderControlRight = _mainElement.querySelector(
        ".slider__control_right"
      );
      _wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width);
      _itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width);
      _positionLeftItem = 0;
      _transform = 0;
      _step = (_itemWidth / _wrapperWidth) * 100;
      _items = [];
      _sliderItems.forEach(function (item, index) {
        _items.push({ item: item, position: index, transform: 0 });
      });
    };

    var _setUpListeners = function () {
      _mainElement.addEventListener("click", _controlClick);
      if (_config.pause && _config.isCycling) {
        _mainElement.addEventListener("mouseenter", function () {
          clearInterval(_interval);
        });
        _mainElement.addEventListener("mouseleave", function () {
          clearInterval(_interval);
          _cycle(_config.direction);
        });
      }
      document.addEventListener(
        "visibilitychange",
        _handleVisibilityChange,
        false
      );
      window.addEventListener("resize", function () {
        var _index = 0,
          width = parseFloat(document.body.clientWidth);
        _states.forEach(function (item, index, arr) {
          if (width >= _states[index].minWidth) _index = index;
        });
        if (_index !== _getActive()) {
          _setActive();
          _refresh();
        }
      });
    };

    // инициализация
    _setUpListeners();
    if (document.visibilityState === "visible") {
      _cycle(_config.direction);
    }
    _setActive();

    return {
      right: function () {
        // метод right
        _transformItem("left");
      },
      left: function () {
        // метод left
        _transformItem("right");
      },
      stop: function () {
        // метод stop
        _config.isCycling = false;
        clearInterval(_interval);
      },
    };
  };
})();

var slider = multiItemSlider(".slider-wrapper", {
  isCycling: false,
});

let arrayImgUrl = [
  '<img src="./assets/img/portfolio-1.png" alt="circle"></img>',
  '<img src="./assets/img/portfolio-2.png" alt="circle"></img>',
  '<img src="./assets/img/portfolio-3.png" alt="circle"></img>',
  '<img src="./assets/img/portfolio-4.png" alt="circle"></img>',
  '<img src="./assets/img/portfolio-5.png" alt="circle"></img>',
  '<img src="./assets/img/portfolio-6.png" alt="circle"></img>',
  '<img src="./assets/img/portfolio-7.png" alt="circle"></img>',
  '<img src="./assets/img/portfolio-8.png" alt="circle"></img>',
  '<img src="./assets/img/portfolio-9.png" alt="circle"></img>',
  '<img src="./assets/img/portfolio-10.png" alt="circle"></img>',
  '<img src="./assets/img/portfolio-11.png" alt="circle"></img>',
  '<img src="./assets/img/portfolio-12.png" alt="circle"></img>',
];


const getSortImagelist = () => {
  container.innerHTML = "";
  let fragment = new DocumentFragment();
  let ar = arrayImgUrl.sort(function () {
    return Math.random() - 0.5;
  });
  for (let i = 0; i <= 11; i++) {
    let li = document.createElement("li");
    li.classList.add("image");
    li.innerHTML = ar[i];
    fragment.append(li);
  }
  return fragment;
};

const container = document.querySelector(".image-list");

function getListContent() {
  let fragment = new DocumentFragment();
  for (let i = 0; i <= 11; i++) {
    let li = document.createElement("li");
    li.classList.add("image");
    li.innerHTML = arrayImgUrl[i];
    fragment.append(li);
  }
  return fragment;
}
container.append(getListContent());

addTagClickHandler();
function addTagClickHandler() {
  let tags = document.querySelector(".nav-portfolio");
  tags.addEventListener("click", (e) => {
    if (e.target.classList.contains("tag")) {
      let clickedTag = e.target;
      removeTag();
      selectTag(clickedTag);
      container.append(getSortImagelist());
    }
  });
}
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
