window.addEventListener("DOMContentLoaded", function () {
  let prevBtn = document.getElementById('prevBtn');
  let nextBtn = document.getElementById('nextBtn');
  let currentPageElement = document.getElementById('currentPage');
  let totalPagesElement = document.getElementById('totalPages');

  // console.log("produse", produseContainer)
  // console.log("prevBtn", prevBtn)
  // console.log("nextBtn", nextBtn)

  const produsePerPage = 8;
  let currentPage = 1;

  prevBtn.addEventListener('click', handlePrevClick);
  nextBtn.addEventListener('click', handleNextClick);

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
    const numarTotalProduse = document.getElementsByClassName('produs').length;
    console.log('numarTotalProduse', numarTotalProduse)
    const numarTotalPagini = Math.ceil(numarTotalProduse / produsePerPage);
    if (currentPage < numarTotalPagini) {
      currentPage++;
      renderProduse();
      updatePaginator();
    }
  }


  function renderProduse() {
    const produse = document.getElementsByClassName('produs');
    //console.log('produse', produse)
    const startIndex = (currentPage - 1) * produsePerPage;
    const endIndex = startIndex + produsePerPage;


    for(let i = 0; i < produse.length; ++i){
      if(i >= startIndex && i < endIndex){
        produse[i].style.display='block'
      }else{
        produse[i].style.display='none'
      }
    }

    currentPageElement.textContent = currentPage.toString(); 
    const numarTotalProduse = document.getElementsByClassName('produs').length;
    const numarTotalPagini = Math.ceil(numarTotalProduse / produsePerPage);
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
    nextBtn.disabled = currentPage === Math.ceil(document.querySelectorAll('.produs').length / produsePerPage);
  }


  renderProduse();
  updatePaginator();
});