var container = document.getElementsByClassName('container')[0];
var tags = "cars";

var url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=9f6078ec1fbacb890d45df32043f7d9a&tags=${tags}&format=json&nojsoncallback=1`;

async function flickerApi() {
    let response = await fetch(url);
    let data = response.json();
    return data;
};

flickerApi().then(data => {
    var photoArray = data.photos.photo
    var imgUrl = ""
    photoArray.forEach(photo => {
        imgUrl = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`;
        container.innerHTML += `<img src=${imgUrl}>`
    });
});
