$(document).ready(function () {
    var demoEmail = "demo@tamyr.com";
    var demoPassword = "Tamyr123";

    var registerForm = document.getElementById("register-form");
    var signinForm = document.getElementById("signin-form");

    function validateRegistration() {
        var name = $("#register-name").val();
        var email = $("#register-email").val();
        var password = $("#register-password").val();
        var confirmation = $("#register-confirm").val();

        var nameValid = showFieldError(
            "#register-name",
            validateName(name)
        );

        var emailValid = showFieldError(
            "#register-email",
            validateEmail(email)
        );

        var passwordValid = showFieldError(
            "#register-password",
            validatePassword(password)
        );

        var confirmationValid = showFieldError(
            "#register-confirm",
            validateConfirmation(password, confirmation)
        );

        return nameValid && emailValid &&
            passwordValid && confirmationValid;
    }

    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();
        hideSuccess("#register-message");

        if (!validateRegistration()) {
            focusFirstError(registerForm);
            return;
        }

        demoEmail = $("#register-email").val().trim().toLowerCase();
        demoPassword = $("#register-password").val();

        $("#signin-email").val(demoEmail);
        $("#signin-password").val("");
        hideSuccess("#signin-message");

        showFieldError("#signin-email", "");
        showFieldError("#signin-password", "");

        showSuccess(
            "#register-message",
            "Demo registration successful. You can now sign in in this tab."
        );

        registerForm.reset();
    });

    signinForm.addEventListener("submit", function (event) {
        event.preventDefault();
        hideSuccess("#signin-message");

        var email = $("#signin-email").val().trim().toLowerCase();
        var password = $("#signin-password").val();

        var emailValid = showFieldError(
            "#signin-email",
            validateEmail(email)
        );

        var passwordMessage = "";

        if (password === "") {
            passwordMessage = "Enter your password.";
        }

        var passwordValid = showFieldError(
            "#signin-password",
            passwordMessage
        );

        if (!emailValid || !passwordValid) {
            focusFirstError(signinForm);
            return;
        }

        if (email !== demoEmail || password !== demoPassword) {
            showFieldError(
                "#signin-password",
                "Email or password does not match the demo account."
            );

            focusFirstError(signinForm);
            return;
        }

        showSuccess(
            "#signin-message",
            "Demo sign-in successful. No real authentication is performed."
        );

        $("#signin-password").val("");
    });

    $("#register-form input").on("input", function () {
        hideSuccess("#register-message");

        if ($("#register-form").find(".field-error").length > 0) {
            validateRegistration();
        }
    });

    $("#signin-form input").on("input", function () {
        hideSuccess("#signin-message");

        // A mismatch concerns both credentials, so clear it when editing.
        showFieldError("#signin-email", "");
        showFieldError("#signin-password", "");
    });
});