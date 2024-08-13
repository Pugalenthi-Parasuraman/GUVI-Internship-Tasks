"use strict";

$(document).ready(function () {
  var backendUrl = "https://fond-generally-stag.ngrok-free.app/Task%201/php";
  $("#registerForm").on("submit", function (event) {
    var formData = $(this).serialize();
    registerFormSubmit(event, formData, backendUrl);
  });
});

var registerFormSubmit = function registerFormSubmit(event, formData, backendUrl) {
  console.log(formData);
  event.preventDefault();
  $.ajax({
    type: "POST",
    url: "".concat(backendUrl, "/register.php"),
    data: formData,
    success: function success(response) {
      console.log(response);
      var res = response;
      alert(res.message);

      if (res.status === "success") {
        window.location.href = "login.html";
      }
    },
    error: function error(xhr, status, _error) {
      console.error("AJAX Error:", status, _error);
      console.error("Response Text:", xhr.responseText);
      alert("An error occurred while processing your request. Please try again.");
    }
  });
};