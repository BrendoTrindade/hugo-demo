document.addEventListener('DOMContentLoaded', function() {
    // Pré-carrega os links externos
    const externalLinks = {
        'curriculo': 'https://rxresu.me/brendo.trindade/resumo',
        'linktree': 'https://linktr.ee/brendo_trindade'
    };

    // Cria iframes ocultos para pré-carregar
    Object.values(externalLinks).forEach(url => {
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        
        // Remove o iframe após o carregamento
        iframe.onload = function() {
            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 1000);
        };
    });

    // Adiciona manipuladores de eventos para os links
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const url = this.href;
            window.open(url, '_blank');
            e.preventDefault();
        });
    });
});
