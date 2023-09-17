document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(".section");
    const sidebarLinks = document.querySelectorAll(".sections a");

    const viewportHeight = window.innerHeight;
    const offsetPercentage = 20;
    const offset = (viewportHeight * offsetPercentage) / 100;

    // Function to highlight the active section in the sidebar and change text color
    function highlightActiveSection() {
        const scrollPosition = window.scrollY;

        // Determine which section is currently in view
        let activeSection = null;

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - offset; // Adjust the offset as needed
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

    // Listen for scroll events to highlight the active section
    window.addEventListener("scroll", () => {
        highlightActiveSection();
    });

    // Initial highlight when the page loads
    highlightActiveSection();

   // Create a cursor highlight element
    const cursorHighlight = document.createElement("div");
    cursorHighlight.className = "cursor-highlight";
    document.body.appendChild(cursorHighlight);

    // Function to update cursor highlight
    function updateCursorBackground(e) {
        const mouseX = e.clientX;
        const mouseY = e.clientY; // Note: We don't need to consider the scroll position

        // Set the position of the cursor highlight
    cursorHighlight.style.left = `${mouseX}px`;
    cursorHighlight.style.top = `${mouseY}px`;
    }

    // Add event listener for mousemove to update cursor position
    document.addEventListener("mousemove", updateCursorBackground);

    // Function to handle scroll events and prevent scrolling of the cursor highlight
    function handleScroll(e) {
        e.preventDefault();
    }

    // Add event listener for scroll to prevent scrolling of cursor highlight
    document.addEventListener("scroll", handleScroll);

    // Set the position of the cursor highlight
    cursorHighlight.style.left = `${mouseX}px`;
    cursorHighlight.style.top = `${mouseY}px`;
});

document.addEventListener("DOMContentLoaded", () => {
    // Add smooth scrolling behavior to section links
    const sectionLinks = document.querySelectorAll(".sections a");
    
    sectionLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault(); // Prevent the default jump-to-anchor behavior

            const targetId = link.getAttribute("href").substring(1); // Get the target section id
            const targetSection = document.getElementById(targetId); // Get the target section element
            if (targetSection) {
                const targetOffset = targetSection.offsetTop - (window.innerHeight * 0.19); // Calculate the target offset
                window.scrollTo({ top: targetOffset, behavior: "smooth" }); // Scroll smoothly to the target
            }
        });
    });
});