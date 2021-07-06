const tiles = document.getElementById("tiles");

const initTiles = (speed = 1500) => {
    const shuffle = arr => {
        return [...arr].map((_, i, arrCopy) => {
            var rand = i + (Math.floor(Math.random() * (arrCopy.length - i)));
            [arrCopy[rand], arrCopy[i]] = [arrCopy[i], arrCopy[rand]]
            return arrCopy[i];
        })
    }

    document.addEventListener("DOMContentLoaded", e => {
        let initImgs = document.querySelectorAll("#tiles img");
        let imgGroup = [];
        let countToRemove = initImgs.length - 10;

        tiles.innerHTML = '';
        initImgs.forEach(imgNode => {
            let item = document.createElement("li");
            let img = document.createElement("img")
            item.className = "about-us-tiles__item";
            let itemImg = item.appendChild(img);
            tiles.appendChild(item);
            itemImg.setAttribute("src", imgNode.getAttribute("src"))
        });
        let imgs = document.querySelectorAll("#tiles img");


        imgs.forEach((img, i) => {
            imgGroup.push({
                path: img.getAttribute("src"),
                key: i,
                status: "init",
            });
        });


        if (imgs.length > 9) {
            for (let i = 0; i < countToRemove; i++) {
                tiles.removeChild(tiles.lastElementChild);
            }
        }


        let imgsToRender;

        imgsToRender = shuffle(imgGroup);
        imgsToRender = imgsToRender.splice(0, 10);
        imgsToRender.forEach(item => {
            item.status = "active";
        });

        let _imgs = [...imgs].slice(0, imgs.length - countToRemove);


        _imgs.forEach((img, i) => {
            img.setAttribute("src", imgsToRender[i].path);
            img.setAttribute("srcset", imgsToRender[i].path);
        });

        let active, unActive, j, randomNumbers = [];
        unActive = imgGroup.filter(img => img.status === "init");
        active = imgGroup.filter(img => img.status === "active");
        const getRandom = (collection) => {

            let i = Math.floor(Math.random() * collection.length);
            if (j === i) {
                i = getRandom(collection);
            }
            j = i;
            return i;
        }

        setInterval(() => {
            let randomUnActive = getRandom(unActive);
            let randomActive = getRandom(active);
            if (randomNumbers[randomNumbers.length - 1] === randomActive) {
                if (randomActive === 0) {
                    randomActive++;
                } else if (randomActive === 9) {
                    randomActive--;
                } else {
                    randomActive++;
                }
            }
            imgs.forEach(img => {
                img.classList.remove("flip");
            });
            randomNumbers.push(randomActive);

            if (randomNumbers.length > 10) {
                randomNumbers.splice(randomNumbers.length - 10, 1)
            }
            imgs[randomActive].classList.add("flip");
            let cur = imgGroup.filter(img => img.path === imgs[randomActive].getAttribute("src"));
            [cur] = cur;

            imgs[randomActive].setAttribute("src", unActive[randomUnActive].path);
            imgs[randomActive].setAttribute("srcset", unActive[randomUnActive].path);
            unActive[randomUnActive].status = "active";
            cur.status = "init";
            active = imgGroup.filter(img => img.status === "active");
            unActive = imgGroup.filter(img => img.status === "init");
        }, speed);
        tiles.style.opacity = "1";
        tiles.style.visibility = "visible";
    });
}
if (tiles) {
    initTiles();
}