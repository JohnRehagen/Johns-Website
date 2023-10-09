document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(".section");
    const sidebarLinks = document.querySelectorAll(".sections a");
    const cursorHighlight = document.createElement("div");
    cursorHighlight.className = "cursor-highlight";
    document.body.appendChild(cursorHighlight);

    const viewportHeight = window.innerHeight;
    const offsetPercentage = 20;
    const offset = (viewportHeight * offsetPercentage) / 100;

    // Function to highlight the active section in the sidebar and change text color
    function highlightActiveSection() {
        const scrollPosition = window.scrollY;

        // Determine which section is currently in view
        let activeSection = null;

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - offset;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                activeSection = section;
            }
        });

        // Remove any existing highlighting
        sidebarLinks.forEach((link) => {
            link.classList.remove("active");
        });

        // Highlight the active section in the sidebar and change text color
        if (activeSection) {
            const activeLinkId = activeSection.getAttribute("id");
            sidebarLinks.forEach((link) => {
                if (link.getAttribute("href").substring(1) === activeLinkId) {
                    link.classList.add("active");
                }
            });
        }
    }

    // Function to update cursor highlight
    function updateCursorBackground(e) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        cursorHighlight.style.left = `${mouseX}px`;
        cursorHighlight.style.top = `${mouseY}px`;
    }

    // Function to handle scroll events and prevent scrolling of the cursor highlight
    function handleScroll(e) {
        e.preventDefault();
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        cursorHighlight.style.left = `${mouseX}px`;
        cursorHighlight.style.top = `${mouseY}px`;
    }

    // Listen for scroll events to highlight the active section
    window.addEventListener("scroll", () => {
        highlightActiveSection();
    });

    // Add event listener for mousemove to update cursor position
    document.addEventListener("mousemove", updateCursorBackground);

    // Add event listener for scroll to prevent scrolling of cursor highlight
    document.addEventListener("scroll", handleScroll);

    // Initial highlight when the page loads
    highlightActiveSection();

    // Add smooth scrolling behavior to section links
    // Modify the JavaScript code to exclude links with a specific class
    const sectionLinks = document.querySelectorAll(".sections a:not(.external-link)");

    sectionLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("href").substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                const targetOffset = targetSection.offsetTop - (viewportHeight * 0.19);
                window.scrollTo({ top: targetOffset, behavior: "smooth" });
            }
        });
    });
});

// When true, moving the mouse draws on the canvas
let isDrawing = false;
let x = 0;
let y = 0;

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

function resizeCanvas() {
    // Get references to the canvas and its container
    const canvas = document.getElementById("canvas");
    const canvasContainer = document.getElementById("canvas_div");

    // Get the container's width
    const containerWidth = canvasContainer.clientWidth;

    // Calculate the scaling factor for the display size
    const scaleFactor = containerWidth * 0.8 / 28;

    // Set the canvas dimensions for the drawing buffer (fixed at 28x28)
    //canvas.width = 28;
    //canvas.height = 28;

    // Set the canvas display size based on the container width
    canvas.width = containerWidth * 0.8 ;
    canvas.height = containerWidth * 0.8 ;

    // Get the 2D rendering context
    const context = canvas.getContext("2d");

    // Scale the canvas content for drawing
    context.scale(scaleFactor, scaleFactor);

    // Now you can draw on the canvas with a drawing buffer size of 28x28 pixels
    context.fillStyle = "white";
    context.fillRect(0, 0, 28, 28);
}

// Call the resizeCanvas function initially and when the window is resized
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// event.offsetX, event.offsetY gives the (x,y) offset from the edge of the canvas.

// Add the event listeners for mousedown, mousemove, and mouseup
canvas.addEventListener('mousedown', (e) => {
    x = e.offsetX;
    y = e.offsetY;
    isDrawing = true;
});

canvas.addEventListener('mousemove', (e) => {
    if (isDrawing) {
        drawLine(context, x, y, e.offsetX, e.offsetY);
        x = e.offsetX;
        y = e.offsetY;
    }
});

canvas.addEventListener('mouseup', (e) => {
    if (isDrawing) {
        drawLine(context, x, y, e.offsetX, e.offsetY);
        x = 0;
        y = 0;
        isDrawing = false;
    }
});

// Function to calculate line width based on container's width


function calculateLineWidth() {
    const containerWidth = document.getElementById('canvas_div').clientWidth;
    const fraction = 1 / 14;
    return 1;
}

function drawLine(context, x1, y1, x2, y2) {
    context.beginPath();
    context.strokeStyle = 'black';
    context.lineWidth = calculateLineWidth(canvas); // Pass the container's width
    context.lineJoin = "round";
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.closePath();
    context.stroke();
}

function clearArea() {
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.fillStyle = 'white'; // You can use asny color you want
    context.fillRect(0, 0, canvas.width, canvas.height);
    // Clear the input box
    document.getElementById('letterInput').value = '';
}

// Set the canvas background color to white
context.fillStyle = 'white'; // You can use any color you want
context.fillRect(0, 0, canvas.width, canvas.height);



async function prepareImageForMNIST() {
    const letterInput = document.getElementById('letterInput').value.trim();

    if (letterInput.length === 1) {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        // Get the current canvas data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Invert the colors of the image
        for (let i = 0; i < imageData.data.length; i += 4) {
            // imageData.data contains RGBA values (4 channels per pixel)
            // Invert each channel (R, G, B) individually
            imageData.data[i] = 255 - imageData.data[i];     // Red channel
            imageData.data[i + 1] = 255 - imageData.data[i + 1]; // Green channel
            imageData.data[i + 2] = 255 - imageData.data[i + 2]; // Blue channel
            // Alpha channel (transparency) remains unchanged
        }

        // Put the modified imageData back to the canvas
        ctx.putImageData(imageData, 0, 0);

        // Resize the canvas to 28x28 pixels
        const resizedCanvas = document.createElement('canvas');
        resizedCanvas.width = 28;
        resizedCanvas.height = 28;
        const resizedCtx = resizedCanvas.getContext('2d');
        resizedCtx.drawImage(canvas, 0, 0, 20, 20);

        // Convert the resized canvas to a Blob
        const blob = await new Promise((resolve) => {
            resizedCanvas.toBlob((b) => resolve(b), 'image/png');
        });

        // Create a URL for the Blob
        const blobURL = URL.createObjectURL(blob);

        // Create an invisible <a> element for downloading
        const downloadLink = document.createElement('a');
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);

        // Set the href of the <a> element to the Blob URL
        downloadLink.href = blobURL;
        downloadLink.download = `${letterInput}.png`; // Set the file name

        try {
            // Load a pre-trained MNIST model
            const model = await tf.loadLayersModel('https://s3.us-east-2.amazonaws.com/www.johnrehagen.com/tfjs_model0/model.json');
            console.log('Model loaded successfully', model);

            // Remove the extra dimension from the input tensor
            const inputImage = tf.browser.fromPixels(resizedCanvas, 1); // Convert image to tensor
            const reshapedInput = inputImage.div(255); // Normalize the tensor
            const finalInput = reshapedInput.squeeze().reshape([1, 28, 28]); // Reshape the tensor

            // Make a prediction
            const prediction = model.predict(finalInput);

            // Get the predicted digit (index with the highest probability)
            const predictedDigit = tf.argMax(prediction, axis = 1).dataSync()[0];

            // Display the predicted digit in the predictionContainer
            const predictionContainer = document.getElementById('predictionContainer');
            predictionContainer.textContent = `Predicted Digit: ${predictedDigit}`;

            // Trigger the download by simulating a click on the <a> element
            downloadLink.click();
        } catch (error) {
            // Handle the error
            console.error('Error loading or predicting with the model:', error);
        } finally {
            // Remove the <a> element and revoke the Blob URL after download
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(blobURL);
        }
    } else {
        alert('Please enter a single letter in the input box.');
    }
}

