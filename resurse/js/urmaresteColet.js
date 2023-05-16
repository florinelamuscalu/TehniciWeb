function urmaresteColet(numarComanda) {
    fetch(`/stergeColet/${numarComanda}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        console.log('Comanda a fost ștearsă cu succes.');
        location.reload();
      } else {
        console.error('A apărut o eroare în timpul ștergerii comenzii.');
      }
    })
    .catch(error => {
      console.error('A apărut o eroare în timpul efectuării solicitării:', error);
    });
  }
  