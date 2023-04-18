function adaugaFavorite(id){
    var idProdus = id.split("_")[1]
    console.log("JS client idProdus", idProdus)

    fetch('/favorite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({idProdus})
      })
      .then(response => {
        if (response.ok) {
            var mesajDiv = document.createElement('div');
            mesajDiv.textContent = 'Produsul a fost adaugat la favorite'; 
            mesajDiv.style.position = 'fixed';
            mesajDiv.style.top = '10%';
            mesajDiv.style.right = '0';
            mesajDiv.style.backgroundColor = '#FFAD03'; 
            mesajDiv.style.color = 'white'; 
            mesajDiv.style.padding = '10px'; 
            mesajDiv.style.fontSize='1em';
           
            document.body.appendChild(mesajDiv);
            
            setTimeout(function() {
              mesajDiv.style.display = 'none'; 
            }, 2000);
        } else {
            var mesajDiv = document.createElement('div');
            mesajDiv.textContent = 'Produsul nu a fost adaugat la favorite, verificati daca aveti produsul la favorite sau daca sunteti logat'; 
            mesajDiv.style.position = 'fixed';
            mesajDiv.style.top = '10%';
            mesajDiv.style.right = '0';
            mesajDiv.style.backgroundColor = '#FFAD03'; 
            mesajDiv.style.color = 'white'; 
            mesajDiv.style.padding = '10px'; 
            mesajDiv.style.fontSize='1em';
           
            document.body.appendChild(mesajDiv);
            
            setTimeout(function() {
              mesajDiv.style.display = 'none'; 
            }, 2000);
        }
      })
      .catch(error => {
        console.error('Eroare la adăugarea la favorite:', error);
      });
}

function stergeFavorite(id){
  var idProdus = id.split("_")[1]
  console.log("JS client idProdus", idProdus)

  fetch('/favorite', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({idProdus})
    })
    .then(response => {
      if (response.ok) {
          var mesajDiv = document.createElement('div');
          mesajDiv.textContent = 'Produsul a fost sters de la favorite'; 
          mesajDiv.style.position = 'fixed';
          mesajDiv.style.top = '10%';
          mesajDiv.style.right = '0';
          mesajDiv.style.backgroundColor = '#FFAD03'; 
          mesajDiv.style.color = 'white'; 
          mesajDiv.style.padding = '10px'; 
          mesajDiv.style.fontSize='1em';
         
          document.body.appendChild(mesajDiv);
          
          setTimeout(function() {
            mesajDiv.style.display = 'none'; 
          }, 2000);

          window.location.reload();

      } else {
          var mesajDiv = document.createElement('div');
          mesajDiv.textContent = 'Produsul nu a fost sters de la favorite'; 
          mesajDiv.style.position = 'fixed';
          mesajDiv.style.top = '10%';
          mesajDiv.style.right = '0';
          mesajDiv.style.backgroundColor = '#FFAD03'; 
          mesajDiv.style.color = 'white'; 
          mesajDiv.style.padding = '10px'; 
          mesajDiv.style.fontSize='1em';
         
          document.body.appendChild(mesajDiv);
          
          setTimeout(function() {
            mesajDiv.style.display = 'none'; 
          }, 2000);

          window.location.reload();

      }
    })
    .catch(error => {
      console.error('Eroare la strgere de la favorite:', error);
    });
}