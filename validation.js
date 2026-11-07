function validateName(value) {
    var name = value.trim();

    if (name.length < 2) {
        return "Enter at least 2 characters.";
    }

    var namePattern = /^[\p{L}]+(?:[ '\u2019-][\p{L}]+)*$/u;

    if (!namePattern.test(name)) {
        return "Use letters, spaces, apostrophes or hyphens only.";
    }

    return "";
}

function validateEmail(value) {
    var email = value.trim();
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {
        return "Enter your email address.";
    }

    if (!emailPattern.test(email)) {
        return "Enter a valid email, for example name@example.com.";
    }

    return "";
}

function validatePassword(value) {
    if (value.length < 8) {
        return "Use at least 8 characters.";
    }

    if (!/[a-zA-Z]/.test(value) || !/[0-9]/.test(value)) {
        return "Include at least one letter and one number.";
    }

    return "";
}

function validateConfirmation(password, confirmation) {
    if (confirmation === "") {
        return "Confirm your password.";
    }

    if (password !== confirmation) {
        return "Passwords do not match.";
    }

    return "";
}

function validateMessage(value) {
    if (value.trim().length < 10) {
        return "Enter a message with at least 10 characters.";
    }

    return "";
}


function showFieldError(selector, message) {
    var input = $(selector);
    var field = input.closest(".account-field, .contact-field");
    var error = field.find(".field-error");
    var errorId = input.attr("id") + "-error";


    var description = input.attr("aria-describedby") || "";
    description = description.replace(errorId, "").trim();

    if (message !== "") {
        if (error.length === 0) {
            error = $("<small>");
            error.addClass("field-error");
            error.attr("id", errorId);
            field.append(error);
        }

        error.text(message);
        input.addClass("input-error");
        input.attr("aria-invalid", "true");
        input.attr(
            "aria-describedby",
            (description + " " + errorId).trim()
        );

        return false;
    }

    error.remove();
    input.removeClass("input-error");
    input.removeAttr("aria-invalid");

    if (description === "") {
        input.removeAttr("aria-describedby");
    } else {
        input.attr("aria-describedby", description);
    }

    return true;
}

function showSuccess(selector, message) {
    $(selector)
        .stop(true, true)
        .hide()
        .text(message)
        .fadeIn(250);
}

function hideSuccess(selector) {
    $(selector).stop(true, true).fadeOut(150);
}

function focusFirstError(form) {
    $(form).find(".input-error").first().trigger("focus");
}