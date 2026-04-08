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
  console.log("selected", selected);
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
