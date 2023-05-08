function submitForm() {
    const form = document.querySelector('form');
    const url = form.action;
    const formData = new FormData(form);
  
    fetch(url, { method: 'POST', body: formData })
      .then(response => response.text())
      .then(data => {
        const url = window.location.href.split('?')[0];
        window.history.replaceState({}, document.title, url);
        location.replace(url);
      })
      .catch(error => console.error(error));
  }
  