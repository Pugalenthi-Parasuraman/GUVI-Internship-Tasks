$(document).ready(function () {
  var token = getToken();
  console.log(token);

  if (!token) {
    redirectToLogin();
    return;
  }

  populateProfileFields();

  $("#profileForm").on("submit", function (event) {
    handleProfileFormSubmit(event, token);
  });

  $("#logoutBtn").on("click", function () {
    logout();
  });
});

let getToken = () => {
  return (
    localStorage.getItem("session_token") ||
    sessionStorage.getItem("session_token")
  );
};

let redirectToLogin = () => {
  console.log("Login first");
  window.location.href = "login.html";
};

let getStoredEmail = () => {
  return localStorage.getItem("email");
};

let populateProfileFields = () => {
  var storedEmail = getStoredEmail();
  if (storedEmail) {
    $("#email").val(storedEmail);
    fetchProfileData(storedEmail);
  }
};

let setProfileFields = (profile) => {
  $("#name").val(profile.name || "");
  $("#phone").val(profile.phone || "");
  $("#dob").val(profile.dob || "");
  $("#age").val(profile.age || "");
  $("#address").val(profile.address || "");
  $("#country").val(profile.country || "");
  $("#state").val(profile.state || "");
  $(".span-name").text(profile.name || "Avatar");
  $(".span-email").text(profile.email || "avatar@gmail.com");
};

let fetchProfileData = (email) => {
  $.ajax({
    type: "GET",
    url: "php/profile.php",
    data: { email: email },
    dataType: "json",
    success: function (response) {
      console.log(response);

      if (response.status === "success") {
        setProfileFields(response.profile);
      } else {
        console.error("Error:", response.message);
      }
    },
    error: function (xhr, status, error) {
      console.error("AJAX Error:", status, error);
      console.error("Response Text:", xhr.responseText);
      showAlertMessage(
        "An error occurred while fetching your profile data. Please try again."
      );
    },
  });
};

let handleProfileFormSubmit = (event, token) => {
  event.preventDefault();
  console.log("Form submitted");

  $("#email").prop("disabled", false);
  var data = $("#profileForm").serialize() + "&token=" + token;
  $("#email").prop("disabled", true);

  console.log(data);
  $.ajax({
    type: "POST",
    url: "php/profile.php",
    data: data,
    dataType: "json",
    success: function (response) {
      console.log(response);
      try {
        var res = response;
        showAlertMessage(res.message);
      } catch (e) {
        console.error("Error parsing JSON response:", e);
        showAlertMessage("An error occurred. Please try again.");
      }
    },
    error: function (xhr, status, error) {
      console.error("AJAX Error:", status, error);
      console.error("Response Text:", xhr.responseText);
      showAlertMessage(
        "An error occurred while processing your request. Please try again."
      );
    },
  });
};

let showAlertMessage = (message) => {
  alert(message);
};

let logout = () => {
  localStorage.removeItem("session_token");
  localStorage.removeItem("email");
  sessionStorage.removeItem("session_token");

  redirectToLogin();
};
