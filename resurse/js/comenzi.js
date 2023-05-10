window.addEventListener("load", () => {
  const checkboxes = document.querySelectorAll('.form-check-input');

  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', event => {
      const id = event.target.id;
      console.log("!!!!!!!", id)
      var splitArray = id.split("_");
      var status = splitArray[0].substring(6); 
      var numarComanda = splitArray[1];
      // console.log("status", status)
      // console.log("numarComanda", numarComanda)

      fetch('/modificaStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: status, numarComanda: numarComanda})
      })
        .then(response => {
          console.log('Data sent successfully!');
          // salvare starea checkbox-ului in localStorage
          localStorage.setItem(id, event.target.checked);
        })
        .catch(error => {
          console.error('Error sending data:', error);
        });
    });
    
    // verificare daca exista starea checkbox-ului salvata in localStorage
    if (localStorage.getItem(checkbox.id) === "true") {
      checkbox.checked = true;
    }
  });
});
