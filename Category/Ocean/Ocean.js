var container = document.getElementsByClassName('container')[0];
var homepage = document.getElementsByClassName('homepage')[0];
var loadImg = document.getElementsByClassName('load-image')[0];

var tags = "Ocean";
var url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=9f6078ec1fbacb890d45df32043f7d9a&tags=${tags}&format=json&nojsoncallback=1`;

var page = 1;
var perPage = 20;
var photosLoaded = 0;
var photos = [];



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
};

function handleScroll() {
    if (window.scrollY === 0) {
        renderPhotos();
    } else if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        loadMorePictures();
    }
};

var bubble = document.createElement('div');
bubble.classList.add('bubble-container');
for (let i = 1; i > 9; i++) {
    var littleBubble = document.createElement('div');
    littleBubble.classList.add(`buuble bubble-${i}`);
    bubble.appendChild(littleBubble);
};

document.body.appendChild(bubble)


homepage.style.display = "none";
flickrApi(page, perPage);
loadMorePictures();
window.addEventListener('scroll', handleScroll);