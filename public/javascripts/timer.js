function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = minutes == 2 ? 0 : parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            const resendBtn = document.getElementById('resend-btn')
            resendBtn.classList.remove('disabled')
            display.innerText = ""

        }
    }, 1000);
}

window.onload = function (e) {
    const otpCreatedAtISO = document.getElementById('otpCreatedAt').innerText
    const otpCreatedAtEpoch = new Date(otpCreatedAtISO).getTime();
    var minutes = (otpCreatedAtEpoch + (120000) - (new Date().getTime())) * 0.000016667 * 60;
    display = document.querySelector('#time');
    startTimer(minutes, display);
};

function onclick() {
    const resendBtn = document.getElementById('resend-btn')
    resendBtn.classList.add('disabled')
    display = document.querySelector('#time');
    startTimer(120, display)
    preventSubmit()
}
