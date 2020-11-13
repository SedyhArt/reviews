const Handlebars = require("handlebars");


// JSON.parse(localStorage[myData];
// console.log(JSON.parse(localStorage.myData));

let a = 0;
let comments = {};
rrg

console.log(localStorage);

ymaps.ready(init);

document.addEventListener('click', buttonClick);

function init() {
    ymaps.map = new ymaps.Map("map", {
        center: [59.93690597, 30.35463695],
        zoom: 10
    });

    ymaps.map.events.add('click', onMapClick)
    ymaps.map.geoObjects.events.add('click', onGeoObjectClick)
}


function onMapClick(e) {
    var coords = e.get('coords');

    if (!ymaps.map.balloon.isOpen()) {
        ymaps.map.balloon.open(coords, {
            content: balloonDom(coords)
        });
    } else {
        ymaps.map.balloon.close();
    }
}

function onGeoObjectClick(e) {
    const coords = e.get('target').geometry.getCoordinates();

    ymaps.map.balloon.open(coords, {
        content: balloonDom(coords)
    });
    // console.log(comments);
}

function buttonClick(e) {
    if (e.target.classList.contains("addButton")) {
        const coords = JSON.parse(e.target.dataset.coords);
        let nameInput = document.getElementById("nameInput");
        let placeNameInput = document.getElementById("placeNameInput");
        let reviewsInput = document.getElementById("reviewsInput");

        let coordsName = coords.join(',')
        comments[coordsName] = comments[coordsName] || [];
        comments[coordsName].push({
            name: nameInput.value,
            place: placeNameInput.value,
            comment: reviewsInput.value
        })
        localStorage['myData'] + (JSON.stringify(comments));
        console.log(localStorage.myData);
        ymaps.map.geoObjects.add(new ymaps.Placemark(coords))
        // console.log(ymaps.map.geoObjects);
        ymaps.map.balloon.close();
    }
}

function balloonDom(coords) {
    //прохожусь по comments и добавляю комментарии, если они есть
    let coordsName = coords.join(',')
    let template = ''
    if (comments[coordsName]) {
        template = Handlebars.compile([
            '<div class="review">{{#each comments[coordsName]}}',
            '<div><b>{{name}}<b> [{{place}}]</div>',
            '<div>{{comment}}</div>',
            '</div>'].join(''))
    }

    return ['<div class="balun" id="balun">',
        '<div class="reviews">',
        `${template}`,
        '</div> <br>',
        '<div class="my_review">',
        '<div class="head">Отзыв</div> <br>',
        '<input type="text" name="nameInput" id="nameInput" placeholder="Укажите ваше имя"> <br>',
        '<input type="text" name="placeNameInput" id="placeNameInput" placeholder="Укажите место"> <br>',
        '<textarea name="reviewsInput" id="reviewsInput" cols="30" rows="8" placeholder="Введите комментарий"></textarea> <br>',
        '</div>',
        `<button class="addButton" data-coords="${JSON.stringify(coords)}">Добавить</button>`,
        '</div>'
    ].join('');
}