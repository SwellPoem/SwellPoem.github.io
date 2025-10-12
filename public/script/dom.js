const formElems = document.querySelectorAll("#contact-form input, #contact-form textarea");
const slides = document.querySelectorAll(".caroussel-content > *");
const autoDefil = document.querySelector(".caroussel .auto");
const carousselContainer = document.querySelector(".caroussel");
let progress = document.querySelector(".caroussel .progress");

export class Form {
    constructor() {
        this.inputs = [];
        this.mailRule = /^[a-z][-._a-z0-9]*@[a-z0-9][-.a-z0-9]+\.[a-z]{2,}$/i;
        this.basicRules = /^.{1,60}$/;
        this.messageRule = /^.{10,500}$/;

        formElems.forEach(elem => { 
            elem["originalPlaceholder"] = elem.getAttribute("placeholder");
            const err = elem.getAttribute("data-err");
            let regex = this.basicRules;
            switch (elem.name) {
                case "e-mail":
                    regex = this.mailRule;
                    break;
                case "message":
                    regex = this.messageRule;
                    break;
            }
            this.inputs.push({ 
                elem,
                regex,
                err
            });
            elem.addEventListener("blur", () => this.check(regex, elem, err)) // listen for focus change on inputs
        })
    }

    submitForm = () => { 
        let error = false;
        this.inputs.forEach(input => { 
            if (!this.check(input.regex, input.elem, input.err)) error = true;
        })
        if (error) { 
            displayPopup("fail", ":/ At least one wrong entry");
            return;
        }
        displayPopup("success", "Success !");
        // revert form back to its original state
        this.inputs.forEach(({ elem:input }) => {
            input.value = "";
            input.className = "";
        }); // clear input entries
        closeModal(); // close the modal
    }

    check = (regEx, input, errorTxt) => { // check if one input is valid
        if (regEx.test(input.value)) { // test regex
            // succes
            input.className = "success";
            input.setAttribute("placeHolder", input.originalPlaceholder);
            return true;
        }
        // fail
        input.className = "fail";
        input.value = "";
        input.setAttribute("placeHolder", errorTxt);
        return false;
    }
}

export class Caroussel {
    constructor() {
        this.container = carousselContainer; 
        this.slides = slides; 
        slides.forEach((e, i) => { 
            const dot = document.createElement("div");
            dot.className = "dot";
            progress.appendChild(dot);
            dot.addEventListener("click", () => this.goToSlide(i));
        })
        progress = progress.querySelectorAll("*");
        progress[0].className = "dot active";

        this.actualSlide = 0;
        this.autoSlideInterval = false;
    }

    changeSlide = (to) => {
        if (!this.opened) return; // don't change slide if caroussel closed
        // hide last slide
        slides[this.actualSlide].className = "hidden-slide";
        const element = slides[this.actualSlide].querySelector("video, img");
        if(element.tagName.toLowerCase() === 'video') {
            element.pause(); // pause video to save perfs
        }
        // defines next slide to display
        this.actualSlide += to;
        if (this.actualSlide < 0) this.actualSlide = slides.length-1;
        else if (this.actualSlide >= slides.length) this.actualSlide = 0;
        // display wanted slide
        slides[this.actualSlide].className = "active";
        // update dot progress
        progress.forEach(dot => dot.className = "dot");
        progress[this.actualSlide].className = "dot active";
    }

    goToSlide = (to) => {
        if (to >= slides.length || to < 0) return;
        this.pause()
        slides[this.actualSlide].className = "hidden-slide"; // hide last image
        const element = slides[this.actualSlide].querySelector("video, img");
        if (element.tagName.toLowerCase() === 'video') {
            element.pause(); // pause video to save perfs
        }
        this.actualSlide = to;
        this.changeSlide(0);
    }
    
    play = () => {
        if (this.autoSlideInterval) return pause();
        this.autoSlideInterval = setInterval(() => {
            if (document.querySelector(".caroussel .text:hover")) return;
            this.changeSlide(1);
        }, 6000);
        autoDefil.setAttribute("data-state", "play");
    }

    pause = () => {
        if (!this.autoSlideInterval) return;
        clearInterval(this.autoSlideInterval);
        this.autoSlideInterval = false;
        autoDefil.setAttribute("data-state", "pause"); 
    }

    open = () => { // handle everything necessary on opening of carousel mode
        const element = slides[this.actualSlide].querySelector("video, img");
        if (element.tagName.toLowerCase() === 'video') {
            element.play();
        }
        this.opened = true;
    }
    
    close = () => {
        const element = this.slides[this.actualSlide].querySelector("video, img");
        if (element.tagName.toLowerCase() === 'video') {
            element.pause();
        }
        this.opened = false;
    }
}
