const container = document.getElementsByClassName('container')[0] as HTMLElement;
const homepage = document.getElementsByClassName('homepage')[0] as HTMLElement;
const loadImg = document.getElementsByClassName('load-image')[0] as HTMLElement;

const popUp = document.getElementsByClassName('pop-up')[0] as HTMLElement;
const popUpImg = document.getElementsByClassName('pop-up-img')[0] as HTMLElement;
const popUpCloseImg = document.getElementsByClassName('pop-up-close')[0] as HTMLElement;

let tags: string = "";
let url: string = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=9f6078ec1fbacb890d45df32043f7d9a&tags=${tags}&format=json&nojsoncallback=1`;

let page = 1;
const perPage = 20;
let photosLoaded: number = 0;
const photos: string[] = [];

let script: string;

const loadingPage = document.createElement('div');
loadingPage.id = 'loading-page';
loadingPage.innerHTML = '<div class="loader"></div>';
let categoryCss = '';

function removeLoadingPage() {
    if (document.body.contains(loadingPage)) {
        document.body.removeChild(loadingPage);
    }
}

async function flickrApi(page: number, perPage: number) {
    const apiUrl = `${url}&page=${page}&per_page=${perPage}`;
    const response = await fetch(apiUrl);
    const data = response.json();

    return data;
}

function loadMorePictures() {
    flickrApi(page, perPage).then(data => {
        const photoArray = data.photos.photo;
        let imgUrl = "";
        photoArray.forEach((photo: any) => {
            imgUrl = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`;
            photos.push(imgUrl);
        });
        page++;
        renderPhotos();
        loadCSS(categoryCss);
    });
}

function renderPhotos() {
    const fragment = document.createDocumentFragment();
    for (let i = photosLoaded; i < photos.length; i++) {
        const img = document.createElement('img');
        img.src = photos[i];

        img.addEventListener('click', function (event) {
            const target = event.target as HTMLImageElement;
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

function loadPopUp(image: string) {
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

function handleScroll() {
    if (window.scrollY === 0) {
        renderPhotos();
    } else if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        loadMorePictures();
    }
}

function loadCSS(selectedCategory: string) {
    const images = document.getElementsByTagName('img');

    for (let i = 0; i < images.length; i++) {
        if (images[i].classList.length > 0) {
            images[i].classList.remove(images[i].classList[0]);
            images[i].classList.add(selectedCategory);
        } else {
            images[i].classList.add(selectedCategory);
        }
    }
    document.body.style.backgroundImage = `url(image/${selectedCategory}.jpg)`;
}

function loadNavBar() {
    const navBar = document.createElement('nav');
    navBar.classList.add('nav-bar');
    navBar.innerHTML = `
        <h1>Flickr Photo Gallery</h1>
    `;

    const category = document.createElement('select');
    category.classList.add('category');

    const categoryList = [
        'SpiderMan',
        'Galaxy',
        'Jungle',
        'Ocean'
    ];

    const selectOption = document.createElement('option');
    selectOption.disabled = true;
    selectOption.selected = true;
    selectOption.textContent = 'Select Category';
    category.appendChild(selectOption);
    removeLoadingPage();

    categoryList.forEach(item => {
        const option = document.createElement('option');
        option.classList.add('option');
        option.textContent = item;
        category.appendChild(option);
    });

    category.addEventListener('change', function () {
        const selectedCategory = category.value;
        container.innerHTML = '';
        loadCSS(selectedCategory);
        categoryCss = selectedCategory;
        loadImage(selectedCategory);
        document.body.appendChild(loadingPage);
    });

    function loadImage(selectedCategory: string) {
        tags = selectedCategory;
        url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=9f6078ec1fbacb890d45df32043f7d9a&tags=${tags}&format=json&nojsoncallback=1`;
        homepage.style.display = "none";
        flickrApi(page, perPage);
        loadMorePictures();
        window.addEventListener('scroll', handleScroll);
        loadCSS(selectedCategory);
    }

    document.body.appendChild(navBar);
    navBar.appendChild(category);
    removeLoadingPage();
}

loadImg.addEventListener("click", () => {
    loadNavBar();
    homepage.innerHTML = `<div class="select-cat">
        <h1>Select A Category</h1>
        <img class="select-cat-image" src="image/Google-Photos-Logo-2015.png">
    </div>`;
});