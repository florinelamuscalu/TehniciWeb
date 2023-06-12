window.addEventListener("DOMContentLoaded", function () {
    let prevBtn = document.getElementById('prevBtn');
    let nextBtn = document.getElementById('nextBtn');
    let currentPageElement = document.getElementById('currentPage');
    let totalPagesElement = document.getElementById('totalPages');
  
    // console.log("produse", produseContainer)
    // console.log("prevBtn", prevBtn)
    // console.log("nextBtn", nextBtn)
  
    const comandaPerPage = 8;
    let currentPage = 1;
  
    prevBtn.addEventListener('click', handlePrevClick);
    nextBtn.addEventListener('click', handleNextClick);
  

    var numarComenzi = document.querySelectorAll('.comenzi #comanda').length;
    console.log('Numărul de comenzi:', numarComenzi);
    // console.log("prevBtn", prevBtn)
    // console.log("nextBtn", nextBtn)
    
  
  
    function handlePrevClick() {
      if (currentPage > 1) {
        currentPage--;
        renderProduse();
        updatePaginator();
      }
    }
  
  
    function handleNextClick() {
      const numarTotalComenzi = numarComenzi;
      console.log('numarTotalComenzi', numarTotalComenzi)
      const numarTotalPagini = Math.ceil(numarTotalComenzi / comandaPerPage);
      if (currentPage < numarTotalPagini) {
        currentPage++;
        renderProduse();
        updatePaginator();
      }
    }
  
  
    function renderProduse() {
      const comanda = document.querySelectorAll('.comenzi #comanda');
      console.log('comanda', comanda)
      const startIndex = (currentPage - 1) * comandaPerPage;
      const endIndex = startIndex + comandaPerPage;
  
  
      for(let i = 0; i < comanda.length; ++i){
        if(i >= startIndex && i < endIndex){
          comanda[i].style.display='block'
        }else{
          comanda[i].style.display='none'
        }
      }
  
      currentPageElement.textContent = currentPage.toString(); 
      const numarTotalComenzi = numarComenzi;
      const numarTotalPagini = Math.ceil(numarTotalComenzi / comandaPerPage);
      totalPagesElement.textContent = numarTotalPagini.toString(); 
  
      // produse.forEach((produs, index) => {
      //   if (index >= startIndex && index < endIndex) {
      //     produs.style.display = 'block';
      //   } else {
      //     produs.style.display = 'none';
      //   }
      // });
    }
  
  
    function updatePaginator() {
      prevBtn.disabled = currentPage === 1;
      nextBtn.disabled = currentPage === Math.ceil(numarComenzi / comandaPerPage);
    }
  
  
    renderProduse();
    updatePaginator();
  });