$(document).ready(function () {
    var contactForm = document.getElementById("contact-form");

    function validateContact() {
        var firstNameValid = showFieldError(
            "#firstname",
            validateName($("#firstname").val())
        );

        var lastNameValid = showFieldError(
            "#lastname",
            validateName($("#lastname").val())
        );

        var emailValid = showFieldError(
            "#email",
            validateEmail($("#email").val())
        );

        var messageValid = showFieldError(
            "#message",
            validateMessage($("#message").val())
        );

        return firstNameValid && lastNameValid &&
            emailValid && messageValid;
    }

    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();
        hideSuccess("#contact-message");

        if (!validateContact()) {
            focusFirstError(contactForm);
            return;
        }

        showSuccess(
            "#contact-message",
            "Your details are valid. This is a demo; no message was sent."
        );

        contactForm.reset();
    });

    $("#contact-form input, #contact-form textarea").on(
        "input",
        function () {
            hideSuccess("#contact-message");

            if ($("#contact-form").find(".field-error").length > 0) {
                validateContact();
            }
        }
    );

    $(".faq-answer").hide();
    $(".faq-question").attr("aria-expanded", "false");

    $(".faq-question").on("click", function () {
        var button = $(this);
        var item = button.closest(".faq-item");
        var answer = item.find(".faq-answer");
        var isOpen = button.attr("aria-expanded") === "true";

        // Close other answers within this FAQ group.
        var otherItems = item.siblings(".faq-item");

        otherItems.find(".faq-question").attr("aria-expanded", "false");
        otherItems.find(".faq-answer").stop(true, true).slideUp(200);

        if (isOpen) {
            button.attr("aria-expanded", "false");
            answer.stop(true, true).slideUp(200);
        } else {
            button.attr("aria-expanded", "true");
            answer.stop(true, true).slideDown(200);
        }
    });
});