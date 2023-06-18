var container = document.getElementsByClassName('container')[0];
var homepage = document.getElementsByClassName('homepage')[0];
var loadImg = document.getElementsByClassName('load-image')[0];

var tags = "";
var url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=9f6078ec1fbacb890d45df32043f7d9a&tags=${tags}&format=json&nojsoncallback=1`;

var page = 1;
var perPage = 20;
var photosLoaded = 0;
var photos = [];

var script;

var loadingPage = document.createElement('div');
loadingPage.id = 'loading-page';
loadingPage.innerHTML = '<div class="loader"></div>';

function removeLoadingPage() {
    if (document.body.contains(loadingPage)) {
        document.body.removeChild(loadingPage);
    }
}

function unloadCSS() {
    var links = document.head.getElementsByTagName('link');
    for (var i = links.length - 1; i >= 0; i--) {
        var link = links[i];
        if (link.rel === 'stylesheet' && link.getAttribute('href') !== 'index.css') {
            link.parentNode.removeChild(link);
        }
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
        'Ocean'
    ];

    var selectOption = document.createElement('option');
    selectOption.disabled = true;
    selectOption.selected = true;
    selectOption.textContent = 'Select Category';
    category.appendChild(selectOption);
    removeLoadingPage();

    categoryList.forEach(item => {
        var option = document.createElement('option');
        option.classList.add('option');
        option.textContent = item;
        category.appendChild(option);
    });

    category.addEventListener('change', function () {
        var selectedCategory = category.value;
        container.innerHTML = '';
        unloadCSS();
        loadImage(selectedCategory);
    });

    function loadImage(selectedCategory) {
        script = document.createElement('script')
        script.src = `Category/${selectedCategory}/${selectedCategory}.js`
        document.body.appendChild(script)
        document.body.appendChild(loadingPage);

        var link = document.createElement("link");
        link.href = `Category/${selectedCategory}/${selectedCategory}.css`;
        link.rel = "stylesheet";
        document.head.appendChild(link);
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
    </div>`
});
