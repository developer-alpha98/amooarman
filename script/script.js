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
document.addEventListener('click', (e) => {
  // اگر روی دکمه چرخش کلیک شد، صدای کلیک پخش نکن
  if (e.target.closest('#spinBtn')) return;

  if (clickSoundEnabled && !isMuted) {
    playRandomClickSound();
  }
});



// کنترل پخش صدای گردونه فقط اگر فعال باشه


// ریست کامل همه تنظیمات
resetSettings.onclick = () => {
  Swal.fire({
    title: "آیا مطمئنی؟",
    text: "تمام چالش‌ها، تم، صدا و تنظیمات ریست خواهند شد!",
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

const wheelSpinSound = new Howl({
  src: ['sfx/wheel_spin.ogg'],
  loop: true,
  volume: currentVolume
});

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

const predefinedChallenges = [
  "بدون استفاده از هیچ اسپل بازی کن.",
  "بدون استفاده از هیچ کارت لجندری بازی کن.",
  "بدون استفاده از هیچ کارت وین‌کانشن بازی کن.",
  "بدون استفاده از هیچ کارت Common بازی کن.",
  "فقط از کارت‌های Common استفاده کن.",
  "فقط از کارت‌های Rare استفاده کن.",
  "فقط از کارت‌های Epic استفاده کن.",
  "فقط از کارت‌های لجندری استفاده کن.",
  "نایت و والکری و باهم در دکت قرار بده",
  "هربار وین کاندیشینر استفاده کردی باید بلافاصله اون رو میرور کنی",
  "میانگین اکسیر زیر 3 باشه",
  "میانگین اکسیر دک بالای 5 باشه",
  "کارت‌ها را فقط از یک آرنا انتخاب کن.",
  "فقط کارت‌های ارزون (۲ اکسیر یا کمتر) استفاده کن.",
  "فقط کارت‌های گرون (۴ اکسیر یا بیشتر) استفاده کن.",
  "تمام کارت‌های دکت از یک نوع انتخاب کن (مثلا همه بیلدینگ یا همه اسپل).",
  "فقط کارت‌های زمینی استفاده کن.",
  "فقط کارت‌های هوایی استفاده کن.",
  "فقط کارت های بیشتر از 3 نفر استفاده کن مثل خفاش یا اسکلت آرمی",
  "فقط با اسپل ریج میتونی دمیج بدی",
  "فقط از کارت های range استفاده کن.",
  "فقط کارت های تانک استفاده کن.",
  "در بازی فقط 3 بار از وین کاندیشینرت استفاده کن.",
  "هیچ بیلدینگی در دک قرار نده.",
  "یک دک سنگین (میانگین اکسیر بالا) بساز و بازی کن.",
  "یک دک سبک (میانگین اکسیر پایین) بساز و بازی کن.",
  "با یکی از بیننده‌ها یا دوستان کلن بازی کن.",
  "به یکی داخل چت لینک دوستی بده و باهاش بازی کن.",
  "برو تو لایو یه نفر دیگه و بنویس هایاح",
  "یکی از ادمینا دک بعدیتو پیشنهاد بده",
  "با هر دونیت هنگام بازی تا 5 ثانیه چشمتو ببند.",
  "هر بار یکی لایو و لایک کرد، تا 10 ثانیه کارت نریز.",
  "تا ۳۰ ثانیه اول بازی هیچ کارتی نگذار (صبر کن).",
  "تا پایان بازی فقط دفاع کن (حمله نکن).",
  "قبل از گذاشتن هر کارت ۱۰ ثانیه صبر کن.",
  "هر بار ۳ که کارت استفاده کردی، ۵ ثانیه صبر کن.",
  "فقط وقتی اکسیرت به ۱۰ رسید کارت بریز.",
  "یک دقیقه اول بازی فقط دفاع کن و بعد از آن فقط حمله کن.",
  "فقط ۳۰ ثانیه اول بازی حمله کن، بقیه زمان دفاع کن.",
  "هر ۱۰ ثانیه فقط یک کارت استفاده کن.",
  "در بازی فقط ۵ نوع کارت میتونی بندازی.",
  "هیچ‌وقت مستقیم روی تاور دشمن اسپل ننداز (مثل راکت روی تاور).",
  "بدون کارت بیلدینگ بتل بزن",
  "بدون وین کاندیشن بتل بزن",
  "بدون کارت اسپل بتل بزن",
  "با دک حریف قبلی بتل بزن",
  "کینگ تاور حریفو فعال کن",
  "با ترکیب رندوم بتل بزن",
  "بدون اولوشن بتل بزن",
  "به یکی از فرندهات درخواست بتل بده",
  "تا ۳۰ ثانیه اول بازی هیچ کارتی ننداز",
  "کارت اول حریف رو دفاع نکن",
  "بزار یکی از تاور هاتو بگیره ازت",
  "با یکی از بچه های لایو بتل بزن",
  "با دونیتر بعدی فرندلی بتل بزنید",
  "لینک فرندتو به دونیتر بعدی بده",
  "با دونیتر قبلی فرندلی بتل بزن"
];


const allSounds = [];
for (let i = 1; i <= 29; i++) {
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
  "#9f2d00", "#517e9c", "#e17101", "#963c00",
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





// Restore checkbox state
autoRemove.checked = autoRemoveState;

function saveData() {
  localStorage.setItem("wheelItems", JSON.stringify(items));
  localStorage.setItem("removedItems", JSON.stringify(removedItems));
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
  localStorage.setItem("autoRemoveState", autoRemove.checked);
}

function drawWheel() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2;

  ctx.clearRect(0, 0, width, height);

  const sliceAngle = (2 * Math.PI) / items.length;

  items.forEach((item, i) => {
    const startAngle = i * sliceAngle;
    const endAngle = startAngle + sliceAngle;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = item.color;
    ctx.fill();

    // متن
    let text = item.text;
    if (text.length > 22) {
      text = text.slice(0, 19) + '...';
    }

    const fontSize = Math.max(10, width * 0.032);
    ctx.font = `${fontSize}px YekanBakh`;
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left'; // مهم: متن رو از چپ رسم می‌کنیم

    // محاسبه‌ی طول متن
    const textWidth = ctx.measureText(text).width;

    const padding = radius * 0.4; // فاصله‌ی ثابت از دایره

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(startAngle + sliceAngle / 2);

    // متن رو طوری رسم می‌کنیم که ابتدای واقعی متن از دایره فاصله‌ی ثابت داشته باشه
    ctx.fillText(text, radius - padding - textWidth / 2, 0);
    ctx.restore();
  });
}



function render() {
  resizeCanvas();
  drawWheel();
}

document.getElementById("magicAdd").addEventListener("click", () => {
  const available = predefinedChallenges.filter(ch => !items.some(i => i.text === ch));
  if (available.length === 0) return;

  const random5 = available.sort(() => 0.5 - Math.random()).slice(0, 5);
  random5.forEach(text => {
    items.push({ text, color: getRandomColor() });
  });

  saveData();
  renderList();
});


function renderList() {
  itemList.innerHTML = "";

  if (items.length === 0) {
    const available = predefinedChallenges.slice().sort(() => 0.5 - Math.random()).slice(0, 7);
    available.forEach(text => {
      items.push({ text, color: getRandomColor() });
    });
    saveData();
    renderList(); // دوباره فراخوانی کن تا لیست و چرخ به‌روزرسانی بشن
    return; // فقط اینجا مجازه چون داخل یک تابع هست
  }


  items.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = removedItems.includes(item.text) ? "dimmed" : "";

    const span = document.createElement("span");
    span.textContent = item.text;

    const actionsDiv = document.createElement("div");
    actionsDiv.className = "actions";

    const editIcon = document.createElement("i");
    editIcon.className = "fa fa-pencil";
    editIcon.addEventListener("click", () => {
      const newText = prompt("ویرایش چالش:", item.text);
      if (newText && !items.some(i => i.text === newText)) {
        items[index].text = newText;
        saveData();
        renderList();
        clickSound.play();
      }
    });

    const removeIcon = document.createElement("i");
    removeIcon.className = "fa fa-times";
    removeIcon.addEventListener("click", () => {
      items.splice(index, 1);
      saveData();
      renderList();
      clickSound.play();
    });

    actionsDiv.appendChild(editIcon);
    actionsDiv.appendChild(removeIcon);

    li.appendChild(span);
    li.appendChild(actionsDiv);
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
  const newText = prompt("ویرایش چالش:", items[index].text);
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
      width: "90%",
      title: "هیچ چالش‌ای وجود ندارد!",
      text: "لطفاً ابتدا چالش‌هایی اضافه کنید",
      icon: "warning",
      customClass: {
        popup: 'yekanBakh',
        title: 'yekanBakh',
        content: 'yekanBakh',
        confirmButton: 'yekanBakh'
      },
      showClass: { popup: 'animate__animated animate__bounceIn' },
      hideClass: { popup: 'animate__animated animate__fadeOut' }
    });
    return;
  }

  const count = activeItems.length;
  const anglePerItem = 360 / count;
  const selectedIndex = Math.floor(Math.random() * count);
  const stopAngle = (selectedIndex * anglePerItem) + Math.floor(Math.random() * (anglePerItem - 5)) + 5;
  const extraRotation = 360 * (Math.floor(Math.random() * 6) + 3);
  const totalRotation = extraRotation + stopAngle;
  currentRotation += totalRotation;

  // ⬅️ پخش صدای چرخش
  if (!isMuted && popupSoundEnabled) {
    wheelSpinSound.play();
  }

  canvas.style.transition = "transform 5s ease-out";
  canvas.style.transform = `rotate(-${currentRotation}deg)`;

  setTimeout(() => {
    // ⬅️ توقف صدای چرخش
    wheelSpinSound.stop();

    const normalizedRotation = (currentRotation % 360 + 360) % 360;
    const selected = activeItems[Math.floor((normalizedRotation) / anglePerItem) % count];

    playRandomSoundOnce();

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
      showClass: { popup: 'animate__animated animate__bounceIn' },
      hideClass: { popup: 'animate__animated animate__fadeOut' },
      background: document.body.classList.contains("dark") ? "#2c2c3c" : "#ffffff",
      color: document.body.classList.contains("dark") ? "#f1f1f1" : "#000000"
    });
    document.getElementById("lastSelectedBox").textContent = `آخرین چالش: ${selected.text}`;
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
  drawWheel(); // اضافه کن
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
  drawWheel();
});

const wheelSizeSlider = document.getElementById("wheelSizeSlider");
let wheelSize = parseInt(localStorage.getItem("wheelSize")) || 700;

wheelSizeSlider.value = wheelSize;
setWheelSize(wheelSize);

wheelSizeSlider.addEventListener("input", () => {
  wheelSize = parseInt(wheelSizeSlider.value);
  localStorage.setItem("wheelSize", wheelSize);
  setWheelSize(wheelSize);
});

function setWheelSize(size) {
  const container = document.querySelector(".wheel-container");
  const screenWidth = window.innerWidth;

  if (screenWidth <= 767) {
    size = 300;
  } else if (screenWidth <= 991) {
    size = 400;
  }

  container.style.width = `${size}px`;
  container.style.height = `${size}px`;
  resizeCanvas(size);
  drawWheel();
}



function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = canvas.clientWidth * dpr;
  canvas.height = canvas.clientHeight * dpr;
  ctx.setTransform(1, 0, 0, 1, 0, 0); // ریست هر اسکیل قبلی
  ctx.scale(dpr, dpr); // مقیاس برای رسم دقیق
}