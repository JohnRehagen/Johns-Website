const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Set the canvas size to 28x28 pixels
canvas.width = 28;
canvas.height = 28;

// Calculate the scaling factor
const scaleFactor = canvas.clientWidth / canvas.width;

// Scale the canvas content
ctx.scale(scaleFactor, scaleFactor);

// Now you can draw on the canvas with a virtual size of 28x28 pixels
ctx.fillStyle = "white";
ctx.fillRect(0, 0, 28, 28);

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
        return containerWidth * fraction;
    }
    function drawLine(context, x1, y1, x2, y2) {
        context.beginPath();
        context.strokeStyle = 'black';
        context.lineWidth = calculateLineWidth();
        context.lineJoin = "round";
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.closePath();
        context.stroke();
    }
    
    function clearArea() {
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.fillStyle = 'white'; // You can use any color you want
        context.fillRect(0, 0, canvas.width, canvas.height);
        // Clear the input box
        document.getElementById('letterInput').value = '';
    }
    
    // Set the canvas background color to white
    context.fillStyle = 'white'; // You can use any color you want
    context.fillRect(0, 0, canvas.width, canvas.height);