async function botLogic(context) {
    if (context.activity.type === 'message') {
      const userMessage = context.activity.text;
  
      // Logica bot-ului pentru prelucrarea mesajului utilizatorului
      const botResponse = 'Răspunsul bot-ului la mesajul utilizatorului: ' + userMessage;
  
      // Trimiterea răspunsului utilizatorului
      await context.sendActivity(botResponse);
    }
  }

  function toggleChat() {
    var chatContainer = document.getElementById("chat-container");
    var chatToggleBtn = document.getElementById("chat-toggle-btn");
    if (chatContainer.style.display === "none") {
      chatContainer.style.display = "block";
      chatToggleBtn.innerHTML = "X";
    } else {
      chatContainer.style.display = "none";
      chatToggleBtn.innerHTML = "Cu ce te putem ajuta?";
    }
  }

  function sendMessage() {
    var message = document.getElementById("message").value;
    var chatbox = document.getElementById("chatbox");
    var newMessage = document.createElement("p");
    newMessage.innerHTML = message;
    chatbox.appendChild(newMessage);
    document.getElementById("message").value = "";
    chatbox.scrollTop = chatbox.scrollHeight;
  }
  