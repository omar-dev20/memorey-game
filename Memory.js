
let root = document.documentElement;
let themeIcon = document.querySelector('.fa-sun');
let allIcon = [];
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
const toggleBtn = document.querySelector('#theme-toggle');
function updateIcon(isDark) {
    root.style.setProperty('--primary', isDark ? '#599ea1' : '');
    root.style.setProperty('--secondary', isDark ? '#304055' : '');
    root.style.setProperty('--accent', isDark ? '#46527c' : '');
    root.style.setProperty('--text', isDark ? '#e5f0f0' : '');
    root.style.setProperty('--box-shadow', isDark ? '0 0px 3px #eee' : '');
    root.style.setProperty('--background', isDark ? '#180f10' : '');
    themeIcon.className = isDark ? 'fa-solid fa-moon' : ' fa-solid fa-sun';
    toggleBtn.style.background = isDark ? '#333' : '';

}
toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    updateIcon(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

let savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    updateIcon(true);
} else {
    updateIcon(false);
}
const container = document.querySelectorAll(".game-block .icon");
async function icon() {
    const [googleRes, bootstrapRes, fontAwesomeRes] = await Promise.all([
        fetch('https://api.iconify.design/collection?prefix=material-symbols').then(r => r.json()),
        fetch('https://api.iconify.design/collection?prefix=bi').then(r => r.json()),
        fetch('https://api.iconify.design/collection?prefix=fa6-solid').then(r => r.json())
    ]);

    const googleIcons = Object.values(googleRes.categories).flat()
        .map(name => `material-symbols:${name}`)
    const biIcons = bootstrapRes.uncategorized
        .map(name => `bi:${name}`);
    const faIcons = [
        ...fontAwesomeRes.uncategorized ?? [],
        ...Object.values(fontAwesomeRes.categories ?? {}).flat()
    ].map(name => `fa6-solid:${name}`);

    const allIcons = [...googleIcons, ...biIcons, ...faIcons];
    container.forEach(e => e.innerHTML = "");
    let chosenIcons = [];
    while (chosenIcons.length < 10) {
        const randomIcon = allIcons[Math.floor(Math.random() * allIcons.length)];
        if (!chosenIcons.includes(randomIcon)) {
            chosenIcons.push(randomIcon);
        }
    }
    let gameIcons = [...chosenIcons, ...chosenIcons];
    gameIcons = shuffleArray(gameIcons);
    container.forEach((card, index) => {
        const iconName = gameIcons[index];
        const iconEl = document.createElement("iconify-icon");
        iconEl.setAttribute("icon", iconName);
        iconEl.classList.add("game-icon");
        iconEl.setAttribute('height', '95px');
        iconEl.setAttribute('width', '95px');
        iconEl.style.cssText = ' margin-block: 18%;';
        card.appendChild(iconEl);
        allIcon.push(iconName);
    })

}
icon();
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.load-hidden');

    elements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('load-show');
        }, index * 50);
    });
});
let allcard = document.querySelectorAll('.memory-game-blocks .game-block');
let controlButtons = document.querySelector('.control-buttons');
controlButtons.addEventListener('click', () => {
    controlButtons.remove();
    allcard.forEach(card => {
        card.classList.toggle('is-flipped');
        setTimeout(() => {
            card.classList.remove('is-flipped');
        }, 500)
    })
    let name = document.querySelector('#name');
    let sign = [
        '-', '#', '*', '+', '@', '$', '%', '&', '!', '?', '/', '.', '^',
        '~', '=', '_', '|', '<', '>', '€', '£', '¥', '₹', '©', '®', '™',
        '§', '±', '÷', '×', '°', 'µ', '¬', '¶', '∑', '∏', '√', '∝', '∞',
        '∠', '∧', '∨', '∩', '∪', '∫', '∬', '∭', '∮', '∴', '∵', '∶', '∷',
        '∼', '∽', '≈', '≌', '≒', '≠', '≡', '≤', '≥', '≦', '≧', '≪', '≫',
        '▲', '▼', '◀', '▶', '●', '■', '◆', '★', '♣', '♠', '♥', '♦', '✖',
        '↑', '↓', '←', '→', '↖', '↗', '↘', '↙', '↔', '↕', '➴', '➵', '➶'
    ];
    let randomsign = sign[Math.floor(Math.random() * sign.length)];
    let randomName = `player${randomsign}${Math.floor(Math.random() * 100)}`;
    let allcolor = ['var(--text)', 'var(--primary)', 'var(--secondary)', 'var(--accent)'];
    let randomcolor = allcolor[Math.floor(Math.random() * allcolor.length)];
    name.style.setProperty('--text', randomcolor);
    let text = document.createTextNode(randomName);
    name.appendChild(text);
    let note = document.createElement('span');
    let text2 = document.createTextNode(`(this is random name) `);
    note.classList.add('note')

    note.appendChild(text2);
    let nameContainer = document.querySelector('.name');
    nameContainer.appendChild(note);
    let noteTimeout;

name.addEventListener('mouseenter', () => {
    clearTimeout(noteTimeout);
    note.innerHTML = `This Is Random Name`;
    note.classList.add('show');

    noteTimeout = setTimeout(() => {
        note.classList.remove('show');
    }, 2000);
});
});

function saveUser(user, time, tries) {
    let leaders = JSON.parse(localStorage.getItem('leaders')) || [];
    let result = {
        name: user.trim(),
        time: time,
        wrong: tries
    };

    let userIndex = leaders.findIndex(u => u.name === result.name);

    if (userIndex !== -1) {
        if (result.time < leaders[userIndex].time) {
            leaders[userIndex] = result;
        } 
        else if (result.time === leaders[userIndex].time && result.wrong < leaders[userIndex].wrong) {
            leaders[userIndex] = result;
        }
    } else {
        leaders.push(result);
    }
    leaders.sort((a, b) => a.time - b.time);
    leaders = leaders.slice(0, 5);
    
    localStorage.setItem('leaders', JSON.stringify(leaders));
}
let leaderclose = document.createElement("button");
leaderclose.appendChild(document.createTextNode("X"));
leaderclose.style.cssText = "position:absolute; top:-10px; right:-10px; background:#9d0f19; color:white; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; font-weight:bold; border:none;";
function leaderPOP() {
    let overlay = document.createElement("div");
    overlay.style.cssText = "position:fixed; inset:0; background:rgba(0, 0, 0, 0.6); z-index:9998; backdrop-filter:blur(5px);";

    let leaders = JSON.parse(localStorage.getItem('leaders')) || [];
    let popup = document.createElement("div");
    popup.className = 'leader-popup';
    popup.style.cssText = "z-index:9999; position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); backdrop-filter:blur(15px); background:rgba(255,255,255,0.1); padding:30px; text-align:center; border-radius:15px; color:var(--text, white); border:1px solid var(--primary); width:450px; max-width:97%; box-shadow: var(--box-shadow);";

    let leaderTitle = document.createElement('h2');
    leaderTitle.style.cssText = "font-size: clamp(1.688rem, 2vw + 1rem, 2.063rem); font-weight:bold; color:var(--text, white); margin-bottom: 20px; display:flex; align-items:center; justify-content:center; gap:10px;";
    
    let iconTitle = document.createElement('i');
    iconTitle.className = 'fa-solid fa-crown';
    iconTitle.style.cssText = "color:var(--primary);";
    
    leaderTitle.appendChild(iconTitle);
    leaderTitle.appendChild(document.createTextNode(' Leaderboard '));
    popup.appendChild(leaderTitle);

    let ul = document.createElement('ul');
    ul.style.cssText = "list-style:none; padding:0; margin:0; font-weight:bold; display:flex; flex-direction:column; gap:10px;";

    if (leaders.length === 0) {
        let not = document.createElement('li');
        not.style.cssText = 'padding:20px; color:var(--accent); font-size: 24px;';
        not.textContent = 'No records yet!';
        
        let note = document.createElement('p');
        note.style.cssText = "color: var(--primary); padding: 12px; font-size: 16px; font-weight: bold; border-radius: 5px; margin: 15px 0 0; border-left: 5px solid var(--primary); background:rgba(255,255,255,0.05); text-align:center;";
        
        let inNote = document.createElement('i');
        inNote.className = 'fa-solid fa-circle-info';
        inNote.style.cssText = 'color:var(--primary); margin-right: 8px;';
        
        note.appendChild(inNote);
        note.appendChild(document.createTextNode(' Note: Records are only saved when playing with the Timer!'));    
        
        ul.appendChild(not);
        popup.appendChild(ul);
        popup.appendChild(note);
    } else {
        let catagory = document.createElement('li');
        catagory.className = 'player-catagory';
        catagory.style.cssText = "display:flex; justify-content:space-between; padding:10px 15px; border-bottom:2px solid var(--primary); font-size:16px; color:var(--primary); opacity:0.8;";
        
        let userRank = document.createElement('span');
        userRank.textContent = `Rank`;
        userRank.style.cssText = "width: 15%;margin-right:10px; text-align:left;";
        catagory.appendChild(userRank);
        
        let userName = document.createElement('span');
        userName.textContent = `Name`;
        userName.style.cssText = "width: 45%; text-align:left;";
        catagory.appendChild(userName);

        let userWrong = document.createElement('span'); 
        userWrong.textContent = `Tries`;
        userWrong.style.cssText = "width: 25%; text-align:center;";
        catagory.appendChild(userWrong);
        
        let userTime = document.createElement('span');
        userTime.textContent = `Time`;
        userTime.style.cssText = "width: 15%; text-align:right;";
        catagory.appendChild(userTime);
        
        ul.appendChild(catagory);

        leaders.forEach((entry, index) => {
            let li = document.createElement('li');
            li.className = 'player-row';
            li.style.cssText = "display:flex; justify-content:space-between; align-items:center; padding:12px 15px; background:rgba(255,255,255,0.05); border-radius:8px; font-size:16px;";

            let rankContainer = document.createElement('span');
            rankContainer.style.cssText = "width: 15%; text-align:left; display:flex; align-items:center; gap:5px;";
            
            let icon = document.createElement('i');
            icon.className = 'fa-solid fa-crown';
            
            if (index === 0) {
                icon.style.color = 'var(--primary)';
            } else if (index === 1) {
                icon.style.color = '#C0C0C0';
            } else if (index === 2) {
                icon.style.color = '#CD7F32';
            } else {
                icon.style.display = 'none';
            }
            
            let rank = document.createElement('span');
            rank.className = 'rank';
            rank.appendChild(document.createTextNode(index + 1));
            
            rankContainer.appendChild(rank);
            rankContainer.appendChild(icon);
            li.appendChild(rankContainer);

            let name = document.createElement('span');
            name.className = 'name';
            name.style.cssText = "width: 45%;margin-left:10px; text-align:left; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;";
            name.appendChild(document.createTextNode(entry.name));
            li.appendChild(name);

            let wrongTries = document.createElement('span');
            wrongTries.className = 'wrong-tries-count';
            wrongTries.style.cssText = "width: 25%; text-align:center; color:var(--accent);";
            wrongTries.appendChild(document.createTextNode(entry.wrong !== undefined ? entry.wrong : '0'));
            li.appendChild(wrongTries);

            let time = document.createElement('span');
            time.className = 'time';
            time.style.cssText = "width: 15%; text-align:right; color:var(--primary);";
            time.appendChild(document.createTextNode(entry.time + 's'));
            li.appendChild(time);

            ul.appendChild(li);
        });
        popup.appendChild(ul);
    }

    popup.appendChild(leaderclose);

    document.body.appendChild(overlay);
    document.body.appendChild(popup);
    document.body.style.overflow = "hidden";

    function removeLeader() {
        popup.remove();
        overlay.remove();
        document.body.style.overflow = "auto";
    }
    overlay.addEventListener('click', removeLeader);
    leaderclose.addEventListener('click', removeLeader);
}
let failclose = document.createElement("button");
failclose.appendChild(document.createTextNode("X"));
failclose.style.cssText = "position:absolute; top:-10px; right:-10px; background:#9d0f19; color:white; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; font-weight:bold;";
function popfail() {
    let overlay = document.createElement("div");
    overlay.style.cssText = "position:fixed; inset:0; background:rgba(0, 0, 0, 0.6); z-index:9998; backdrop-filter:blur(5px);";
   let loseAudio = new Audio('universfield-game-over-deep-male-voice-clip-352695.mp3');
    loseAudio.play()
    let popup = document.createElement("div");
    popup.classList.add('fail-popup');
    popup.style.cssText = "z-index:9999; position:fixed;max-width:500px; top:50%; left:50%; transform:translate(-50%, -50%); backdrop-filter:blur(15px); background:rgba(255,255,255,0.1); padding:40px; text-align:center; border-radius:15px; color:var(--color); border:2px solid var(--accent);";
    let failH2 = document.createElement('h2');
    let failIcon1 = document.createElement('i');
    failIcon1.className = 'fa-solid fa-skull-crossbones';
    failH2.appendChild(failIcon1);
    failH2.appendChild(document.createTextNode(' Game Over! '));
    let failIcon2 = document.createElement('i');
    failIcon2.className = 'fa-solid fa-skull-crossbones';
    failH2.appendChild(failIcon2);
    popup.appendChild(failH2);
    document.body.appendChild(overlay);
    document.body.appendChild(popup);
    document.body.style.overflow = "hidden";
    popup.appendChild(failclose);
    new Audio('https://assets.mixkit.co/active_storage/sfx/1541/1541-84.wav').play();
    function removeWin() {
        popup.remove();
        overlay.remove();
        document.body.style.overflow = "auto";
        location.reload();

    }
    overlay.addEventListener('click', removeWin);
    failclose.addEventListener('click', removeWin);
}

let flippedCards = [];
let wrong = 0;
let correct = [];
let icontfay = document.querySelectorAll('.icon')
allcard.forEach((card) => {
    card.addEventListener('click', () => {
        if (card.classList.contains('is-flipped') || flippedCards.length === 2) return;

        card.classList.add('is-flipped');
        flippedCards.push(card);
        
        if (flippedCards.length === 2) {
            let firstflip = flippedCards[0].querySelector('iconify-icon').getAttribute('icon');
            let secondflip = flippedCards[1].querySelector('iconify-icon').getAttribute('icon');

            if (firstflip === secondflip) {
                flippedCards.forEach(c => c.classList.add('has-match'));
                correct.push(firstflip); 
                flippedCards = [];
                new Audio('https://www.myinstants.com/media/sounds/kids_cheering.mp3').play();
             if (correct.length ===10) {
                    createWinPop();
                }
            } else {
                let card1 = flippedCards[0];
                let card2 = flippedCards[1];
                flippedCards = []; 

                setTimeout(() => {
                    card1.classList.remove('is-flipped');
                    card2.classList.remove('is-flipped');
                }, 1000);
                wrong++;
                let tries = document.querySelector('.tries span');
                tries.innerHTML = '';
                tries.appendChild(document.createTextNode(wrong));
                new Audio('https://www.myinstants.com/media/sounds/awwhhh-sound-effect.mp3').play();
            }
        }
        if(wrong === 25){
               popfail ();
            }
    });
});
function createWinPop() {
    let overlay = document.createElement("div");
    overlay.style.cssText = "position:fixed; inset:0; background:rgba(0, 0, 0, 0.6); z-index:9998; backdrop-filter:blur(5px);";
    
    let popup = document.createElement("div");
    clearInterval(timerInterval);
    popup.className = 'win-popup';
    popup.style.cssText = "z-index:9999; position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); backdrop-filter:blur(15px); width:500px; max-width: 90%; background:rgba(255,255,255,0.1); padding:40px; text-align:center; border-radius:15px; color:white; border:1px solid var(--primary);";
    
    let winH2 = document.createElement('h2');
    let winIcon1 = document.createElement('i');
    winIcon1.className = 'fa-solid fa-trophy';
    winH2.appendChild(winIcon1);
    winH2.appendChild(document.createTextNode(' You Win! '));
    let winIcon2 = document.createElement('i');
    winIcon2.className = 'fa-solid fa-trophy';
    winH2.appendChild(winIcon2);
    popup.appendChild(winH2);
    
    let winP1 = document.createElement('p');
    winP1.appendChild(document.createTextNode('You finished the game in: '));
    let winStrong1 = document.createElement('strong');
    winStrong1.style.cssText = 'color:var(--primary)';
    winStrong1.appendChild(document.createTextNode((counterIndex || '0') + ' s'));
    winP1.appendChild(winStrong1);
    popup.appendChild(winP1);
    let winP2 = document.createElement('p');
    winP2.appendChild(document.createTextNode('Wrong Tries: '));
    let winStrong2 = document.createElement('strong');
    winStrong2.style.cssText = 'color:var(--accent);';
    winStrong2.appendChild(document.createTextNode(wrong));
    winP2.appendChild(winStrong2);
    popup.appendChild(winP2);

    if (counterIndex) {
        let inputContainer = document.createElement("div");
        inputContainer.style.cssText = "margin-top: 20px; display: flex; gap: 10px; justify-content: center;";

        let userInput = document.createElement("input");
        userInput.type = "text";
        userInput.placeholder = "Enter your name";
        userInput.style.cssText = "padding: 10px; border-radius: 5px; border: 1px solid var(--primary); background: rgba(255,255,255,0.2); color: white; outline: none;";

        let submitBtn = document.createElement("span");
        submitBtn.appendChild(document.createTextNode("Save"));
        submitBtn.style.cssText = "padding: 10px 20px; border-radius: 5px; background: var(--primary); color: white; border: none; cursor: pointer; font-weight: bold; margin: 0; width: auto; height: auto;";

        inputContainer.appendChild(userInput);
        inputContainer.appendChild(submitBtn);
        popup.appendChild(inputContainer);

        submitBtn.addEventListener("click", function () {
            if (userInput.value.trim() === '') return;
            if (typeof saveUser === 'function') {
                saveUser(userInput.value, counterIndex, wrong);
            }
        });
    }

    popup.appendChild(failclose);
    document.body.appendChild(overlay);
    document.body.appendChild(popup);
    document.body.style.overflow = "hidden";
    
    new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-84.wav').play();

    function removeWin() {
        popup.remove();
        overlay.remove();
        document.body.style.overflow = "auto";
        location.reload();
    }

    overlay.addEventListener('click', removeWin);
    failclose.addEventListener('click', removeWin);
}
let timerInterval;
let counterArray = [];
let counterIndex = 0;
let timer = document.querySelector('#timer');
let theCount = document.querySelector('.timer');
 let counter = document.querySelector('.timer .time');
function startMyTimer(seconds) { 
    clearInterval(timerInterval);
    let timeLeft = seconds;
    timerInterval = setInterval(() => {
        counterArray.push(timeLeft);
        timeLeft--;
        counterIndex++;
        if (counter) counter.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
        }
    }, 1000);
}
timer.addEventListener('click', () => {
theCount.style.display = 'block';
startMyTimer(181);
})
let help = document.querySelector('.help');
let helpNum = document.querySelector('#help-num');
let num = 5;
helpNum.textContent = num;
help.addEventListener('click', () => {
    if (num <= 0) return;
    num--;
    helpNum.textContent = num;
    if (num === 0) {
        help.style.pointerEvents = 'none';
        help.style.opacity = '0';
        setTimeout(() => {
            help.remove();
        }, 500);
    }
    allcard.forEach(card => {
        if (card.classList.contains('is-flipped') || card.classList.contains('has-match')) return;
        card.classList.add('is-flipped');
        
        setTimeout(() => {
            card.classList.remove('is-flipped');
        }, 3000);
    });
});
let leaders = document.querySelector('.leders');
leaders.addEventListener('click', () => {
    leaderPOP();
})
