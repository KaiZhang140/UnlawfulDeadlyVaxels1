var elem = document.getElementById("content-iframe");


function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}
function run() {
    
    openFullscreen()
    // Fetch the JSON data and populate the textareas
    $.getJSON('data.json')
        .done(function(data) {
            /*
            var generation = document.getElementById("generation").value || data.length;
            if (generation == -1){
                generation = data.length-1;
            }
            if (generation < 1 || generation > data.length-2) {
                generation = data.length-1;
            }
            */
            // Assuming you want the last object in the array
            const Obj = data[data.length-1];

            // Populate the textareas with the fetched data
            $('#html-content').val(Obj.html);
            $('#css-content').val(Obj.css);
            $('#js-content').val(Obj.javascript);

            // Construct the full content for the iframe
            const fullContent = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Iframe Content</title>
                    <style>
                        ${Obj.css}
                    </style>
                </head>
                <body>
                    ${Obj.html}
                  <script>
                        ${Obj.javascript}
                        window.onerror = function(message, source, lineno, colno, error) {
                            parent.postMessage("Iframe error: " + message + source + lineno);
                            return true; // Prevent the default browser error handling
                        };

                    </script>
                </body>
                </html>
            `;

            // Write the content to the iframe
            const iframe = document.getElementById('content-iframe');
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

            // Clear existing content in the iframe
            iframeDoc.open();
            iframeDoc.write('');
            iframeDoc.close();

            // Write new content to the iframe
            iframeDoc.open();
            iframeDoc.write(fullContent);
            iframeDoc.close();
        })
        .fail(function(jqxhr, textStatus, error) {
            const err = textStatus + ", " + error;
            console.log("Error fetching JSON: " + err);
        });

    // Listen for messages from the iframe
    window.addEventListener('message', function(event) {
        console.log(event.data)
        if (typeof event.data === 'string' && event.data.startsWith('Iframe error:')) {
            console.log(event.data);
            // Optionally, handle the error further (e.g., log it to a server or display it in the UI)
        }
    });
}
