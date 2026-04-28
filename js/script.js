let userName = localStorage.getItem("username") || "Guest";

window.onload = function () {
    document.getElementById("nameDisplay").innerText = userName;
    document.getElementById("nameInput").value = userName;

    updateTime();
    updateTimerDisplay();
    renderTasks();
    renderLinks();
    loadTheme();

    document.getElementById("themeToggle").onclick = toggleTheme;
};

function saveName() {
    const input = document.getElementById("nameInput").value;

    if (input.trim() !== "") {
        userName = input;
        localStorage.setItem("username", userName);

        document.getElementById("nameDisplay").innerText = userName;
        updateTime();
        celebrateName();
    }
}
function updateTime() {
    const now = new Date();

    document.getElementById("time").innerText =
        now.toLocaleTimeString();

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };

    document.getElementById("date").innerText =
        now.toLocaleDateString("en-US", options);

    let hour = now.getHours();
    let greeting = "";

    if (hour < 12) greeting = "🌞 Good Morning, ";
    else if (hour < 18) greeting = "🍯 Good Afternoon, ";
    else greeting = "🌙 Good Evening, ";

    document.getElementById("greeting").innerHTML =
        greeting + '<span id="nameDisplay">' + userName + "</span>";
}

setInterval(updateTime, 1000);

let timer;
let timeLeft = localStorage.getItem("timer")
    ? parseInt(localStorage.getItem("timer"))
    : 1500;

function updateTimerDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;

    document.getElementById("timer").innerText =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function startTimer() {
    clearInterval(timer);

    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            localStorage.setItem("timer", timeLeft);
            updateTimerDisplay();
        } else {
            clearInterval(timer);
            alert("Time's up! 🐣");
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

function resetTimer() {
    clearInterval(timer);
    timeLeft = 1500;
    localStorage.setItem("timer", timeLeft);
    updateTimerDisplay();
}

function setCustomTimer() {
    const minutes = document.getElementById("customMinutes").value;

    if (minutes && minutes > 0) {
        clearInterval(timer);
        timeLeft = minutes * 60;
        localStorage.setItem("timer", timeLeft);
        updateTimerDisplay();
    }
}

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let dragIndex = null;

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
    let input = document.getElementById("taskInput");
    let text = input.value.trim();

    if (text === "") return;

    let isDuplicate = tasks.some(task =>
        task.text.toLowerCase() === text.toLowerCase()
    );

    if (isDuplicate) {
        alert("Task already exists! 🐣");
        return;
    }

    tasks.push({ text: text, done: false });
    input.value = "";

    saveTasks();
    renderTasks();
}

function getEmoji(text) {
    text = text.toLowerCase();

    if (text.includes("rebus telur")) return "🥚";
    if (text.includes("masak telur")) return "🍳";
    if (text.includes("goreng telur")) return "🍳";
    if (text.includes("masak")) return "🥘";
    if (text.includes("belajar")) return "📚";
    if (text.includes("makan")) return "🍜";
    if (text.includes("tidur")) return "😴";
    if (text.includes("kerja") || text.includes("tugas")) return "💻";
    if (text.includes("bersih")) return "🧹";
    if (text.includes("olahraga")) return "🏃";
    if (text.includes("minum") || text.includes("kopi")) return "☕";

    const isDark = document.body.classList.contains("dark");
    return isDark ? "☕" : "🐣";
}

function toggleTask(index) {
    tasks[index].done = !tasks[index].done;
    saveTasks();
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

function editTask(index) {
    let newText = prompt("Edit your task:", tasks[index].text);

    if (newText === null) return;

    newText = newText.trim();

    if (newText === "") return;

    tasks[index].text = newText;

    saveTasks();
    renderTasks();
}

function renderTasks() {
    let list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach((task, index) => {
        let li = document.createElement("li");

        li.setAttribute("draggable", true);

        li.addEventListener("dragstart", () => {
            dragIndex = index;
        });

        li.addEventListener("dragover", (e) => {
            e.preventDefault();
        });

        li.addEventListener("drop", () => {
            let temp = tasks[dragIndex];
            tasks[dragIndex] = tasks[index];
            tasks[index] = temp;

            saveTasks();
            renderTasks();
        });

        let span = document.createElement("span");

        const emoji = getEmoji(task.text);
        span.innerText = emoji + " " + task.text;

        span.onclick = () => toggleTask(index);
        span.ondblclick = () => editTask(index);

        if (task.done) {
            span.style.textDecoration = "line-through";
            span.style.opacity = "0.6";
        }

        let btn = document.createElement("button");
        btn.innerText = "❌";
        btn.onclick = () => deleteTask(index);

        li.appendChild(span);
        li.appendChild(btn);
        list.appendChild(li);
    });
}

let links = JSON.parse(localStorage.getItem("links")) || [];

function saveLinks() {
    localStorage.setItem("links", JSON.stringify(links));
}

function addLink() {
    let nameInput = document.getElementById("linkName");
    let urlInput = document.getElementById("linkURL");

    let name = nameInput.value.trim();
    let url = urlInput.value.trim();

    if (name === "" || url === "") return;

    if (!url.startsWith("http")) {
        url = "https://" + url;
    }

    links.push({ name, url });

    nameInput.value = "";
    urlInput.value = "";

    saveLinks();
    renderLinks();
}

function deleteLink(index) {
    links.splice(index, 1);
    saveLinks();
    renderLinks();
}

function renderLinks() {
    let container = document.getElementById("links");
    container.innerHTML = "";

    links.forEach((link, index) => {
        let wrapper = document.createElement("div");
        wrapper.classList.add("link-item");

        let a = document.createElement("a");
        a.href = link.url;

        const isDark = document.body.classList.contains("dark");
        a.innerText = (isDark ? "☕ " : "🐣 ") + link.name;

        a.target = "_blank";

        let delBtn = document.createElement("button");
        delBtn.innerText = "❌";
        delBtn.onclick = () => deleteLink(index);

        wrapper.appendChild(a);
        wrapper.appendChild(delBtn);

        container.appendChild(wrapper);
    });
}

function loadTheme() {
    const saved = localStorage.getItem("theme");

    if (saved === "dark") {
        document.body.className = "dark";
    } else {
        document.body.className = "";
    }

    updateThemeIcon();
    updateThemeText();
    updateThemeEmoji();
}

function toggleTheme() {
    if (document.body.classList.contains("dark")) {
        document.body.classList.remove("dark");
        localStorage.setItem("theme", "light");
    } else {
        document.body.classList.add("dark");
        localStorage.setItem("theme", "dark");
    }

    updateThemeIcon();
    updateThemeText();
    updateThemeEmoji();
}

function updateThemeText() {
    const title = document.getElementById("mainTitle");

    if (!title) return;

    if (document.body.classList.contains("dark")) {
        title.innerText = "Hello, Latte-lly amazing ☕🤎";
    } else {
        title.innerText = "Hello, Egg-cellent friend 🫶🏻🐣";
    }
}

function updateThemeEmoji() {
    const isDark = document.body.classList.contains("dark");

    const timerTitle = document.querySelector(".timer-card h2");
    const taskTitle = document.querySelectorAll(".row .card")[1]?.querySelector("h2");
    const linkTitle = document.querySelectorAll(".container > .card")[1]?.querySelector("h2");

    if (timerTitle) {
        timerTitle.innerText = isDark ? "☕ Coffee Focus" : "🍳 Focus Timer";
    }

    if (taskTitle) {
        taskTitle.innerText = isDark ? "🧸 Cozy Tasks" : "🌻 Tasks";
    }

    if (linkTitle) {
        linkTitle.innerText = isDark ? "🌰 Quick Links" : "🐥 Quick Links";
    }

    renderTasks();
    renderLinks();
}

function updateThemeIcon() {
    const btn = document.getElementById("themeToggle");

    if (!btn) return;

    btn.innerText =
        document.body.classList.contains("dark") ? "☀️" : "🌙";
}
document.addEventListener("keydown", function (e) {
    if (e.key !== "Enter") return;

    const id = document.activeElement.id;

    switch (id) {
        case "nameInput":
            saveName();
            break;

        case "taskInput":
            addTask();
            break;

        case "linkURL":
            addLink();
            break;
            
        case "customMinutes":
            setCustomTimer();
            break;
    }
});

function saveName() {
    const input = document.getElementById("nameInput").value;

    if (input.trim() !== "") {

        const sound = document.getElementById("popSound");
        if (sound) {
            sound.pause();
            sound.currentTime = 0;

            sound.play()
                .then(() => console.log("sound ok"))
                .catch(err => console.log("sound blocked", err));
        }

        userName = input;
        localStorage.setItem("username", userName);

        document.getElementById("nameDisplay").innerText = userName;
        updateTime();

        celebrateName();
    }
}
function celebrateName() {
    const duration = 2000;
    const end = Date.now() + duration;

    const colors = ["#ffb703", "#fb8500", "#8ecae6", "#219ebc", "#ffffff"];

    (function frame() {
        confetti({
            particleCount: 6,
            spread: 120,
            startVelocity: 35,
            gravity: 0.8,
            origin: { x: 0, y: 0.6 },
            colors
        });

        confetti({
            particleCount: 6,
            spread: 120,
            startVelocity: 35,
            gravity: 0.8,
            origin: { x: 1, y: 0.6 },
            colors
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();

    confetti({
        particleCount: 80,
        spread: 200,
        startVelocity: 60,
        origin: { x: 0.5, y: 0.4 },
        colors
    });
}
function playSound() {
    const sound = document.getElementById("celebratePopsound");
    if (!sound) return;

    sound.pause();
    sound.currentTime = 0;

    sound.play().catch(() => {});
}
