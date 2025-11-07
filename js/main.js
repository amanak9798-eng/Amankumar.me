document.addEventListener('DOMContentLoaded', function() {
    const headPlaceholder = document.getElementById('head-placeholder');
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    const loadHTML = (url, placeholder) => {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                placeholder.innerHTML = data;
            })
            .catch(error => console.error(`Error loading ${url}:`, error));
    };

    if (headPlaceholder) {
        loadHTML('_head.html', headPlaceholder);
    }

    if (headerPlaceholder) {
        loadHTML('_header.html', headerPlaceholder);
    }

    if (footerPlaceholder) {
        loadHTML('_footer.html', footerPlaceholder);
    }
});
