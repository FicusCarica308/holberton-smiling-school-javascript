$( document ).ready(function() {

    /* OTHER FUNCTIONS */
    function displayLoader(loadStatus, type) {
        if (loadStatus == true) {
            $(`#${type}`).wrap('<div class="loader"></div>');
        } else {
            $(`#${type}`).unwrap();
        }
    }

    function customCardByCard(type) {
        $(`.${type}-card-by-card .carousel-inner .carousel-item`).each(function(){
            var next = $(this).next();
            if (!next.length) {
            next = $(this).siblings(':first');
            }
            next.children(':first-child').clone().appendTo($(this));
            
            for (var i=0;i<2;i++) {
                next=next.next();
                if (!next.length) {
                    next = $(this).siblings(':first');
                }
                
                next.children(':first-child').clone().appendTo($(this));
            }
        });
    }

    function getItems(type) {
        const url = `https://smileschool-api.hbtn.info/${type}`
        let createElement = NaN;
        if (type == "quotes"){
            createElement = createQuote();
        } else if (type == "popular-tutorials" || type == "latest-videos") {
            createElement = createVideo(type);
        }
        displayLoader(true, type);
        $.ajax({
            url: url,
            method: "GET",
            timeout: 0500 /*needs to display error properly*/
        })
        .done((data) => {
            /*set timeout to show off loader element*/
            setTimeout(()=>{
                for (item in data) {
                    createElement(data[item]);
                }
                if (type == "popular-tutorials" || type == "latest-videos") {
                    customCardByCard(type);
                }
                displayLoader(false, type);
            }, 0800);
        })
        .fail(() => {
            alert("Quotes unavaliable - ajax failed")
        })
    }

    /*=======================================================================*/

    /*DYNAMIC LOAD OF QUOTE CAROSEL*/

    function createQuote() {
        return function newQuote(dataItem) {
            const ifFirst = `<div class="carousel-item active" id="quote-${dataItem.id}">`;
            const ifNotFirst = `<div class="carousel-item" id="quote-${dataItem.id}">`;
            $("#quotes").append(`
            ${(dataItem.id == 1) ? ifFirst : ifNotFirst}
                <div class="d-flex justify-content-center flex-column flex-md-row align-items-center">
                    <img class="rounded-circle d-block p-5" src="${dataItem.pic_url}" alt="First slide" width="250" height="250">
                    <div class="d-flex flex-column p-2">
                        <h5 class="text-light mb-5">${dataItem.text}</h5>
                        <h4 class="text-light mb-0 font-weight-bold">${dataItem.name}</h4>
                        <h5 class="text-light font-weight-light font-italic ">${dataItem.title}</h5>
                    </div>
                </div>
            </div>
            `);
        };
    }
    /*==================================================*/

    /*DYNAMIC LOAD OF POPULAR TUTORIALS CAROSEL*/

    function createVideo(type) {
        return function newVideo(dataItem) {
            const ifFirst = `<div class="carousel-item active" id="video-${dataItem.id}">`;
            const ifNotFirst = `<div class="carousel-item" id="video-${dataItem.id}">`;
            $(`#${type}`).append(`
            ${(dataItem.id == 1) ? ifFirst : ifNotFirst}
                <div class="card w-75 mr-4 border-0 pl-sm-4 pl-md-1" style="width: 18rem;">
                <div class="card-header card-header-custom" id="card-header-${dataItem.id}">
                    <img class="play-image" src="./images/play.png">
                </div>
                <div class="card-body p-2 p-md-3">
                    <h5 class="card-title font-weight-bold pt-1">${dataItem.title}</h5>
                    <p class="card-text text-secondary">${dataItem["sub-title"]}</p>
                    <div class="d-flex flex-row pt-3">
                        <img class="rounded-circle" src="${dataItem.author_pic_url}" width="50">
                        <p class="accent-colors pl-2 my-auto font-weight-bold">${dataItem.author}</p>
                    </div>
                    <div class="d-flex flex-row text-center">
                        <div class="mr-5 d-flex w-50 flex-row" id="stars-video-${dataItem.id}">
                        </div>
                        <p class="mx-auto accent-colors font-weight-bold">8 min</p>
                    </div>
                </div>
            </div>
            `);
            let starStatus = "";
            for (let i = 0; i <= 4; i++) {
                if (i < dataItem.star) {
                    starStatus = "star_on.png";
                } else {
                    starStatus = "star_off.png";
                }
                $(`#stars-video-${dataItem.id}`).append(`<img src="./images/${starStatus}" class="mr-1 mt-1" width="15" height="15">`)
            } 
            $(`#card-header-${dataItem.id}`).css("background-image", `url("${dataItem.thumb_url}")`)
        };
    }
    
    /* MAIN */
    getItems("quotes");
    getItems("popular-tutorials");
    getItems("latest-videos")
});
