const popup = document.querySelector(".popup");

window.toRadian = (angle) => { // convert degree to radian
    return angle * Math.PI/180;
}

window.playAudio = (target) => { // play audio and reset it (to be able to replay it just after)
    target.audio.play();
    return new Audio(target.src);
}

window.setColors = (to) => { // set css color themes
    if (!colors[to]) return;
    
    document.documentElement.style.setProperty('--green', colors[to].css.green);
    document.documentElement.style.setProperty('--beige', colors[to].css.beige);
    document.documentElement.style.setProperty('--text', colors[to].css.text);
    document.documentElement.style.setProperty('--white', colors[to].css.white);
}

window.displayPopup = (customClass, message) => { // display popup (error or success) with custom message
    popup.innerHTML = message;
    popup.className = "popup active " + customClass;
    setTimeout(() => popup.className = "popup", 1500);
}
