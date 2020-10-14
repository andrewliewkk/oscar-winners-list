document.addEventListener("DOMContentLoaded", function (event) {
    getAllDecades()
});


function getAllDecades() {
    var request = new XMLHttpRequest();
    var years = [];
    var decades = [];
    var dict = new Object();
    dict = {};
    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.responseText);

            //retrieve years from response
            for (entry of response.records) {
                year = entry.movie.year;
                years.push(year);
            }
            //retrieve decades,counts from years
            for (year of years) {
                decade = "" + Math.floor(year / 10) + "0"
                if (!(decades.includes(decade))) {
                    decades.push(decade);
                    dict[decade] = 1;
                } else {
                    dict[decade] += 1;
                }
            }
            decades.sort();
            //create dropdown menu item
            createDropdownMenu(decades, dict);

            //create movie cards
            createCards(response.records);
            
        }
    }
    request.open("GET", "../api/winner/read.php", true);
    request.send()
}

function retrieveMovies(decade) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.responseText);
            createCards(response.records);
        }
    }
    request.open("GET", "../api/winner/search.php?d=" + decade, true);
    request.send()
}

function createCards(records) {
    //reset cards
    card_col = document.getElementsByClassName("card-columns")[0];
    while (card_col.firstChild) {
        card_col.removeChild(card_col.lastChild);
    }

    //retrieve each winner from response
    for (winner of records) {
        //retrieve details of each oscar winner
        image = winner.others.image;
        name = winner.bio.name;
        movie = winner.movie.title;
        movie_year = winner.movie.year;
        description = winner.movie.description;

        //card creation of each oscar winner
        card = document.createElement("div");
        card.setAttribute("class", "card");
        //image
        img = document.createElement("img");
        img.setAttribute("class", "card-img-top");
        if (image.includes(".jpg")) {
            img.setAttribute("src", "../api/images/" + image);
        } else {
            img.setAttribute("src", "../api/images/" + image + ".jpg");
        }
        img.setAttribute("alt", "Card image cap");
        //card-body
        card_body = document.createElement("div");
        card_body.setAttribute("class", "card-body");
        //card-title
        card_title = document.createElement("h5");
        card_title.setAttribute("class", "card-title");
        card_title.innerHTML = name;
        //movie-title
        movie_title = document.createElement("b");
        movie_title.setAttribute("class", "card-text");
        movie_title.innerHTML = movie + " (" + movie_year + ")";
        //card-body
        card_text = document.createElement("p");
        card_text.setAttribute("class", "card-text");
        card_text.setAttribute("style", "font-style: italic;");
        card_text.innerHTML = description;

        card_body.appendChild(card_title);
        card_body.appendChild(movie_title);
        card_body.appendChild(card_text);

        card.appendChild(img);
        card.appendChild(card_body);

        card_col.appendChild(card);
    }
}

function createDropdownMenu(decades, dict) {
    for (decade of decades) {
        button = document.createElement("button");
        button.setAttribute("class", "dropdown-item");
        button.setAttribute("type", "button");
        button.setAttribute("onclick", "retrieveMovies(" + decade+ ")");
        button.innerHTML = decade + "&nbsp";
        //create badge
        badge = document.createElement("span");
        badge.setAttribute("class", "badge badge-pill badge-warning");
        badge.innerHTML = dict[decade];
        button.appendChild(badge);
        dropdownMenu = document.getElementsByClassName("dropdown-menu")[0];
        dropdownMenu.appendChild(button);
    }
}