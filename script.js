async function populateThoughtCabinet() {
  const fileLocation = "/thoughts.json";
  try {
    let response = await fetch(fileLocation);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    let data = await response.json();
    data.thoughts.sort((a, b) => new Date(a.Date) - new Date(b.Date));
    document.getElementById("thought-title").innerHTML = data.thoughts[0].title;
    document.getElementById("thought-content").innerHTML =
      data.thoughts[0].content;
    document.getElementById("thought-date").innerHTML = data.thoughts[0].date;
  } catch (error) {
    console.error(error.message);
  }
}

async function populateChangeLog() {
  const fileLocation = "/site-updates.json";
  try {
    let response = await fetch(fileLocation);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    let data = await response.json();
    data.siteUpdates.sort((a, b) => new Date(a.Date) - new Date(b.Date));
    const changeLog = document.getElementById("change-log");
    for (update of data.siteUpdates) {
      const container = document.createElement("div");
      container.class = "";
      const content = document.createElement("p");
      content.class = "";
      content.innerHTML = update.content;
      const date = document.createElement("p");
      date.class = "";
      date.innerHTML = update.date;
      container.appendChild(content);
      container.appendChild(date);
      changeLog.appendChild(container);
    }
    document.fonts.ready.then(() => {
      // nothing to scroll
      if (scrollContent.scrollHeight <= scrollContent.clientHeight) {
        scrollbar.className = "disabled";
        return;
      }
      const charHeightNum = Math.ceil(
        scrollbar.offsetHeight / getCharSize().charHeight,
      );
      updateScrollbar(charHeightNum);
      scrollContent.addEventListener("scroll", () =>
        updateScrollbar(charHeightNum),
      );
    });
    const wrapper = changeLog.closest(".bordered-window");
    const existingBorder = wrapper.querySelector(".border");
    if (existingBorder) existingBorder.remove();
    createAsciiBorder(wrapper, "window");
  } catch (error) {
    console.error(error.message);
  }
}

populateThoughtCabinet();
populateChangeLog();

// changelog scrollbar graphics
const scrollContent = document.getElementById("change-log");
const scrollbar = document.getElementById("scroll-bar");

function updateScrollbar(charHeightNum) {
  const scrollPercentage =
    scrollContent.scrollTop /
    (scrollContent.scrollHeight - scrollContent.clientHeight);
  const thumbIndex = Math.round(scrollPercentage * (charHeightNum - 2));
  let thumbString = "";
  if (thumbIndex == 0) {
    thumbString += "o";
    thumbString += ":".repeat(charHeightNum - 2);
  } else {
    for (let i = 0; i < charHeightNum - 1; i++) {
      console.log(
        "i = " +
          i +
          " thumbIndex = " +
          thumbIndex +
          " charHeightNum - 2 = " +
          (charHeightNum - 2),
      );
      if (i == thumbIndex) {
        if (i == charHeightNum - 2) {
          thumbString += "x";
        } else {
          thumbString += "o";
        }
      } else {
        thumbString += ":";
      }
    }
  }
  scrollbar.textContent = thumbString;
}

// time display
const asciiNumberLookup = {
  0: [" .--. ", ": ,. :", ": :: :", ": :; :", "`.__.'"],
  1: ["  ,-.", ".'  :", " `: :", "  : :", "  :_;"],
  2: [".---. ", "`--. :", "  ,','", ".'.'_ ", ":____;"],
  3: [".----.", "`--  ;", " .' ' ", " _`,`.", "`.__.'"],
  4: ["  .-. ", " .'.' ", ".'.'_ ", ":_ ` :", "  :_: "],
  5: [".----.", ": .--'", "`. `. ", ".-`, :", "`.__.'"],
  6: ["  .-. ", " .'.' ", ".' '. ", ": .; :", "`.__.'"],
  7: [".----.", "`--  ;", " ,',' ", " : :  ", " :_:  "],
  8: [" .--. ", ": .; :", "`.  .'", ": .; :", "`.__.'"],
  9: [" .--. ", ": .; :", "`._, :", "   : :", "   :_:"],
  ":": ["   ", " _ ", ":_:", " _ ", ":_;"],
};

const periodLookup = {
  am: [" __ _ _ __  ", "/ _` | '  \\ ", "\\__,_|_|_|_|", "            "], // period means am / pm
  pm: [" _ __ _ __  ", "| '_ \\ '  \\ ", "| .__/_|_|_|", "|_|         "],
};

function updateAsciiClock() {
  const parentElement = document.getElementById("ascii-clock");
  parentElement.textContent = ""; // clear default text

  const timeContainer = document.createElement("div");
  parentElement.appendChild(timeContainer);
  timeContainer.className = "side-by-side-no-gap";

  // clock display
  const timeDisplay = document.createElement("div");
  timeContainer.appendChild(timeDisplay);
  let timeRows = ["", "", "", "", ""];
  const time = new Date();

  const timeStr =
    (time.getHours() % 12 || 12) +
    ":" +
    (time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes());

  for (const char of timeStr) {
    for (let i = 0; i < timeRows.length; i++) {
      timeRows[i] += asciiNumberLookup[char][i];
    }
  }

  timeRows.forEach((row) => {
    const pre = document.createElement("pre");
    pre.style.margin = "0";
    pre.textContent = row;
    timeDisplay.appendChild(pre);
  });
  timeDisplay.appendChild(document.createElement("pre"));

  // period display
  const periodDisplay = document.createElement("div");
  periodDisplay.style = "align-self: flex-end;";
  timeContainer.appendChild(periodDisplay);
  const periodRows = ["", "", "", ""];
  const period = time.getHours() >= 12 ? "pm" : "am";
  for (let i = 0; i < periodRows.length; i++) {
    periodRows[i] += periodLookup[period][i];
  }

  periodRows.forEach((row) => {
    const pre = document.createElement("pre");
    pre.style.margin = "0";
    pre.textContent = row;
    periodDisplay.appendChild(pre);
  });

  // date display
  const dateDisplay = document.createElement("div");
  dateDisplay.textContent =
    "- " +
    time.toLocaleString("default", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }) +
    " -";
  dateDisplay.style = "justify-self: center";
  parentElement.appendChild(document.createElement("br"));
  parentElement.appendChild(dateDisplay);

  // emotion of the day display
  const emotions = [
    ":V",
    "(>_<)",
    "(O_O)/",
    "\\(^_^;)",
    "\\<+_+>/",
    ":-D",
    ":-O",
    "{^_^}7",
    "(^o^)/",
    ":-U",
    "[T_T]",
    "t(<_<)t",
    "{-_-}7",
  ];
  const emotionDisplay = document.createElement("div");
  emotionDisplay.style = "justify-self: center";
  emotionDisplay.textContent =
    "today's emotion: " + emotions[time.getDate() % emotions.length];
  parentElement.appendChild(emotionDisplay);
}

updateAsciiClock();
setInterval(updateAsciiClock, 1000); // update every second

/*
// under construction text animation
const constructionZones = document.querySelectorAll(".construction-zone");
let lastShiftedTime = 0;

function frame() {
  // shifting text every 150ms
  if (Date.now() - lastShiftedTime > 500) {
    constructionZones.forEach((zone) => {
      [...zone.children].forEach((textDisplay) => {
        const text = textDisplay.textContent;
        textDisplay.textContent = text.slice(1) + text[0];
      });
    });
    lastShiftedTime = Date.now();
  }
  requestAnimationFrame(frame);
}

document.fonts.ready.then(() => {
  // setting up pre elements w/ text for each construction zone
  for (const zone of constructionZones) {
    zone.textContent = "";
    let scrollingText = document.createElement("pre");
    scrollingText.textContent =
      "under construction under construction under construction under construction ";
    scrollingText.style.fontStyle = "italic";
    zone.append(scrollingText);
  }
  requestAnimationFrame(frame); // single loop for all
});
*/

function getCharSize() {
  // temporarily add text element to measure size
  const test = document.createElement("pre");
  test.style =
    "position: absolute; visibility: hidden; font-size: medium;font-family: monospace;";
  test.textContent = "─";
  document.body.appendChild(test);
  const charWidth = test.offsetWidth;
  const charHeight = test.offsetHeight;
  document.body.removeChild(test);
  return { charWidth, charHeight };
}

function wrapAsciiElement(element, type = "window") {
  const wrapper = document.createElement("div");

  // transfer style from the element to the wrapper
  element.classList.forEach((element) => {
    if (
      element === "ascii-window" ||
      element === "ascii-header" ||
      element === "ascii-button"
    )
      return;
    wrapper.classList.add(element);
  });

  if (type === "header") wrapper.classList.add("bordered-header");
  else if (type === "button") wrapper.classList.add("bordered-button");
  else wrapper.classList.add("bordered-window");

  element.parentNode.insertBefore(wrapper, element);
  wrapper.appendChild(element); // add element first so it establishes wrapper size
}

function createAsciiBorder(wrapper, type = "window", selected = false) {
  const { charWidth, charHeight } = getCharSize();

  // measure AFTER element is in DOM and wrapper has settled
  const width = Math.floor(wrapper.offsetWidth / charWidth);
  const height = Math.floor(wrapper.offsetHeight / charHeight) - 1;
  const border = document.createElement("pre");

  if (type === "header") {
    border.textContent = generateHeaderBorder(width - 4, height);
  } else if (type === "button") {
    const buttonWidth =
      Math.ceil(wrapper.firstChild.offsetWidth / charWidth) + 1;
    border.textContent = generateButtonBorder(buttonWidth, selected);
  } else {
    border.textContent = generateWindowBorder(width - 2, height);
  }
  border.className = "border";
  border.style.pointerEvents = "none";

  wrapper.appendChild(border); // border goes after so it overlays
}

function generateWindowBorder(width, height) {
  const top = "╔" + "─".repeat(width) + "╗";
  const middle = "│" + " ".repeat(width) + "│";
  const bottom = "╚" + "─".repeat(width) + "╝";

  let border = top + "\n";
  for (let i = 0; i < height; i++) {
    border += middle + "\n";
  }
  border += bottom;

  return border;
}

function generateHeaderBorder(width, height) {
  const top = "╔" + "═".repeat(width) + "╗";
  const middle = "║" + " ".repeat(width) + "║";
  const bottom = "╚" + "═".repeat(width) + "╝";

  let border = top + "\n";
  for (let i = 0; i < height; i++) {
    border += middle + "\n";
  }
  border += bottom;

  return border;
}

function generateButtonBorder(width, selected = false) {
  return "{" + (selected ? "▓" : "░").repeat(width) + "}";
}

// wrap all elements
document.querySelectorAll(".ascii-window").forEach((element) => {
  wrapAsciiElement(element, "window");
});
document.querySelectorAll(".ascii-header").forEach((element) => {
  wrapAsciiElement(element, "header");
});
document.querySelectorAll(".ascii-button").forEach((element) => {
  wrapAsciiElement(element, "button");
});

// generate ascii borders
document.querySelectorAll(".bordered-window").forEach((element) => {
  createAsciiBorder(element, "window");
});

document.querySelectorAll(".bordered-header").forEach((element) => {
  createAsciiBorder(element, "header");
});

document.querySelectorAll(".bordered-button").forEach((element) => {
  createAsciiBorder(element, "button");
});

// hover effect for buttons
const buttons = document.querySelectorAll(".ascii-button");
buttons.forEach((button) => {
  button.addEventListener(
    "mouseenter",
    () =>
      (button.parentElement.querySelector(".border").textContent =
        generateButtonBorder(
          Math.ceil(button.offsetWidth / getCharSize().charWidth) + 1,
          true,
        )),
  );
  button.addEventListener(
    "mouseleave",
    () =>
      (button.parentElement.querySelector(".border").textContent =
        generateButtonBorder(
          Math.ceil(button.offsetWidth / getCharSize().charWidth) + 1,
          false,
        )),
  );
});
