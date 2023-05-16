function toggleChat() {
  var chatContainer = document.getElementById("chat-container");
  var chatToggleBtn = document.getElementById("chat-toggle-btn");
  if (chatContainer.style.display === "none") {
    chatContainer.style.display = "block";
    chatToggleBtn.innerHTML = "X";
    let message = 'Hello, eu sunt micul tău ajutor. Vrei să te ajut să îți instalezi Windows-ul sau să găsești un produs pe placul tău?'
    var newMessage = document.createElement("p");
    newMessage.style.textAlign = "left"
    newMessage.style.fontSize = "0.8em"
    newMessage.style.fontFamily = "Courier New"
    newMessage.style.marginLeft = "4px"
    newMessage.innerHTML = message;
    chatbox.appendChild(newMessage);
  } else {
    chatContainer.style.display = "none";
    chatToggleBtn.innerHTML = "Cu ce te putem ajuta?";
  }
}


async function sendMessage() {
  var message = document.getElementById("message").value;
  var chatbox = document.getElementById("chatbox");
  var newMessage = document.createElement("p");
  newMessage.innerHTML = message;
  chatbox.appendChild(newMessage);
  document.getElementById("message").value = "";
  chatbox.scrollTop = chatbox.scrollHeight;

  // timitere mesaj
  console.log("mesaj", message)

}

