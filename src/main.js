require("./index.html");
require("./styles.css");

const Handlebars = require("handlebars");

let comments = {};

ymaps.ready(init);

document.addEventListener('click', buttonClick);

function createPlacemark() {
    if (localStorage.data) {
        const data = JSON.parse(localStorage.data);
        for (let coords in data) {
            ymaps.clusterer.add(new ymaps.Placemark(coords));
        }
        
    }
}

function init() {
    ymaps.map = new ymaps.Map("map", {
        center: [59.93690597, 30.35463695],
        zoom: 10
    });

    ymaps.clusterer = new ymaps.Clusterer({
        clusterDisableClickZoom: true,
        clusterBalloonContentLayout: 'cluster#balloonCarousel'
        
    })
    ymaps.map.geoObjects.add(ymaps.clusterer);

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
    })

    

}

function buttonClick(e) {
    if (e.target.classList.contains("addButton")) {
        const coords = JSON.parse(e.target.dataset.coords);
        let nameInput = document.getElementById("nameInput");
        let placeNameInput = document.getElementById("placeNameInput");
        let reviewsInput = document.getElementById("reviewsInput");
        let coordsName = coords.join(',');

        
        comments[coordsName] = comments[coordsName] || [];
        comments[coordsName].push({
            name: nameInput.value,
            place: placeNameInput.value,
            comment: reviewsInput.value
        })
       
        localStorage.setItem('data', JSON.stringify(comments));

        const placemark = new ymaps.Placemark(coords);
        ymaps.clusterer.add(placemark);
        ymaps.map.balloon.close();
    }
}

function balloonDom(coords) {
    let coordsName = coords.join(',')
   
    const template = Handlebars.compile(
        ['<div class="balun" id="balun">',
            '<div class="reviews">',
            '<ul class="review">',
            `{{#each [${coordsName}]}}`,
            '<li>',
            '<div><b>{{name}}</b> <i>{{place}}</i></div>',
            '<div>{{comment}}</div>',
            '</li>',
            '{{/each}}',
            '</ul>',
            '</div> <br>',
            '<div class="my_review">',
            '<div class="head">Отзыв</div> <br>',
            '<input type="text" name="nameInput" id="nameInput" placeholder="Укажите ваше имя"> <br>',
            '<input type="text" name="placeNameInput" id="placeNameInput" placeholder="Укажите место"> <br>',
            '<textarea name="reviewsInput" id="reviewsInput" cols="30" rows="8" placeholder="Введите комментарий"></textarea> <br>',
            '</div>',
            `<button class="addButton" data-coords="${JSON.stringify(coords)}">Добавить</button>`,
            '</div>'
        ].join(''));

    return template(comments);
}
createPlacemark();
// function clasterDom() {
//     let coordsName = coords.join(',')
//     const template = Handlebars.compile(
//         ['<div class="reviews">',
//         '<ul class="review">',
//         `{{#each [${coordsName}]}}`,
//         '<li>',
//         '<div><b>{{name}}</b> <i>{{place}}</i></div>',
//         '<div>{{comment}}</div>',
//         '</li>',
//         '{{/each}}',
//         '</ul>',
//         '</div>',
//     ].join(' '));

//     return template(comments);
// }