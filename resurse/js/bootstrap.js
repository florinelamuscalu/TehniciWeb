function toggle(event) {
    var myCollapse = document.getElementsByClassName('collapse')[0];
    var bsCollapse = new bootstrap.Collapse(myCollapse, {
        toggle: true
    });
    $('.collapse').collapse().on('hidden', function() {
        if (this.id) {
            localStorage[this.id] = 'true';
        }
    }).on('shown', function() {
        if (this.id) {
            localStorage.removeItem(this.id);
        }
    }).each(function() {
        if (this.id && localStorage[this.id] === 'true' ) {
            $(this).collapse('hide');
        }
    });
}

