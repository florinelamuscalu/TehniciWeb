window.addEventListener("DOMContentLoaded", function () {
  const itemsPerPage = 8; // Numărul de elemente afișate pe pagină
  const list = document.getElementById('list');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  let totalPages = 1;
  let currentPage = 1;

  // Funcție pentru afișarea listei de elemente pe pagină
  function showItems(items, page) {
    list.innerHTML = '';
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = page * itemsPerPage;
    for (let i = startIndex; i < endIndex && i < items.length; i++) {
      const li = document.createElement('li');
      li.textContent = items[i].nume;
      list.appendChild(li);
    }
  }

  // Funcție pentru actualizarea stării butoanelor de navigare
  function updateButtons(page, totalPages) {
    if (page === 1) {
      prevBtn.disabled = true;
    } else {
      prevBtn.disabled = false;
    }

    if (page === totalPages) {
      nextBtn.disabled = true;
    } else {
      nextBtn.disabled = false;
    }
  }

  // Eveniment pentru butonul "Prev"
  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      getItemsFromServer(currentPage);
    }
  });

  // Eveniment pentru butonul "Next"
  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      getItemsFromServer(currentPage);
    }
  });

  // Funcție pentru a obține datele de la server
  function getItemsFromServer(page) {
    // Face cererea către server pentru a obține datele actualizate
    fetch(`/produse?page=${page}`) // Modifică ruta și parametrii cererii pentru a se potrivi cu ruta și parametrii din server
      .then(response => response.json())
      .then(data => {
        showItems(data.items, data.currentPage);
        updateButtons(data.currentPage, data.totalPages);
      })
      .catch(error => console.error(error));
  }

  // Inițializează lista de produse și butoanele de navigare
  getItemsFromServer(currentPage);

});
