function stergeProdus(spec) {
    specificatii = decodeURIComponent(spec)
    console.log("!!!!!!!!", spec)
    fetch(`/stergeProduse/${spec}`, {
      method: "DELETE"
    })
    .then(response => {
      console.log("response", response)
      if (!response.ok) {
        throw new Error("A avut loc o eroare");
      }
      return response.json();
    })
    .then(data => {
      console.log(data.message); 
      const rand = document.getElementById(`rand_${spec}`);
      rand.remove();
      window.location.reload();
    })
    .catch(error => {
      console.error(error);
    });
  }
  