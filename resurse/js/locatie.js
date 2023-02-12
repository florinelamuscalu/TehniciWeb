const links = document.querySelectorAll('a[href^="#"]');
for (link of links) {
    link.addEventListener('click', function (event) {
        event.preventDefault();

        const targetId = this.getAttribute('href').split('#')[1];
        console.log(targetId)

        if (targetId) {
            document.getElementById(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
}

window.addEventListener("load", function () {
    const currentPageURL = window.location.pathname;
    console.log(currentPageURL)
    let semn = currentPageURL.indexOf("/");
    let cuvant = currentPageURL.substr(semn + 1, currentPageURL.lengt);
    console.log(cuvant)

    const nav = document.querySelectorAll("ul li a");
    
    const href = []
    for (a of nav) {
        href.push(a.getAttribute('href'))
        if (cuvant == a.getAttribute('href')) {
            console.log("aaa")
            a.style.color = "black";
        }
    }
});



