let userName = localStorage.getItem("username") || "Guest";

window.onload = function () {
    // tampilkan nama saat pertama load
    document.getElementById("nameDisplay").innerText = userName;

    // isi input dengan nama sebelumnya
    document.getElementById("nameInput").value = userName;

    updateTime();
};

// simpan nama
function saveName() {
    const input = document.getElementById("nameInput").value;

    if (input.trim() !== "") {
        userName = input;
        localStorage.setItem("username", userName);

        document.getElementById("nameDisplay").innerText = userName;
    }
}

// update jam + greeting
function updateTime() {
    const now = new Date();

    document.getElementById("time").innerText = now.toLocaleTimeString();

    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    document.getElementById("date").innerText =
       now.toLocaleDateString('en-US', options);

    let hour = now.getHours();
    let greeting = "";

    if (hour < 12) greeting = "🌞 Good Morning, ";
    else if (hour < 18) greeting = "🍯 Good Afternoon, ";
    else greeting = "🌙 Good Evening, ";

    // ⛔ ini penting: jangan replace seluruh text!
    document.getElementById("greeting").childNodes[0].nodeValue = greeting;
}

// jalan terus tiap detik
setInterval(updateTime, 1000);


let timer;
let timeLeft = localStorage.getItem("timer") 
    ? parseInt(localStorage.getItem("timer")) 
    : 1500; // default 25 menit

// tampilkan timer pertama kali
updateTimerDisplay();

// fungsi tampilkan waktu
function updateTimerDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;

    document.getElementById("timer").innerText =
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// START
function startTimer() {
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

// STOP
function stopTimer() {
    clearInterval(timer);
}

// RESET
function resetTimer() {
    timeLeft = 1500;
    localStorage.setItem("timer", timeLeft);
    updateTimerDisplay();
}

// CUSTOM TIMER
function setCustomTimer() {
    const minutes = document.getElementById("customMinutes").value;

    if (minutes && minutes > 0) {
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

    // CEK DUPLIKAT
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

    if (text.includes("belajar")) return "📚";
    if (text.includes("makan")) return "🍳";
    if (text.includes("tidur")) return "😴";
    if (text.includes("kerja") || text.includes("tugas")) return "💻";
    if (text.includes("bersih")) return "🧹";
    if (text.includes("olahraga")) return "🏃";
    if (text.includes("minum") || text.includes("kopi")) return "☕";

    return "🥚";
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

    if (newText === null) return; // cancel
    newText = newText.trim();

    if (newText === "") return;

    // CEK DUPLIKAT (kecuali dirinya sendiri)
    let isDuplicate = tasks.some((task, i) => 
        task.text.toLowerCase() === newText.toLowerCase() && i !== index
    );

    if (isDuplicate) {
        alert("Task already exists! 🐣");
        return;
    }

    tasks[index].text = newText;

    saveTasks();
    renderTasks();
}

function renderTasks() {
    let list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach((task, index) => {
        let li = document.createElement("li");

        // DRAG FEATURE
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

        // =====================
        let span = document.createElement("span");
        let emoji = getEmoji(task.text);
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

renderTasks();

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
        a.innerText = "🐣 " + link.name;
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

    const isDark = saved === "dark";
    document.body.classList.toggle("dark", isDark);

    const btn = document.getElementById("themeToggle");
    if (btn) btn.innerText = isDark ? "☀️" : "🌙";
}

function toggleTheme() {
    const isDark = document.body.classList.toggle("dark");

    // simpan state TERKINI (bisa "dark" atau "light")
    localStorage.setItem("theme", isDark ? "dark" : "light");

    const btn = document.getElementById("themeToggle");
    if (btn) btn.innerText = isDark ? "☀️" : "🌙";
}
renderLinks();

    const btn = document.getElementById("themeToggle");
    if (btn) btn.addEventListener("click", toggleTheme);
