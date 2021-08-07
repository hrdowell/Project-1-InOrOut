$(document).ready(function () {
    $('select').formSelect();

});
M.AutoInit()
$(".dropdown-trigger").dropdown();

$('.modal').modal();

//result.name   result.rating   result.formatted_address
// result.name.
//--------------------------------------
//GOOGLE PLACES RESTAURANT API
let api2 = "AIzaSyDHAbDYEeM1ZUXXiHPI9RmpU-UDjlEZh1s"; //Google Places API
let restaurant;
$("#cityButton").click(function () {
    let cityQuery = $("#searchCity").val();
    console.log("Searching restaurant  in: "+cityQuery);
    const request = {
        query: "restaurants in " + cityQuery,
        type: "restaurant",
    };
    var service = new google.maps.places.PlacesService(document.getElementById('map'));
    service.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            for (i = 0; i < results.length; i++) {
                console.log(results[i].place_id + " : " + results[i].name );
                showRestaurantDetails(results[i]);
            }
        }
    });

})

// ADD RESTAURANT TO MEAL PLAN MODAL
$("main").on("click", ".addRestaurantToMealPlan", function (event) {
    event.preventDefault();
    event.stopPropagation();
    console.log("ADD RESTAURANT TO MEAL PLAN")
    let button = $(event.target);
    restaurant = button.data("restaurant")
    console.log(restaurant);
    $('.modal').modal('open');
});


// RESTAURANT CLICK FUNCTION TO ADD MEAL TO MEAL PLAN
$(".day").on("click", function (event) {
    console.log("CLICKED DAY")
    let button = $(event.target);
    let day = button.data("day")
    if (restaurant) {
        addRestaurantToMealPlanner(restaurant, day);
    }
    if (recipe) {
        addRecipeToMealPlanner(recipe, day);
    }
    $('.modal').modal('close');
})

function addRestaurantToMealPlanner(restaurant, day) {
    console.log(day, restaurant.image)
    localStorage.setItem(day, restaurant.title);
    localStorage.setItem(day + 'image', restaurant.image);
    localStorage.setItem(day + "restaurantUrl", restaurant.sourceURL);
    getRestaurantsFromLocalStorage()
}

// SAVING RESTAURANT MEAL PLAN TO LOCAL STORAGE
function getRestaurantsFromLocalStorage() {
    console.log("GETTING RESTAURANT ITEMS");

    for (let dayNumber = 0; dayNumber < 7; dayNumber++) {
        $(`#${dayNumber}`).text(localStorage.getItem(dayNumber));
        let restaurantLink = $('<a>');
        restaurantLink.attr('href', localStorage.getItem(dayNumber + "restaurantUrl"));
        restaurantLink.text('Click here for restaurant');
        restaurantLink.attr('target', '_blank');
        $(`#${dayNumber}restaurantURL`).empty().append(restaurantLink);
        let restaurantImage = $('<img class="restaurantPhoto">');
        restaurantImage.attr('src', localStorage.getItem(dayNumber + "image"));
        $(`#${dayNumber}image`).html('')
        $(`#${dayNumber}image`).append(restaurantImage);
    }
}

getRestaurantsFromLocalStorage();

function clearMealPlan() {
    localStorage.clear();
    location.reload();
}

// ADD RESTAURANT TO MEAL PLAN BUTTON
function showRestaurantDetails(place) {

    let restaurantDiv = $("#restaurantDisplay");
    let restaurantTitle = $('<h5>');
    let restaurantImage = $('<img class="recipePhoto">');
    let restaurantSummary = $('<p>');
    let restaurantName = $('<div  class="restaurantNameAndButton">')
    let restaurantURL = $('<a>');
    let restaurantInfo = $("<div class='restaurantInfo'>");
    let addRestaurantToMealPlannerButton = $("<button class='addRestaurantToMealPlan'>");
    addRestaurantToMealPlannerButton.text("Add Restaurant to Meal Plan")
        .addClass("waves-effect waves-light btn")
        .data("restaurant", place);


    restaurantInfo.append(restaurantImage);
    restaurantTitle.text(place.name);
    restaurantImage.attr('src', place.photos[0].getUrl({ maxWidth: 100, maxHeight: 100 }))
    restaurantURL.append(restaurantTitle);
    restaurantURL.attr('href', place.sourceURL);
    restaurantURL.attr('target', '_blank');
    restaurantName.append(restaurantURL, addRestaurantToMealPlannerButton);
    restaurantDiv.append(restaurantName, restaurantInfo)};