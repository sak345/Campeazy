document.addEventListener('DOMContentLoaded', function () {
    var inputs = document.querySelectorAll('.digit-group input');

    inputs.forEach(function (input) {
        input.setAttribute('maxlength', 1);

        input.addEventListener('keyup', function (e) {
            var parent = this.parentElement;

            if (e.keyCode === 8 || e.keyCode === 37) {
                var prevInputId = input.getAttribute('data-previous');
                var prev = parent.querySelector('input#' + prevInputId);

                if (prev) {
                    prev.select();
                }
            } else if (
                (e.keyCode >= 48 && e.keyCode <= 57) ||
                (e.keyCode >= 65 && e.keyCode <= 90) ||
                (e.keyCode >= 96 && e.keyCode <= 105) ||
                e.keyCode === 39
            ) {
                var nextInputId = input.getAttribute('data-next');
                var next = parent.querySelector('input#' + nextInputId);

                if (next) {
                    next.select();
                } else {
                    var autosubmit = parent.getAttribute('data-autosubmit');

                    if (autosubmit) {
                        parent.submit();
                    }
                }
            }
        });
    });
});
