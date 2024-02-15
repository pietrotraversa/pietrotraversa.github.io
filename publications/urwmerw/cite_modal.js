// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("cite");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

var bibtexCitation = `@article{traversa2023unbiased,
    title={From unbiased to maximal entropy random walks on hypergraphs},
    author={Traversa, Pietro and de Arruda, Guilherme Ferraz and Moreno, Yamir},
    journal={arXiv preprint arXiv:2306.09499},
    year={2023}
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