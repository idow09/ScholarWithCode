function makeIconElement() {
    let xmlns = 'http://www.w3.org/2000/svg';
    let svgElem = document.createElementNS(xmlns, "svg");
    let iconSize = 18;
    let viewSize = 432 / iconSize;
    svgElem.setAttributeNS(null, "viewBox", "0 0 " + viewSize + " " + viewSize);
    svgElem.setAttributeNS(null, "width", iconSize);
    svgElem.setAttributeNS(null, "height", iconSize);
    let path1 = document.createElementNS(xmlns, "path");
    path1.setAttributeNS(null, "d", "M0 0h24v24H0V0z");
    path1.setAttributeNS(null, "fill", "none");
    let path2 = document.createElementNS(xmlns, "path");
    path2.setAttributeNS(null, "d", "M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z");
    svgElem.appendChild(path1);
    svgElem.appendChild(path2);
    return svgElem;
}

let observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (!mutation.addedNodes) return
        for (let i = 0; i < mutation.addedNodes.length; i++) {
            let node = mutation.addedNodes[i];
            if (!node.classList.contains('fresh-serp')) return
            let results = document.getElementsByClassName('search-result-title');
            // Go over all regions and add code implementations
            for (let i = 0, l = results.length; i < l; i++) {
                let title = results[i].childNodes[0].childNodes[0].textContent;
                chrome.runtime.sendMessage({
                    title: title,
                    payload: i
                }, function(response) {
                    let results = document.getElementsByClassName('paper-actions');
                    let result = results[response.payload];
                    let a = result.firstChild.cloneNode(true);
                    a.href = response.paper_link;
                    a.firstChild.replaceChild(makeIconElement(), a.firstChild.firstChild);
                    a.firstChild.childNodes[1].innerText = response.txt;
                    result.appendChild(a);
                });
            }
        }
    })
})

observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
})

// stop watching using:
// observer.disconnect()