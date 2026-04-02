function generateBorder(width, height) {
  const top = "╔" + "─".repeat(width + 1) + "╗";
  const middle = "│" + " ".repeat(width + 1) + "│";
  const bottom = "╚" + "─".repeat(width + 1) + "╝";

  let border = top + "\n";
  for (let i = 0; i < height + 1; i++) {
    border += middle + "\n";
  }
  border += bottom;

  return border;
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

function wrapInAsciiBorder(element) {
  // measure width and height
  const { charWidth, charHeight } = getCharSize();
  const width = Math.round(element.offsetWidth / charWidth);
  const height = Math.round(element.offsetHeight / charHeight);
  console.log(`Element size: ${width} chars wide, ${height} chars tall`);
  // create wrapper
  const wrapper = document.createElement("div");
  wrapper.className = "wrapper";
  // create border
  const border = document.createElement("pre");
  border.textContent = generateBorder(width, height);
  border.className = "border";
  // wrap the element
  element.parentNode.insertBefore(wrapper, element);
  wrapper.appendChild(border);
  wrapper.appendChild(element);
}

wrapInAsciiBorder(document.getElementById("test-box"));
