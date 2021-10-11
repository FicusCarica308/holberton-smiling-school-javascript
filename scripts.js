window.onload = function main() {

    function displayLoader(loadStatus) {
        if (loadStatus == true) {
            $("#quote-container").wrap('<div class="loader"></div>');
        } else {
            $("#quote-container").unwrap();
        }
    }

    function getQuotes() {
        const url = "https://smileschool-api.hbtn.info/quotes"
        displayLoader(true);
        $.ajax({
            url: url,
            method: "GET",
            timeout: 0500 /*needs to display error properly*/
        })
        .done((data) => {
            /*set timeout to show off loader element*/
            setTimeout(()=>{
                for (item in data) {
                    createQuote(data[item]);
                }
                displayLoader(false);
            }, 0800);
        })
        .fail(() => {
            alert("Quotes unavaliable - ajax failed")
        })
    }

    function createQuote(dataItem) {
        const ifFirst = `<div class="carousel-item active" id="quote-${dataItem.id}">`;
        const ifNotFirst = `<div class="carousel-item" id="quote-${dataItem.id}">`;
        $("#quote-container").append(`
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
        `)
    }


    getQuotes();
}