$(function() {
    $(".polygon").mouseenter(function() {
        var height = $(this).outerHeight();
        var width = $(this).outerWidth();
        $("#dimensions").text("Face Dimensions: " + width + " x " + height);
    })
})