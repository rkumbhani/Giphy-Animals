// initial array of animals
var animals = ["cat", "dog", "horse", "dolphin", "pig"];

// api key generated for app
var API_KEY = "JUAeVxFIUAnnKuApkvvHSGHAb203Vwtd";

// baseURL
var baseURL = "https://api.giphy.com/v1/gifs/search?api_key=" + API_KEY;

// gif state checked with boolean
var isStill = true;

// function for button display
function renderButtons() {

  $("#buttons-view").empty();

  for (var i = 0; i < animals.length; i++) {

    var animalBtn = $("<button>");
    animalBtn.attr({
      id: 'btn_'+i,
      'data-name': animals[i],
      class: 'animal animal-btn btn btn-warning'
    });
    animalBtn.text(animals[i]);

    $("#buttons-view").append(animalBtn);
  }

}

// function to get 10 GIFs when button is clicked
function displayGIFs(){

  // clear div
  $("#gifs-view").empty();

  // get the 'data-name' attribute from the clicked button
  var animal = $(this).attr('data-name');

  // AJAX request
  $.ajax({
    url: baseURL + "&limit=10&q=" + encodeURI(animal),
    method: 'GET',
  })
  .done(function(response) {
    console.log(response);
    
    var results = response.data;

    // for loop for the data array in response
    for(var i = 0; i < results.length; i++) {
      
      // get gif rating
      var rating = results[i].rating;

      // set img properties
      var img = $("<img>").attr("src", results[i].images.fixed_height_still.url);
      img.attr({
        'id': i,
        'gif-id': results[i].id,
        'gif-still': results[i].images.fixed_height_still.url,
        'gif-animate': results[i].images.fixed_height.url,
        'gif-state': 'still'
        });
      
      img.addClass('gif-img');
      img.css('display', 'inline');

      // create a div for the GIFs
      var gifItem = $("<div class='gif-item'>");

      // append rating and img to item
      gifItem.append('<p> Rating: ' + rating + '</p>');
      gifItem.append(img);
      gifItem.css('display', 'inline');

      // append gifItem to wrapper div
      $("#gifs-view").append(gifItem);
      isStill = true;
    }
  })

  .fail(function() {
    console.log("AJAX Request Error");
  })

  .win(function() {
    console.log("AJAX Request Completed");
  });
  
}

// function switching between still and animate states
function switchImg() {
  if (isStill === true) {
    var animatedURL = $(this).attr('gif-animate');
    $(this).attr({
      'gif-state': 'animate',
      'src': animatedURL
    });

    isStill = false;
  }
  else if (isStill === false) {
    var stillURL = $(this).attr('gif-still');
    $(this).attr({
      'gif-state': 'still',
      'src': stillURL
    });

    isStill = true;
  }
}

// adding click event listeners to all elements with a class of "animal-btn"
$(document).on("click", ".animal-btn", displayGIFs);

// adding click event listeners to all elements with a class of 'gif-img'
$(document).on('click', '.gif-img', switchImg);

$("#btn-add").on('click', function() {
  
  var input = $("#inputAnimal").val().trim();
  
  if (input === "") {
    alert("Please enter something before clicking Add");
    return;
  }
  else {
    // push user input to animals array
    animals.push(input);

    // clear textbox
    $("#inputAnimal").val("");

    renderButtons();

  }
  
});

$("#btn-clear").on("click", function() {
  $("#gifs-view").empty();
});

// resets the initial list of buttons
renderButtons();