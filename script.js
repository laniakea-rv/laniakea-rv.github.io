let gImages = [
    'ads/ad0.jpg',
    'ads/ad1.jpeg',
    'ads/ad2.jpeg',
    'ads/ad3.jpg',
    'ads/ad4.jpg',
];

function getRandomGImage() {
    let randomIndex = Math.floor(Math.random() * gImages.length);
    return gImages[randomIndex];
}


const knopje = document.getElementById('startGamble');
const gambleDiv = document.getElementById('gambles');
const moneyDisp = document.getElementById('moneyDisplay');
const winDisp = document.getElementById('winDisplay');
const audios = document.querySelectorAll('audio');
const gs = gambleDiv.children;

const rewDisp = document.querySelector('#increaseReward span')
const rewButton = document.querySelector('#increaseReward button')
const adButton = document.querySelector('#adBlock button')

const icons = [
    'gambles/bar.png',
    'gambles/cherries.png',
    'gambles/diamond.png',
    'gambles/grapes.png',
    'gambles/lemon.png',
    'gambles/orange.png',
    'gambles/777.png',
    'gambles/watermelon.png',
    'gambles/seven.png'
]

let upgrades = {
    multiplier: {
        price: 25,
        multiplier: 1,
    },
    adBlock: {
        price: 500,
        obtained: false,
    }
}

let num1 = null;
let num2 = null;
let num3 = null;

let money = parseInt(localStorage.getItem("money")) || 100;
const normalPay = 15;
const jackpotMultiplier = 8;
const betterMultiplier = 5;
const masterVol = 6;
const forcedJackpot = false;
const fjNumber = 7;
const ads = true;
const pings = false;

const savedMultiplier = JSON.parse(localStorage.getItem("upgrades_multiplier"));
if (savedMultiplier) {
    upgrades.multiplier = savedMultiplier;
}

rewButton.textContent = `$${upgrades.multiplier.price}`;
rewDisp.textContent = `Increase payout (x${upgrades.multiplier.multiplier})`;
moneyDisp.textContent = `wallet: $${money}`;

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function uptMon(prevNum, pause) {
    localStorage.setItem("money", money);
    if (!prevNum) {
        moneyDisp.textContent = `wallet: $${money}`;
    } else {
        for (let i = 0; i < money - prevNum; i++) {
            moneyDisp.textContent = `wallet: $${prevNum + (i + 1)}`;
            await wait(pause)
        }
        moneyDisp.textContent = `wallet: $${money}`;
    }
}

async function rFunc(ding, index) {
    let waitTime = 50;

    ding.style.transition = "transform 0.1s ease-in";
    ding.style.transform = "translateY(45px)";

    await wait(100);

    for (let i = 0; i < 15; i++) {
        ding.style.transition = "none";
        ding.style.transform = "translateY(-45px)";

        ding.src = icons[Math.ceil(Math.random() * 9) - 1];

        await wait(25);

        audios[1].playbackRate = 5;
        audios[1].volume = 0.1 * masterVol;
        audios[1].play();

        ding.style.transition = "transform 0.05s ease-out";
        ding.style.transform = "translateY(45px)";

        waitTime += 5;
        await wait(waitTime);
    }

    let finalNum;
    if (forcedJackpot) {
        finalNum = fjNumber;
    } else {
        finalNum = Math.ceil(Math.random() * 9);
    }
    ding.src = icons[finalNum - 1];

    audios[3].currentTime = 0;
    audios[3].volume = 0.6;
    audios[3].play();

    ding.style.transition = "transform 0.3s ease-out";
    ding.style.transform = "translateY(0)";

    await wait(200)

    if (index === 0) num1 = finalNum;
    if (index === 1) num2 = finalNum;
    if (index === 2) num3 = finalNum;
}

async function ad() {
    const adFrame = Object.assign(document.createElement('div'), {
        style: 'position:fixed;width:60%;height:60%;background:none;'
    });

    const img = Object.assign(document.createElement('img'), {
        src: getRandomGImage(),
        style: 'width:100%;height:100%;border-radius:5px;'
    });

    const butain = Object.assign(document.createElement('button'), {
        textContent: 'x',
        disabled: true,
        style: 'position:absolute;width:50px;height:50px;top:0;right:0;background:none;color:grey;border:none;'
    });

    const anchor = Object.assign(document.createElement('a'), {
        href: 'https://th.bing.com/th/id/OIP.spzGqof-VJa1NdRJiaPjEwHaE8?rs=1&pid=ImgDetMain',
        target: '_blank',
        textContent: 'click here to see why you get these ads',
        style: 'position:absolute;bottom:-20px;left:0;text-decoration:none;color:gray;width:100%;'
    });

    [butain, img, anchor].forEach(el => adFrame.appendChild(el));
    document.body.appendChild(adFrame);

    await wait(2500);
    butain.disabled = false;
    butain.style.color = 'white';

    butain.onclick = () => {
        if (Math.ceil(Math.random() * 10) > 8) {
            window.open(anchor.href, '_blank');
            audios[6].currentTime = 0;
            audios[6].play();
        } else {
            adFrame.remove();
        }
    };

    anchor.onclick = () => {
        audios[6].currentTime = 0;
        audios[6].play();
    };
}

async function gamble() {
    knopje.disabled = true;

    if (pings) {
        if (Math.ceil(Math.random() * 100) > 99) {
            audios[5].volume = 0.4;
            audios[5].play();
        }
    }
    if (ads && upgrades.adBlock.obtained != true) {
        if (Math.ceil(Math.random() * 100) > 85) {
            ad();
        }
    }

    if (money - 5 <= 0) {
        function startCountdown() {
            let timeLeft = 5;

            const countdownInterval = setInterval(() => {
                winDisp.textContent = `not enough money to gamble, resetting money in ${timeLeft} seconds`;

                timeLeft--;

                if (timeLeft < 0) {
                    clearInterval(countdownInterval);
                    winDisp.textContent = "money reset, you may gamble again";
                    money = 50;
                    uptMon(0, 10);
                    knopje.disabled = false;
                }
            }, 1000);
        }

        startCountdown();
    } else {
        money -= 5;
        winDisp.textContent = `rolling...`;
        uptMon();

        const spin0 = rFunc(gs[0].querySelector("img"), 0);
        await wait(150);
        const spin1 = rFunc(gs[1].querySelector("img"), 1);
        await wait(150);
        const spin2 = rFunc(gs[2].querySelector("img"), 2);
        await Promise.all([spin0, spin1, spin2]);
        console.log(num1, num2, num3);

        if (num1 == 7 && num1 == num2 && num2 == num3) {
            const b = money;
            let payout = Math.floor(normalPay * (jackpotMultiplier * betterMultiplier));
            money += Math.floor(payout * upgrades.multiplier.multiplier);
            winDisp.textContent = `SUPER JACKPOTTT! + $${Math.floor(payout * upgrades.multiplier.multiplier)}`;
            audios[0].currentTime = 0;
            audios[0].volume = 0.5;
            audios[0].play();
            audios[2].currentTime = 0;
            audios[2].volume = 1;
            audios[2].play();
            audios[4].volume = 0.5;
            audios[4].play();
            await uptMon(b, (5 / upgrades.multiplier.multiplier));
        } else if (num1 == num2 && num2 == num3) {
            const b = money;
            let payout;
            if (num1 == 1 || num2 == 1 || num3 == 1) {
                payout = (normalPay * jackpotMultiplier * 1.5);
            } else {
                payout = (normalPay * jackpotMultiplier);
            }
            money += Math.floor(payout * upgrades.multiplier.multiplier);
            winDisp.textContent = `jackpot! + $${Math.floor(payout * upgrades.multiplier.multiplier)}`;
            audios[0].currentTime = 0;
            audios[0].volume = 0.5;
            audios[0].play();
            audios[2].currentTime = 0;
            audios[2].volume = 1;
            audios[2].play();
            audios[4].volume = 0.5;
            audios[4].play();
            await uptMon(b, (25 / upgrades.multiplier.multiplier));
        } else if (num1 == num2 || num2 == num3) {
            const b = money;
            let payout;
            if (num1 == 1 || num2 == 1 || num3 == 1) {
                payout = (normalPay * 1.5);
            } else {
                payout = normalPay;
            }
            money += Math.floor(payout * upgrades.multiplier.multiplier);
            winDisp.textContent = `big win! + $${Math.floor(payout * upgrades.multiplier.multiplier)}`;
            audios[2].currentTime = 0;
            audios[2].volume = 1;
            audios[2].play();
            await uptMon(b, (15 / upgrades.multiplier.multiplier));
        } else if ((num1 == num3) || ((num1 == 3 || num2 == 3 || num3 == 3))) {
            const b = money;
            let payout;
            if (num1 == 1 || num2 == 1 || num3 == 1) {
                payout = (normalPay);
            } else {
                payout = Math.floor(normalPay / 2);
            }
            money += Math.floor(payout * upgrades.multiplier.multiplier);
            winDisp.textContent = `win! + $${Math.floor(payout * upgrades.multiplier.multiplier)}`;
            audios[2].currentTime = 0;
            audios[2].volume = 1;
            audios[2].play();
            await uptMon(b, (15 / upgrades.multiplier.multiplier));
        } else {
            winDisp.textContent = `no win :(`
        }
        knopje.disabled = false;
    }
}

async function rewUpgrade() {
    if (money >= upgrades.multiplier.price) {
        money -= upgrades.multiplier.price;
        upgrades.multiplier.multiplier += 1;
        upgrades.multiplier.price *= 3;
        uptMon();
        rewButton.textContent = `$${upgrades.multiplier.price}`;
        rewDisp.textContent = `Increase payout (x${upgrades.multiplier.multiplier})`;
        localStorage.setItem("upgrades_multiplier", JSON.stringify(upgrades.multiplier));
    }
}

async function adUpgrade() {
    if (money >= upgrades.adBlock.price && !upgrades.adBlock.obtained) {
        money -= upgrades.adBlock.price;
        upgrades.adBlock.obtained = true;
        uptMon();
        adButton.textContent = `Already purchased`;
        adButton.disabled = true;
        await wait(300000)
        adButton.textContent = `$${upgrades.adBlock.price}`;
        upgrades.adBlock.obtained = false;
        adButton.disabled = false;
    }
}

knopje.addEventListener("click", gamble);
rewButton.addEventListener("click", rewUpgrade);
adButton.addEventListener("click", adUpgrade);