var offset = 0;

// Function to execute code for small screens
function executeCodeForSmallScreens() {
    document.addEventListener("DOMContentLoaded", () => {
        console.log("Executing code for small screens");
        // Get the height of the sidebar
        const sidebar = document.querySelector('.sidebar');
        const sidebarHeight = sidebar.offsetHeight + 50;
        offset = sidebar.offsetHeight + 80 ;
        console.log("Offset for small screens:", offset);

        // Set the margin-top of the content to the height of the sidebar
        const content = document.querySelector('.content');
        content.style.marginTop = sidebarHeight +20+ 'px';

        // Select all elements with a specific class
        const elementsToHide = document.querySelectorAll('.Socials-section');
    
        // Hide those elements by setting their display property to 'none'
        elementsToHide.forEach((element) => {
            element.style.display = 'none';
        });
    });
}

// Function to execute code for larger screens
function executeCodeForLargerScreens() {
    const viewportHeight = window.innerHeight;
    const offsetPercentage = 30;
    offset = (viewportHeight * offsetPercentage) / 100;
    console.log("Offset for larger screens:", offset);
}

let oldWindowWidth = window.innerWidth;

// Function to execute code for lateral resizing
function executeCodeOnLateralResize() {
    const newWindowWidth = window.innerWidth;

    if (newWindowWidth !== oldWindowWidth) {
        console.log("Executing code for lateral resizing");
        // Execute your code for screen width changes
        if (newWindowWidth <= 768) {
            executeCodeForSmallScreens();
        } else {
            executeCodeForLargerScreens();
        }

        // Update the old window width
        oldWindowWidth = newWindowWidth;
    }
}

function initializeScreenSize(){
    if (window.innerWidth <= 768) {
        executeCodeForSmallScreens();
    } else {
        executeCodeForLargerScreens();
    }
}

initializeScreenSize()

// Add an event listener for window resize
window.addEventListener("resize", executeCodeOnLateralResize);

document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(".section");
    const sidebarLinks = document.querySelectorAll(".sections a");
    const cursorHighlight = document.createElement("div");
    cursorHighlight.className = "cursor-highlight";
    document.body.appendChild(cursorHighlight);

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
                const viewportHeight = window.innerHeight;
                const targetOffset = targetSection.offsetTop - (viewportHeight * 0.19);
                window.scrollTo({ top: targetOffset, behavior: "smooth" });
            }
        });
    });
});

const element = document.querySelector('.content a');
    element.addEventListener('touchstart', function() {
        // Handle the touch event (e.g., apply styles)
        element.classList.add('hovered');
    });
    element.addEventListener('touchend', function() {
        // Handle when the touch ends (e.g., remove styles)
        element.classList.remove('hovered');
    });

const element1 = document.querySelector('.resume-block');
    element.addEventListener('touchstart', function() {
        // Handle the touch event (e.g., apply styles)
        element1.classList.add('hovered');
    });
    element.addEventListener('touchend', function() {
        // Handle when the touch ends (e.g., remove styles)
        element1.classList.remove('hovered');
    });

document.addEventListener('DOMContentLoaded', function () {
    const resumeBlocks = document.querySelectorAll('.resume-block');

    resumeBlocks.forEach(function (block) {
        block.addEventListener('touchstart', function () {
            // Handle the touch event by adding the class
            block.classList.add('touched');
        });

        block.addEventListener('touchend', function () {
            // Handle when the touch event ends by removing the class
            block.classList.remove('touched');
        });
    });
});

function showHidden(element) {
    var hiddenElement = element.querySelector('.hidden');
    hiddenElement.style.display = 'block';
}

function hideHidden(element) {
    var hiddenElement = element.querySelector('.hidden');
    hiddenElement.style.display = 'none';
}