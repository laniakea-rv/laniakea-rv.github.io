let gImages = [
    'ads/ad0.jpg',
    'ads/ad1.jpeg',
    'ads/ad2.jpeg',
    'ads/ad3.jpg',
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

let num1 = null;
let num2 = null;
let num3 = null;

let money = 100;
const normalPay = 15;
const jackpotMultiplier = 3;
const betterMultiplier = 3;
const masterVol = 6;
const forcedJackpot = false;
const fjNumber = 7;

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function uptMon(prevNum, pause) {
    if (!prevNum) {
        moneyDisp.textContent = `wallet: $${money}`;
    } else {
        for (let i = 0; i < money - prevNum; i++) {
            moneyDisp.textContent = `wallet: $${prevNum + (i + 1)}`;
            await wait(pause)
        }
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
        audios[1].volume = 0.6;
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
    console.log('advertenco');
    let adFrame = document.createElement('div');
    adFrame.style.position = 'fixed';
    adFrame.style.width = '60%';
    adFrame.style.height = '60%';
    adFrame.style.background = 'none';

    let img = document.createElement('img');
    img.src = getRandomGImage();
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.borderRadius = '5px';

    let butain = document.createElement('button');
    butain.style.position = 'absolute';
    butain.style.width = '50px';
    butain.style.height = '50px';
    butain.textContent = 'x';
    butain.style.top = '0px';
    butain.style.right = '0px';
    butain.style.background = 'none';
    butain.style.color = 'grey';
    butain.style.border = 'none';
    butain.disabled = true;

    let anchor = document.createElement('a');
    anchor.href = 'https://th.bing.com/th/id/OIP.spzGqof-VJa1NdRJiaPjEwHaE8?rs=1&pid=ImgDetMain';
    anchor.target = '_blank';
    anchor.style.position = 'absolute';
    anchor.style.bottom = '-20px';
    anchor.style.left = '0px';
    anchor.style.textDecoration = 'none';
    anchor.style.color = 'gray';
    anchor.width = '100%';
    anchor.textContent = 'click here to see why you get these ads';

    document.body.appendChild(adFrame);
    adFrame.appendChild(butain);
    adFrame.appendChild(img);
    adFrame.appendChild(anchor);

    await wait(2500);
    butain.disabled = false;
    butain.style.color = 'white';

    butain.addEventListener('click', function () {
        adFrame.remove();
    });
    anchor.addEventListener('click', function () {
        audios[6].currentTime = 0;
        audios[6].play();
    });

}

async function gamble() {
    knopje.disabled = true;

    if (Math.ceil(Math.random() * 100) > 99) {
        audios[5].volume = 0.4;
        audios[5].play();
    }
    if (Math.ceil(Math.random() * 100) > 90) {
        ad();
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

        rFunc(gs[0].querySelector("img"), 0);
        await wait(150);
        rFunc(gs[1].querySelector("img"), 1);
        await wait(150);
        await rFunc(gs[2].querySelector("img"), 2);

        if (num1 == 7 && num1 == num2 && num2 == num3) {
            const b = money;
            let payout = normalPay * (jackpotMultiplier * betterMultiplier);
            money += payout;
            winDisp.textContent = `SUPER JACKPOTTT! + $${payout}`;
            audios[0].currentTime = 0;
            audios[0].volume = 0.5;
            audios[0].play();
            audios[2].volume = 1;
            audios[2].play();
            audios[4].volume = 0.5;
            audios[4].play();
            await uptMon(b, 25);
        } else if (num1 == num2 && num2 == num3) {
            const b = money;
            let payout;
            if (num1 == 0 || num2 == 0 || num3 == 0) {
                payout = (normalPay * jackpotMultiplier * 1.5);
            } else {
                payout = (normalPay * jackpotMultiplier);
            }
            money += payout;
            audios[0].currentTime = 0;
            audios[0].volume = 0.5;
            audios[0].play();
            winDisp.textContent = `jackpot! + $${payout}`;
            audios[2].volume = 1;
            audios[2].play();
            audios[4].volume = 0.5;
            audios[4].play();
            await uptMon(b, 30);
        } else if (num1 == num2 || num2 == num3) {
            const b = money;
            let payout;
            if (num1 == 0 || num2 == 0 || num3 == 0) {
                payout = (normalPay * 1.5);
            } else
                payout = normalPay;

            winDisp.textContent = `big win! + $${payout}`;
            audios[2].volume = 1;
            audios[2].play();
            money += payout;
            await uptMon(b, 15);
        } else if (num1 == num3) {
            const b = money;
            let payout;
            if (num1 == 0 || num2 == 0 || num3 == 0) {
                payout = (normalPay);
            } else {
                payout = Math.floor(normalPay / 2);
            }
            winDisp.textContent = `win! + $${payout}`;
            audios[2].volume = 1;
            audios[2].play();
            money += payout;
            await uptMon(b, 15);
        } else {
            winDisp.textContent = `no win :(`
        }
        knopje.disabled = false;
    }
}

knopje.addEventListener("click", gamble);