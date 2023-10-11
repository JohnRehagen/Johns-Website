window.addEventListener('load', function () {
    // Get the height of the sidebar
    const sidebar = document.querySelector('.sidebar');
    const sidebarHeight = sidebar.offsetHeight ;

    // Set the margin-top of the content to the height of the sidebar
    const content = document.querySelector('.content');
    if (window.innerWidth <= 768) {
        content.style.marginTop = sidebarHeight + 'px';
    }
});


if (window.innerWidth > 768){
    
    document.addEventListener("DOMContentLoaded", () => {
        const sections = document.querySelectorAll(".section");
        const sidebarLinks = document.querySelectorAll(".sections a");
        const cursorHighlight = document.createElement("div");
        cursorHighlight.className = "cursor-highlight";
        document.body.appendChild(cursorHighlight);

        const viewportHeight = window.innerHeight;
        const offsetPercentage = 20;
        const offset = (viewportHeight * offsetPercentage) / 100;

        /*
        if (window.innerWidth > 768) {
            const viewportHeight = window.innerHeight;
            const offsetPercentage = 20;
            const offset = (viewportHeight * offsetPercentage) / 100;
        }

        if (window.innerWidth <= 768) {
            const sidebar = document.querySelector('.sidebar');
            const offset = sidebar.offsetHeight * 1.1;
        }
        */

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
}

if (window.innerWidth <= 768){
    
    document.addEventListener("DOMContentLoaded", () => {
        const sections = document.querySelectorAll(".section");
        const sidebarLinks = document.querySelectorAll(".sections a");
        const cursorHighlight = document.createElement("div");
        cursorHighlight.className = "cursor-highlight";
        document.body.appendChild(cursorHighlight);

        const sidebar = document.querySelector('.sidebar');
        const offset = sidebar.offsetHeight+50;

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
}