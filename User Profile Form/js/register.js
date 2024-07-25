$(document).ready(function () {
  $("#registerForm").on("submit", function (event) {
    registerFormSubmit(event, this);
  });
});

let registerFormSubmit = (event, form) => {
  event.preventDefault();
  let data = $(form).serialize();
  console.log(data);
  $.ajax({
    type: "POST",
    url: "php/register.php",
    data: data,
    success: function (response) {
      console.log(response);
      var res = response;
      alert(res.message);
      if (res.status === "success") {
        window.location.href = "login.html";
      }
    },
    error: function (xhr, status, error) {
      console.error("AJAX Error:", status, error);
      console.error("Response Text:", xhr.responseText);
      alert(
        "An error occurred while fetching your profile data. Please try again."
      );
    },
  });
};
