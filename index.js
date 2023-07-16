"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const container = document.getElementsByClassName('container')[0];
const homepage = document.getElementsByClassName('homepage')[0];
const loadImg = document.getElementsByClassName('load-image')[0];
const popUpCloseImg = document.getElementsByClassName('pop-up-close')[0];
let tags = "";
let url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=9f6078ec1fbacb890d45df32043f7d9a&tags=${tags}&format=json&nojsoncallback=1`;
let page = 1;
const perPage = 10;
let photosLoaded = 0;
const photos = [];
let categoryCss = '';
function removeLoadingPage() {
    const loadingPage = document.getElementById('loading-page');
    if (loadingPage) {
        loadingPage.remove();
    }
}
function flickrApi(page, perPage) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiUrl = `${url}&page=${page}&per_page=${perPage}`;
        const response = yield fetch(apiUrl);
        const data = yield response.json();
        return data;
    });
}
function loadMorePictures() {
    //   if (!document.getElementById('loading-page')) {
    //     showLoadingPage();
    //   }
    flickrApi(page, perPage)
        .then((data) => {
        const photoArray = data.photos.photo;
        if (photoArray.length > 0) {
            let imgUrl = "";
            photoArray.forEach((photo) => {
                imgUrl = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`;
                photos.push(imgUrl);
            });
            page++;
            renderPhotos();
            loadCSS(categoryCss);
        }
    });
}
function renderPhotos() {
    const fragment = document.createDocumentFragment();
    for (let i = photosLoaded; i < photos.length; i++) {
        const img = document.createElement('img');
        img.src = photos[i];
        img.addEventListener('click', function (event) {
            const target = event.target;
            if (target && target.src) {
                loadPopUp(target.src);
            }
        });
        fragment.appendChild(img);
    }
    removeLoadingPage();
    container.appendChild(fragment);
    photosLoaded = photos.length;
}
function loadPopUp(image) {
    const popUp = document.createElement('div');
    popUp.classList.add('pop-up');
    const popImg = document.createElement('img');
    popImg.src = image;
    const closePopUp = document.createElement('p');
    closePopUp.innerHTML = 'X';
    closePopUp.addEventListener('click', () => {
        document.body.removeChild(popUp);
    });
    popUp.appendChild(closePopUp);
    popUp.appendChild(popImg);
    document.body.appendChild(popUp);
}
function loadCSS(selectedCategory) {
    const images = document.getElementsByTagName('img');
    for (let i = 0; i < images.length; i++) {
        if (images[i].classList.length > 0) {
            images[i].classList.remove(images[i].classList[0]);
            images[i].classList.add(selectedCategory);
        }
        else {
            images[i].classList.add(selectedCategory);
        }
    }
    document.body.style.backgroundImage = `url(image/${selectedCategory}.jpg)`;
}
function handleScroll() {
    if (window.scrollY === 0) {
        renderPhotos();
    }
    else if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        loadMorePictures();
    }
}
function loadNavBar() {
    const navBar = document.createElement('nav');
    navBar.classList.add('nav-bar');
    navBar.innerHTML = `
    <h1>Flickr Photo Gallery</h1>
  `;
    const catDiv = document.createElement('div');
    const category = document.createElement('input');
    category.classList.add('cat-search');
    const catBtn = document.createElement('button');
    catBtn.classList.add('cat-btn');
    category.placeholder = 'Search';
    catBtn.innerText = 'Submit';
    category.classList.add('category');
    catBtn.addEventListener('click', () => {
        if (!document.getElementById('loading-page')) {
            showLoadingPage();
        }
        tags = category.value;
        url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=9f6078ec1fbacb890d45df32043f7d9a&tags=${tags}&format=json&nojsoncallback=1`;
        homepage.style.display = "none";
        photos.length = 0;
        page = 1;
        photosLoaded = 0;
        container.innerHTML = '';
        loadMorePictures();
        window.addEventListener('scroll', handleScroll);
        loadCSS(categoryCss);
    });
    document.body.appendChild(navBar);
    navBar.appendChild(catDiv);
    catDiv.appendChild(category);
    catDiv.appendChild(catBtn);
}
function showLoadingPage() {
    const loadingPage = document.getElementById('loading-page');
    if (!loadingPage) {
        const newLoadingPage = document.createElement('div');
        newLoadingPage.id = 'loading-page';
        newLoadingPage.innerHTML = '<div class="loader"></div>';
        document.body.appendChild(newLoadingPage);
    }
}
loadImg.addEventListener("click", () => {
    loadNavBar();
    homepage.innerHTML = `<div class="select-cat">
    <h1>Select A Category</h1>
    <img class="select-cat-image" src="image/Google-Photos-Logo-2015.png">
  </div>`;
});
