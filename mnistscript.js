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
clearArea();

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
    const fraction = 1 / 30 * containerWidth;
    return fraction;
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
    const context = document.getElementById('canvas').getContext('2d');
    
    // Clear the canvas
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.fillStyle = 'white';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    // Clear the input box
    document.getElementById('letterInput').value = '';

    // Clear the displayed images
    const imageElements = document.querySelectorAll('#imageContainer img');
    for (const img of imageElements) {
        img.style.display = 'none';
    }    

    predictionContainer.textContent = `Predicted Digit:`;
}

// Set the canvas background color to white
context.fillStyle = 'white'; // You can use any color you want
context.fillRect(0, 0, canvas.width, canvas.height);

let predictedDigit = '';

async function prepareImageForMNIST() {
    const letterInput = document.getElementById('letterInput').value.trim();

    if (letterInput.length === 1) {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        // Get the current canvas data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const width = canvas.width;
        const height = canvas.height;

        // FIND TOP CROP
        let imgTop = 0;
        // Loop through rows, starting at the top and defining imgTop once a pixel is not white
        for (let y = 0; y < height; y++) {
            // Loop through the pixels in the current row
            let rowHasNonWhitePixel = false;
            for (let x = 0; x < width; x++) {
                // Get the pixel data for the current pixel
                const pixelData = ctx.getImageData(x, y, 1, 1).data;

                // Check if the pixel is not white
                if (pixelData[0] !== 255 || pixelData[1] !== 255 || pixelData[2] !== 255) {
                    // Log the row value and break the loop
                    imgTop = y;
                    rowHasNonWhitePixel = true;
                    break;
                }
            }

            // If a non-white pixel is found in this row, exit the row loop
            if (rowHasNonWhitePixel) {
                break;
            }
        }

        // FIND BOTTOM CROP
        let imgBottom = height;
        // Loop through rows, starting at the bottom and defining imgBottom once a pixel is not white
        for (let y = height - 1; y >= 0; y--) {
            // Loop through the pixels in the current row
            let rowHasNonWhitePixel = false;
            for (let x = 0; x < width; x++) {
                // Get the pixel data for the current pixel
                const pixelData = ctx.getImageData(x, y, 1, 1).data;

                // Check if the pixel is not white
                if (pixelData[0] !== 255 || pixelData[1] !== 255 || pixelData[2] !== 255) {
                    // Log the row value and break the loop
                    imgBottom = y;
                    rowHasNonWhitePixel = true;
                    break;
                }
            }

            // If a non-white pixel is found in this row, exit the row loop
            if (rowHasNonWhitePixel) {
                break;
            }
        }

        // FIND LEFT CROP
        let imgLeft = 0;
        // Loop through columns, starting from the left and defining imgLeft once a pixel is not white
        for (let x = 0; x < width; x++) {
            // Loop through the pixels in the current column
            let columnHasNonWhitePixel = false;
            for (let y = 0; y < height; y++) {
                // Get the pixel data for the current pixel
                const pixelData = ctx.getImageData(x, y, 1, 1).data;

                // Check if the pixel is not white
                if (pixelData[0] !== 255 || pixelData[1] !== 255 || pixelData[2] !== 255) {
                    // Log the column value and break the loop
                    imgLeft = x;
                    columnHasNonWhitePixel = true;
                    break;
                }
            }

            // If a non-white pixel is found in this column, exit the column loop
            if (columnHasNonWhitePixel) {
                break;
            }
        }

        // FIND RIGHT CROP
        let imgRight = width;
        // Loop through columns, starting from the right and defining imgRight once a pixel is not white
        for (let x = width - 1; x >= 0; x--) {
            // Loop through the pixels in the current column
            let columnHasNonWhitePixel = false;
            for (let y = 0; y < height; y++) {
                // Get the pixel data for the current pixel
                const pixelData = ctx.getImageData(x, y, 1, 1).data;

                // Check if the pixel is not white
                if (pixelData[0] !== 255 || pixelData[1] !== 255 || pixelData[2] !== 255) {
                    // Log the column value and break the loop
                    imgRight = x;
                    columnHasNonWhitePixel = true;
                    break;
                }
            }

            // If a non-white pixel is found in this column, exit the column loop
            if (columnHasNonWhitePixel) {
                break;
            }
        }

        const croppedCanvas = document.createElement('canvas');
        const croppedCtx = croppedCanvas.getContext('2d');
        croppedCanvas.width = imgRight - imgLeft;
        croppedCanvas.height = imgBottom - imgTop;

        croppedCtx.drawImage(canvas, imgLeft, imgTop, imgRight - imgLeft, imgBottom - imgTop, 0, 0, imgRight - imgLeft, imgBottom - imgTop);
        // Convert the cropped canvas to a data URL
        const croppedDataURL = croppedCanvas.toDataURL("image/png");

        
        // Create an invisible <a> element for downloading
        const downloadLink1 = document.createElement('a');
        downloadLink1.style.display = 'none';
        document.body.appendChild(downloadLink1);

        // Set the href of the <a> element to the data URL
        downloadLink1.href = croppedDataURL;
        downloadLink1.download = `${letterInput}.png`; // Set the file name

        // Trigger a click event to initiate the download
        //downloadLink1.click();
        

        // Create a new 20x20 canvas
        const resizedCanvas = document.createElement('canvas');
        const resizedCtx = resizedCanvas.getContext('2d');
        resizedCanvas.width = 20;
        resizedCanvas.height = 20;

        // Draw the cropped image onto the 20x20 canvas, scaling it down
        resizedCtx.drawImage(croppedCanvas, 0, 0, croppedCanvas.width, croppedCanvas.height, 0, 0, 20, 20);

        // Create a new 28x28 canvas
        const finalCanvas = document.createElement('canvas');
        const finalCtx = finalCanvas.getContext('2d');
        finalCanvas.width = 28;
        finalCanvas.height = 28;

        // Calculate offsets for centering the 20x20 canvas
        const xOffset = (28 - 20) / 2;
        const yOffset = (28 - 20) / 2;

        // Draw the 20x20 canvas onto the 28x28 canvas
        finalCtx.fillStyle = 'white'; // Set the border to white
        finalCtx.fillRect(0, 0, 28, 28); // Fill the canvas with white
        finalCtx.drawImage(resizedCanvas, xOffset, yOffset);

        // Convert the final canvas to a data URL
        const finalDataURL = finalCanvas.toDataURL("image/png");

        // Create an invisible <a> element for downloading
        const downloadLink = document.createElement('a');
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);

        // Set the href of the <a> element to the data URL
        downloadLink.href = finalDataURL;
        downloadLink.download = `${letterInput}_final.png`; // Set the file name

        // Trigger a click event to initiate the download
        //downloadLink.click();

        
        // Convert the resized canvas to a data URL
        const resizedDataURL = resizedCanvas.toDataURL("image/png");

        // Create an invisible <a> element for downloading
        const downloadLink3 = document.createElement('a');
        downloadLink3.style.display = 'none';
        document.body.appendChild(downloadLink3);

        // Set the href of the <a> element to the data URL
        downloadLink3.href = resizedDataURL;
        downloadLink3.download = `${letterInput}_resized.png`; // Set the file name

        // Trigger a click event to initiate the download
        //downloadLink3.click();

        croppedImage.src = croppedDataURL;
        resizedImage.src = resizedDataURL;
        finalImage.src = finalDataURL;

        // Make the images visible
        croppedImage.style.display = 'inline';
        resizedImage.style.display = 'inline';
        finalImage.style.display = 'inline';

        try {
            // Load a pre-trained MNIST model
            const model = await tf.loadLayersModel('https://s3.us-east-2.amazonaws.com/www.johnrehagen.com/tfjs_model0/model.json');
            console.log('Model loaded successfully', model);

            // Remove the extra dimension from the input tensor
            const inputImage = tf.browser.fromPixels(finalCanvas, 1); // Convert image to tensor
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
            //downloadLink.click();
        } catch (error) {
            // Handle the error
            console.error('Error loading or predicting with the model:', error);
        }
    } else {
        alert('Please enter a single letter in the input box.');
    }
}

