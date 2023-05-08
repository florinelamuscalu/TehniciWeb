window.addEventListener("load", () => {
    const checkboxes = document.querySelectorAll('.form-check-input');
    const nrcParagraph = document.getElementById("nrc");
    const nrcText = nrcParagraph.textContent;
    const nrc = nrcText.substring(nrcText.lastIndexOf(" ") + 1);
    console.log(nrc);
    console.log("paragraf", nrcParagraph)
    console.log("text", nrcText)


  
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', event => {
        const id = event.target.id;
        console.log("!!!!!!!", id )
        const lastDigit = id[id.length - 1];
        console.log(lastDigit)
  
        fetch('/modificaStatus', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ data: lastDigit, numarComanda: nrc })
        })
        .then(response => {
          console.log('Data sent successfully!');
        })
        .catch(error => {
          console.error('Error sending data:', error);
        });
      });
    });
  });
  