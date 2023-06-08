socketUrl = "../../";
//var port = "8080"

function data(nr) {
	if (nr < 10)
		return "0" + nr
}

if (document.location.href.indexOf("localhost") != -1) {
	socketUrl = "http://127.0.0.1:" + port;
}
//const socket = io(socketUrl,{reconnect: true});  
socket = io();
socket.on("mesaj_nou", function (nume, culoare, mesaj) {

	time = new Date();
	date = time.getFullYear() + "/" + (time.getMonth + 1) + '/' + time.getDate() + "  " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
	date = data(date)
	var chat = document.getElementById("mesaje_chat");
	chat.innerHTML += `<p> ${date} ${nume} : <span style= 'background-color: ${background_color}; 'color:${culoare}'>${mesaj}</span></p> `;


	//ca sa scrolleze la final
	chat.scrollTop = chat.scrollHeight;
});

function trimite() {
	var background_color = document.getElementById("b_culoare").value;
	var culoare = document.getElementById("culoare").value;
	var nume = document.getElementById("nume").value;
	var mesaj = document.getElementById("mesaj").value;
	fetch("/mesaj", {

		method: "POST",
		headers: { 'Content-Type': 'application/json' },

		mode: 'cors',
		cache: 'default',
		body: JSON.stringify({
			background_color: background_color,
			culoare: culoare,
			nume: nume,
			mesaj: mesaj
		})
	})


}
