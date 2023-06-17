var container = document.getElementsByClassName('container')[0];
var homepage = document.getElementsByClassName('homepage')[0];
var loadImg = document.getElementsByClassName('load-image')[0];

var tags = "";
var url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=9f6078ec1fbacb890d45df32043f7d9a&tags=${tags}&format=json&nojsoncallback=1`;

var page = 1;
var perPage = 20;
var photosLoaded = 0;
var photos = [];

var loadingPage = document.createElement('div');
loadingPage.id = 'loading-page';
loadingPage.innerHTML = '<div class="loader"></div>';

function removeLoadingPage() {
    if (document.body.contains(loadingPage)) {
        document.body.removeChild(loadingPage);
    }
}

async function flickrApi(page, perPage) {
    var urlWithPagination = `${url}&page=${page}&per_page=${perPage}`;
    var response = await fetch(urlWithPagination);
    var data = response.json();

    return data;
}

function loadMorePictures() {
    flickrApi(page, perPage).then(data => {
        var photoArray = data.photos.photo;
        var imgUrl = "";
        photoArray.forEach(photo => {
            imgUrl = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`;
            photos.push(imgUrl);
        });
        page++;
        renderPhotos();
    });
}

function renderPhotos() {
    var fragment = document.createDocumentFragment();
    for (var i = photosLoaded; i < photos.length; i++) {
        var img = document.createElement('img');
        img.classList.add('image');
        img.src = photos[i];
        fragment.appendChild(img);
    }
    removeLoadingPage();
    container.appendChild(fragment);
    photosLoaded = photos.length;
}

function handleScroll() {
    if (window.scrollY === 0) {
        renderPhotos();
    } else if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        loadMorePictures();
    }
}

function loadNavBar() {
    var navBar = document.createElement('div');
    navBar.classList.add('nav-bar');
    navBar.innerHTML = `
        <h1>Flickr Photo Gallery</h1>
    `;

    var category = document.createElement('select');
    category.classList.add('category');

    var categoryList = [
        'SpiderMan',
        'Universe',
        'Jungle',
    ];

    var selectOption = document.createElement('option');
    selectOption.disabled = true;
    selectOption.selected = true;
    selectOption.textContent = 'Select Category';
    category.appendChild(selectOption);

    categoryList.forEach(item => {
        var option = document.createElement('option');
        option.classList.add('option');
        option.textContent = item;
        category.appendChild(option);
    });


    category.addEventListener('change', function () {
        var selectedCategory = category.value;
        container.innerHTML = '';
        tags = selectedCategory;
        url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=9f6078ec1fbacb890d45df32043f7d9a&tags=${tags}&format=json&nojsoncallback=1`;
        console.log('asda')
        homepage.style.display = "none";
        flickrApi(page, perPage);
        loadMorePictures();
        window.addEventListener('scroll', handleScroll);
    });


    document.body.appendChild(navBar);
    navBar.appendChild(category);
    removeLoadingPage();
}

loadImg.addEventListener("click", () => {
    document.body.appendChild(loadingPage);
    loadNavBar();
    container.innerHTML = 'Select Catagories'
});
