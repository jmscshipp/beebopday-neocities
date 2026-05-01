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

function wrapInAsciiBorder(element, type = "window", selected = false) {
  // measure width and height
  const { charWidth, charHeight } = getCharSize();
  const width = Math.round(element.offsetWidth / charWidth);
  const height = Math.round(element.offsetHeight / charHeight);
  // create wrapper
  const wrapper = document.createElement("div");
  wrapper.className = "wrapper";
  // create border
  const border = document.createElement("pre");
  if (type === "header") {
    border.textContent = generateHeaderBorder(width - 3, height);
  } else if (type === "button") {
    border.textContent = generateButtonBorder(width, selected);
  } else {
    border.textContent = generateWindowBorder(width, height);
  }
  border.className = "border";
  // wrap the element
  element.parentNode.insertBefore(wrapper, element);
  wrapper.appendChild(border);
  wrapper.appendChild(element);
}

// generating ascii borders for all elements
const buttons = document.querySelectorAll(".bordered-button");
buttons.forEach((element) => {
  wrapInAsciiBorder(element, "button");
});
document.querySelectorAll(".window").forEach((element) => {
  wrapInAsciiBorder(element, "window");
});
document.querySelectorAll(".header").forEach((element) => {
  wrapInAsciiBorder(element, "header");
});

// hover effect for buttons
buttons.forEach((button) => {
  button.addEventListener(
    "mouseenter",
    () =>
      (button.parentElement.querySelector(".border").textContent =
        generateButtonBorder(
          Math.round(button.offsetWidth / getCharSize().charWidth),
          true,
        )),
  );
  button.addEventListener(
    "mouseleave",
    () =>
      (button.parentElement.querySelector(".border").textContent =
        generateButtonBorder(
          Math.round(button.offsetWidth / getCharSize().charWidth),
          false,
        )),
  );
});

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
      const charHeightNum = Math.ceil(
        scrollbar.offsetHeight / getCharSize().charHeight,
      );
      updateScrollbar(charHeightNum);
      scrollContent.addEventListener("scroll", () =>
        updateScrollbar(charHeightNum),
      );
    });
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
  console.log(thumbIndex);
  if (thumbIndex == 0) {
    thumbString += "v";
    thumbString += " ".repeat(charHeightNum - 1);
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
          thumbString += "v";
        }
      } else if (i <= thumbIndex) {
        thumbString += ":";
      } else {
        thumbString += " ";
      }
    }
  }
  scrollbar.textContent = thumbString;
}
