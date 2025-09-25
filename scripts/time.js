function getTime() {
    var hour = new Date().getHours();
    var minute = new Date().getMinutes();
    var day = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

    if (hour < 10) {
        hour = "0" + hour;
    }

    if (minute < 10) {
        minute = "0" + minute;
    }

    if (day < 10) {
        day = "0" + day;
    }

    if (month < 10) {
        month = "0" + month;
    }

    var time = hour + ":" + minute;
    var date = day + "/" + month + "/" + year;

    insertTime(time, date);
}

function insertTime(time, date) {
    document.getElementById("time").innerHTML = time;
    document.getElementById("date").innerHTML = date;
}

window.onload = getTime;
setInterval(getTime, 1000);