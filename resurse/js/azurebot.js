function toggleChat() {
  var chatContainer = document.getElementById("chat-container");
  var chatToggleBtn = document.getElementById("chat-toggle-btn");
  if (chatContainer.style.display === "none") {
    chatContainer.style.display = "block";
    chatToggleBtn.innerHTML = "X";
    chatToggleBtn.style.width = "400px";

    var existingMessage = document.getElementById("greeting-message");
    if (!existingMessage) {
      let message = 'Hello, eu sunt micul tău ajutor. Vrei să te ajut să îți instalezi Windows-ul sau să găsești un produs pe placul tău?'
      var newMessage = document.createElement("p");
      newMessage.id = "greeting-message";
      newMessage.style.textAlign = "left"
      newMessage.style.fontSize = "1em"
      newMessage.style.fontFamily = "Courier New"
      newMessage.style.fontWeight = "bold"
      // newMessage.style.marginLeft = "10px"
      // newMessage.style.marginRight = "10px"
      newMessage.style.borderBottom = "2px solid white"
      newMessage.innerHTML = message;
      chatbox.appendChild(newMessage);
    }
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

  // Trimitere mesaj la server folosind fetch
  try {
    const response = await fetch('/azurebot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: message })
    });

    const data = await response.json();
    console.log('Răspuns de la server:', data);
  } catch (error) {
    console.error('Eroare la trimiterea mesajului:', error);
  }
}


