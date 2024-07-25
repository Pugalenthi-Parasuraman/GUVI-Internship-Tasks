$(document).ready(function () {
  if (localStorage.getItem("rememberMe") === "true") {
    $("#login-username").val(localStorage.getItem("username"));
    $("#login-password").val(localStorage.getItem("password"));
    $("#form-checkbox").prop("checked", true);
  }

  $("#loginForm").on("submit", function (event) {
    event.preventDefault();

    var formData = $(this).serialize();
    var rememberMe = $("#form-switch").is(":checked");
    console.log("clicked");
    console.log(formData);
    loginUser(formData, rememberMe);
  });
});

function loginUser(formData, rememberMe) {
  $.ajax({
    type: "POST",
    url: "php/login.php",
    dataType: "json",
    data: formData,
    success: function (response) {
      console.log(response);

      var res;
      try {
        res = response;
      } catch (error) {
        console.error("Failed:", error);
        return;
      }

      if (res.status === "success") {
        localStorage.setItem("email", res.email);
        if (rememberMe) {
          localStorage.setItem("session_token", res.token);
          localStorage.setItem("rememberMe", true);
          localStorage.setItem("username", $("#login-username").val());
          localStorage.setItem("password", $("#login-password").val());
        } else {
          sessionStorage.setItem("session_token", res.token);
          localStorage.removeItem("rememberMe");
          localStorage.removeItem("username");
          localStorage.removeItem("password");
        }
        window.location.href = "profile.html";
      } else {
        alert(res.message);
      }
    },
    error: function (xhr, status, error) {
      console.error("AJAX Error:", status, error);
      console.error("Response Text:", xhr.responseText);
      alert(data);
      alert(
        "An error occurred while fetching your profile data. Please try again."
      );
    },
  });
}
