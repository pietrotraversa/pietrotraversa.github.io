// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("cite");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

var bibtexCitation = `@article{YIN2025113061,
  title = {Sample-specific network analysis identifies gene co-expression patterns of immunotherapy response in clear cell renal cell carcinoma},
  journal = {iScience},
  pages = {113061},
  year = {2025},
  issn = {2589-0042},
  doi = {https://doi.org/10.1016/j.isci.2025.113061},
  author = {Liangwei Yin and Pietro Traversa and Mohamed Elati and Yamir Moreno and Natalia Marek-Trzonkowska and Christophe Battail},
  keywords = {Sample-specific gene network, Gene co-expression pattern, Network marker, Immunotherapy response, Clear cell renal cell carcinoma}
}`

// When the user clicks the button, open the modal 
btn.onclick = function() {
    document.getElementById('bibtex-content').textContent = bibtexCitation;
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Get the "Copy to Clipboard" button
var copyButton = document.getElementById("copy-button");

// When the user clicks the button, copy the text to the clipboard
copyButton.onclick = function() {
    var textToCopy = document.getElementById('bibtex-content').textContent;
    navigator.clipboard.writeText(textToCopy).then(function() {
        console.log('Copying to clipboard was successful!');
        copyButton.innerText = "Copied!"; // Change the button text to "Copied!"
        setTimeout(function() {
            copyButton.innerText = "Copy to Clipboard"; // Change it back after 3 seconds
        }, 3000);
    }, function(err) {
        console.error('Could not copy text: ', err);
    });
}