window.addEventListener("load", function () {

	prod_sel = localStorage.getItem("cos_virtual");

	if (prod_sel) {
		var vect_ids = prod_sel.split(",");
		fetch("/produse_cos", {

			method: "POST",
			headers: { 'Content-Type': 'application/json' },

			mode: 'cors',
			cache: 'default',
			body: JSON.stringify({
				a: 10,
				b: 20,

				ids_prod: vect_ids

			})
		})
			.then(function (rasp) { console.log(rasp); x = rasp.json(); console.log(x); return x })
			.then(function (objson) {

				//console.log(objson);//objson e vectorul de produse
				let main = document.getElementsByTagName("main")[0];
				let btn = document.getElementById("cumpara");

				for (let prod of objson) {
					let article = document.createElement("article");
					article.classList.add("cos-virtual");
					var h2 = document.createElement("h2");
					h2.innerHTML = prod.nume;
					article.appendChild(h2);

					let imagine = document.createElement("img");
					imagine.src = "/resurse/imagini/produse/" + prod.imagine;
					article.appendChild(imagine);

					let descriere = document.createElement("p");
					descriere.innerHTML = "<b>Pret:</b>" + prod.pret + " RON" + "&emsp;";
					article.appendChild(descriere);

					console.log("a trecut de descriere!!")
					var cantitate = document.createElement("input");
					cantitate.type = "number"; // Seteaza tipul input-ului la numar
					cantitate.min = 0; // Seteaza valoarea minima a input-ului la 1
					cantitate.value = 1; // Seteaza valoarea initiala a input-ului la 1
					cantitate.classList.add("form-control");
					cantitate.id = "cant"
					article.appendChild(cantitate);
					main.insertBefore(article, btn);
					
					console.log("cantitate!!", cantitate.value)
					var ok = 1;
				
					cantitate.addEventListener("input", function () {
						if (cantitate.value === "0") { // Verifica daca valoarea input-ului de cantitate este 0
							article.parentNode.removeChild(article);
							ok = 0
						  } else {
							descriere.innerHTML = "<b>Pret:</b>" + prod.pret * cantitate.value;

							ok = 1
						}

					});

				}

				if(ok == 0){
					let p = document.createElement("p");
					p.innerHTML = "Cosul de cumparaturi este gol";
					p.id = "cos_gol"
					main.appendChild(p);
					let btn = document.getElementById("cumpara");
					btn.disabled = true;
				}


			}
			).catch(function (err) { console.log(err) });


		document.getElementById("cumpara").onclick = function () {
			prod_sel = localStorage.getItem("cos_virtual");// "1,2,3"
			//console.log("aaaaa", prod_sel)
			var cantitate = document.querySelectorAll("#cant")
			var valoriCant = Array.from(cantitate).map(function(cant) {
				return cant.value; // Accesați și returnați valorile input-urilor într-un nou vector
			  });
			  
			console.log("alaaaaa", valoriCant); // Afișați vectorul cu valorile input-urilor
			var produse = []
			if (prod_sel) {
				var vect_ids = prod_sel.split(",");

				// Parcurgem lista de produse și extragem cantitățile din localStorage
				for (let i = 0; i<= vect_ids.length; ++i) {
					produse.push({id: vect_ids[i], cantitate:valoriCant[i]})
				}
				// console.log("produse id+cant", produse)

				// for (let i = 0; i < produse.length -1; ++i) {
				// 	console.log("ID produs: " + produse[i].id); // Afișați ID-urile produselor din vectorul produse
				//   }

				fetch("/cumpara", {

					method: "POST",
					headers: { 'Content-Type': 'application/json' },

					mode: 'cors',
					cache: 'default',
					body: JSON.stringify({
						cantitate: produse,
						//cantitati: cantitati,
						a: 10,
						b: "abc"
					})
				})
					.then(function (rasp) { console.log(rasp); return rasp.text() })
					.then(function (raspunsText) {

						console.log(raspunsText);
						if (raspunsText) {
							localStorage.removeItem("cos_virtual")
							let p = document.createElement("p");
							p.innerHTML = raspunsText;
							document.getElementsByTagName("main")[0].innerHTML = "";
							document.getElementsByTagName("main")[0].appendChild(p)

						}
					}).catch(function (err) { console.log(err) });
			}
		}

	}
	else {
		document.getElementsByTagName("main")[0].innerHTML = "<p>Nu aveti nimic in cos!</p>";
	}


});

