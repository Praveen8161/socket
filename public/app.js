const socket = io("ws://localhost:5000");

const msgInput = document.querySelector("#message");
const nameInput = document.querySelector("#name");
const chatRoom = document.querySelector("#room");

const activity = document.querySelector(".activity");
const userList = document.querySelector(".user-list");
const roomList = document.querySelector(".room-list");
const chatDisplay = document.querySelector(".chat-display");

document.querySelector(".form-msg").addEventListener("submit", sendMessage);

function sendMessage(e) {
  e.preventDefault();

  if (nameInput.value && msgInput.value && chatRoom.value) {
    socket.emit("message", {
      name: nameInput.value,
      text: msgInput.value,
      room: chatRoom.value,
    });
    msgInput.value = "";
  }
  msgInput.focus();
}

document.querySelector(".form-join").addEventListener("submit", enterRoom);

function enterRoom(e) {
  e.preventDefault();
  if (nameInput.value && chatRoom.value) {
    socket.emit("enterRoom", {
      name: nameInput.value,
      room: chatRoom.value,
    });
  }
}

msgInput.addEventListener("keypress", () => {
  socket.emit("activity", nameInput.value);
});

// Listen for messaages from server
socket.on("message", (data) => {
  activity.textContent = "";

  const li = document.createElement("li");

  li.textContent = data;
  document.querySelector("ul").appendChild(li);
});

let activityTimer;
// Listen for Activity
socket.on("activity", (name) => {
  activity.textContent = `${name} is typing ...`;

  // Clear after 3 seconds
  clearTimeout(activityTimer);
  activityTimer = setTimeout(() => {
    activity.textContent = "";
  }, 3000);
});
