const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const addBtn = document.getElementById("addBtn");
const itemInput = document.getElementById("itemInput");
const itemList = document.getElementById("itemList");
const clearAll = document.getElementById("clearAll");
const resetRemoved = document.getElementById("resetRemoved");
const autoRemove = document.getElementById("autoRemove");
const themeToggle = document.getElementById("themeToggle");

let items = JSON.parse(localStorage.getItem("wheelItems")) || [];
let removedItems = JSON.parse(localStorage.getItem("removedItems")) || [];
let theme = localStorage.getItem("theme") || "light";
let autoRemoveState = localStorage.getItem("autoRemoveState") === "true";
let currentRotation = 0;
let font = "13px YekanBakh";
let firstInteraction = false;

const muteToggle = document.getElementById("muteToggle");
const volumeSlider = document.getElementById("volumeSlider");
const resetSettings = document.getElementById("resetSettings");
const clickSoundToggle = document.getElementById("clickSoundToggle");
const popupSoundToggle = document.getElementById("popupSoundToggle");

let isMuted = JSON.parse(localStorage.getItem("isMuted")) || false;
let currentVolume = parseFloat(localStorage.getItem("volume")) || 1;
let clickSoundEnabled = JSON.parse(localStorage.getItem("clickSoundEnabled")) ?? true;
let popupSoundEnabled = JSON.parse(localStorage.getItem("popupSoundEnabled")) ?? true;

// مقداردهی اولیه
Howler.volume(currentVolume);
Howler.mute(isMuted);
volumeSlider.value = currentVolume * 100;
muteToggle.className = isMuted ? "fa fa-volume-off" : "fa fa-volume-xmark";
clickSoundToggle.checked = clickSoundEnabled;
popupSoundToggle.checked = popupSoundEnabled;

// mute toggle
muteToggle.onclick = () => {
  isMuted = !isMuted;
  Howler.mute(isMuted);
  muteToggle.className = isMuted ? "fa fa-volume-off" : "fa fa-volume-xmark";
  localStorage.setItem("isMuted", isMuted);
};

// volume slider
volumeSlider.addEventListener("input", (e) => {
  currentVolume = e.target.value / 100;
  Howler.volume(currentVolume);
  localStorage.setItem("volume", currentVolume);
});

// صدای کلیک فعال یا نه؟
clickSoundToggle.addEventListener("change", () => {
  clickSoundEnabled = clickSoundToggle.checked;
  localStorage.setItem("clickSoundEnabled", clickSoundEnabled);
});

// صدای پاپ‌آپ فعال یا نه؟
popupSoundToggle.addEventListener("change", () => {
  popupSoundEnabled = popupSoundToggle.checked;
  localStorage.setItem("popupSoundEnabled", popupSoundEnabled);
});

// کنترل پخش صدای کلیک فقط اگر فعال باشه
document.addEventListener('click', () => {
  if (clickSoundEnabled && !isMuted) {
    playRandomClickSound();
  }
});


// کنترل پخش صدای گردونه فقط اگر فعال باشه
function playRandomSoundOnce() {
  if (!popupSoundEnabled) return;
  if (playedSounds.length === allSounds.length) playedSounds = [];

  const remainingSounds = allSounds.filter(sound => !playedSounds.includes(sound));
  const randomSound = remainingSounds[Math.floor(Math.random() * remainingSounds.length)];

  randomSound.play();
  playedSounds.push(randomSound);
}

// ریست کامل همه تنظیمات
resetSettings.onclick = () => {
  Swal.fire({
    title: "آیا مطمئنی؟",
    text: "تمام گزینه‌ها، تم، صدا و تنظیمات ریست خواهند شد!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "بله، ریست کن!",
    cancelButtonText: "خیر",
    customClass: {
      popup: 'yekan-font',
      title: 'yekan-font',
      content: 'yekan-font',
      confirmButton: 'yekan-font',
      cancelButton: 'yekan-font'
    }
  }).then(result => {
    if (result.isConfirmed) {
      localStorage.clear();
      location.reload();
    }
  });
};


const allClickSounds = [];
for (let i = 1; i <= 72; i++) {
  allClickSounds.push(new Howl({ src: [`sfx/click/click${i}.ogg`] }));
}

let playedClickSounds = [];

function playRandomClickSound() {
  if (!clickSoundEnabled || isMuted) return;
  if (playedClickSounds.length === allClickSounds.length) {
    playedClickSounds = [];
  }

  const remaining = allClickSounds.filter(sound => !playedClickSounds.includes(sound));
  const randomSound = remaining[Math.floor(Math.random() * remaining.length)];

  randomSound.play();
  playedClickSounds.push(randomSound);
}



const allSounds = [];
for (let i = 1; i <= 17; i++) {
  allSounds.push(new Howl({ src: [`sfx/popup/popup${i}.ogg`] }));
}

let playedSounds = [];

function playRandomSoundOnce() {
  if (!popupSoundEnabled) return;
  // اگر همه صداها پلی شدن، ریست کن
  if (playedSounds.length === allSounds.length) {
    playedSounds = [];
  }

  // فیلتر صداهایی که هنوز پلی نشدن
  const remainingSounds = allSounds.filter(sound => !playedSounds.includes(sound));

  // انتخاب رندوم یکی از باقی‌مانده‌ها
  const randomSound = remainingSounds[Math.floor(Math.random() * remainingSounds.length)];

  // پخش و افزودن به لیست پلی‌شده‌ها
  randomSound.play();
  playedSounds.push(randomSound);
}

const colors = [
  "#e7000c", "#9f0713", "#460809", "#f54900",
  "#9f2d00", "#441305", "#e17101", "#963c00",
  "#cf8800", "#894b00", "#5ea500", "#3d6300",
  "#00a73e", "#016632", "#009866", "#015f45",
  "#00968a", "#005f5c", "#0092b9", "#005f78",
  "#0083d1", "#01588b", "#155dfd", "#193db8",
  "#4f39f6", "#372aad", "#8220ff", "#4c1799",
  "#9710fa", "#6f11b0", "#c800dd", "#8b0194",
  "#e50075", "#a2004b", "#ec0040", "#a40034",
  "#314158", "#0f182a", "#43413c", "#1d1916"
];

// ✅ تابع برای انتخاب رنگ تصادفی
function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

function resizeCanvas() {
  const size = Math.min(window.innerWidth, 400); // حداکثر تا 400px برای موبایل
  canvas.width = size;
  canvas.height = size;
}

if (theme === "dark") {
  document.body.classList.add("dark");
  themeToggle.innerHTML = '<i class="fa fa-sun"></i>';
} else {
  themeToggle.innerHTML = '<i class="fa fa-moon"></i>';
}

// Set dark theme as default if no theme is saved
if (!localStorage.getItem("theme")) {
  document.body.classList.add("dark");
  themeToggle.innerHTML = '<i class="fa fa-sun"></i>';
}

function resizeCanvas() {
  const size = Math.min(window.innerWidth, 400); // حداکثر تا 400px برای موبایل
  canvas.width = size;
  canvas.height = size;
}

// Restore checkbox state
autoRemove.checked = autoRemoveState;

function saveData() {
  localStorage.setItem("wheelItems", JSON.stringify(items));
  localStorage.setItem("removedItems", JSON.stringify(removedItems));
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
  localStorage.setItem("autoRemoveState", autoRemove.checked);
}

function drawWheel() {
  const activeItems = items.filter(i => !removedItems.includes(i.text));
  const count = activeItems.length;
  if (count === 0) return;
  const angle = 2 * Math.PI / count;
  const radius = canvas.width / 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  activeItems.forEach((item, i) => {
    const start = i * angle;
    const end = start + angle;
    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, start, end);
    ctx.fillStyle = item.color || colors[i % colors.length];
    ctx.fill();

    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(start + angle / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = "15px YekanBakh";

    const text = item.text.length > 15 ? item.text.substring(0, 12) + "..." : item.text;
    ctx.fillText(text, radius - 10, 5);
    ctx.restore();
  });
}

function renderList() {
  itemList.innerHTML = "";

  items.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = removedItems.includes(item.text) ? "dimmed" : "";
    li.innerHTML = `
      <span>${item.text}</span>
      <div class="actions">
        <i class="fa fa-pencil" onclick="editItem(${index})"></i>
        <i class="fa fa-times" onclick="removeItem(${index})"></i>
      </div>`;
    itemList.appendChild(li);
  });
  drawWheel();
}

function addItem() {
  const text = itemInput.value.trim();
  if (text && !items.find(i => i.text === text)) {

    const color = getRandomColor();
    items.push({ text, color });
    saveData();
    itemInput.value = "";
    renderList();
    clickSound.play();
  }
}

function removeItem(index) {
  clickSound.play();
  items.splice(index, 1);
  saveData();
  renderList();
}

function editItem(index) {
  const newText = prompt("ویرایش گزینه:", items[index].text);
  if (newText && !items.find(i => i.text === newText)) {
    items[index].text = newText;
    saveData();
    renderList();
    clickSound.play();
  }
}

function spinWheel() {
  ctx.font = "13px YekanBakh";
  const activeItems = items.filter(i => !removedItems.includes(i.text));
  if (activeItems.length === 0) {
    playRandomSoundOnce();
    Swal.fire({
      width: "90%", // یا "80%" در موبایل
      title: "هیچ گزینه‌ای وجود ندارد!",
      text: "لطفاً ابتدا گزینه‌هایی اضافه کنید",
      icon: "warning",
      customClass: {
        popup: 'yekanBakh',
        title: 'yekanBakh',
        content: 'yekanBakh',
        confirmButton: 'yekanBakh'
      },
      showClass: {
        popup: 'animate__animated animate__bounceIn'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOut'
      }
    });
    return;
  }

  const count = activeItems.length;
  const anglePerItem = 360 / count;

  const selectedIndex = Math.floor(Math.random() * count);
  const stopAngle = (selectedIndex * anglePerItem) +           Math.floor(Math.random() * (anglePerItem - 5)) + 5;

  const extraRotation = 360 * (Math.floor(Math.random() * 6) + 3); // 3 to 8 full spins
  const totalRotation = extraRotation + stopAngle;

  currentRotation += totalRotation;

  canvas.style.transition = "transform 5s ease-out";
  canvas.style.transform = `rotate(-${currentRotation}deg)`;

  setTimeout(() => {
    const normalizedRotation = (currentRotation % 360 + 360) % 360;
    const selected = activeItems[Math.floor((normalizedRotation) / anglePerItem) % count];

    playRandomSoundOnce(); // صدا قبل از Swal

    Swal.fire({
      title: "🎲 نتیجه گردونه شانس",
      text: `چالش: ${selected.text}`,
      icon: "success",
      timer: 15000,
      timerProgressBar: true,
      customClass: {
        popup: 'yekanBakh',
        title: 'yekanBakh',
        content: 'yekanBakh',
        confirmButton: 'yekanBakh'
      },
      showClass: {
        popup: 'animate__animated animate__bounceIn'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOut'
      },
      background: document.body.classList.contains("dark") ? "#2c2c3c" : "#ffffff",
      color: document.body.classList.contains("dark") ? "#f1f1f1" : "#000000"
    });
    if (autoRemove.checked) {
      removedItems.push(selected.text);
      saveData();
    }
    renderList();
  }, 5200);
}

addBtn.onclick = addItem;
spinBtn.onclick = spinWheel;
clearAll.onclick = () => {
  ctx.font = "13px YekanBakh";
  items = [];
  removedItems = [];
  saveData();
  renderList();
};

itemInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault(); // جلوگیری از ارسال فرم یا اضافه شدن خط جدید
    addItem(); // اجرای تابع افزودن
  }
});

resetRemoved.onclick = () => {
  removedItems = [];
  saveData();
  renderList();
};
themeToggle.onclick = () => {
  document.body.classList.toggle("dark");
  themeToggle.innerHTML = document.body.classList.contains("dark")
    ? '<i class="fa fa-sun"></i>' : '<i class="fa fa-moon"></i>';
  saveData();
};

autoRemove.onchange = () => {
  saveData();
};

document.fonts.ready.then(renderList);


resizeCanvas();
document.fonts.ready.then(renderList);

window.addEventListener('resize', () => {
  resizeCanvas();
  renderList();
});