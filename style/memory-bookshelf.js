document.addEventListener("DOMContentLoaded", () => {
    
    // BLUEPRINT TĨNH
    const libraryBlueprint = [
        [
            { type: "book", name: "Đông Quân", folder: "DonQuaan", style: 1, post: "upright" },
            { type: "book", name: "Bình Minh", style: 2, post: "lean-left" },
            { type: "stack", items: [
                { name: "Bảo Nam", style: 3 },
                { name: "Bảo Ngân", style: 4 }
            ]},
            { type: "book", name: "Bảo Uyên", style: 5, post: "upright" },
            { type: "book", name: "Chí Thành", style: 6, post: "lean-right" },
            { type: "book", name: "Cát Hồng", style: 7, post: "upright" },
            { type: "stack", items: [
                { name: "Gia Bảo", style: 8 },
                { name: "Gia Huy", style: 9 }
            ]},
            { type: "book", name: "Hoàng Anh", style: 10, post: "lean-left" }
        ],
        [
            { type: "book", name: "Hoàng Cung", style: 5, post: "upright" },
            { type: "book", name: "Huỳnh Quỳnh", style: 1, post: "lean-right" },
            { type: "book", name: "Khánh Châu", style: 2, post: "upright" },
            { type: "stack", items: [
                { name: "Khánh Huyền", style: 3 },
                { name: "Khải Hoàn", style: 4 }
            ]},
            { type: "book", name: "Minh Anh", style: 6, post: "lean-left" },
            { type: "book", name: "Minh Khôi", style: 7, post: "upright" },
            { type: "book", name: "Nhật Hoàn", style: 8, post: "lean-right" },
            { type: "book", name: "Nhật Quang", style: 9, post: "upright" }
        ],
        [
            { type: "stack", items: [
                { name: "Phương Linh", style: 10 },
                { name: "Quang Chánh", style: 1 }
            ]},
            { type: "book", name: "Song Thư", style: 2, post: "lean-left" },
            { type: "book", name: "Thành Nhân", style: 3, post: "upright" },
            { type: "book", name: "Thảo Nguyên", style: 4, post: "upright" },
            { type: "book", name: "Tường An", style: 5, post: "lean-right" },
            { type: "book", name: "Xuân Trọng", style: 6, post: "upright" }
        ]
    ];

    const bookshelfGrid = document.getElementById("bookshelfGrid");
    const bookModal = document.getElementById("bookModal");
    const closeBookBtn = document.getElementById("closeBookBtn");
    const flipbookWrapper = document.getElementById("flipbookWrapper");
    const bookLoader = document.getElementById("bookLoader");
    const bookScene = document.getElementById("bookScene");
    const bookControls = document.getElementById("bookControls");
    const pageIndicator = document.getElementById("pageIndicator");
    
    let currentPage = 0;
    let totalPages = 0;
    let pagesDOM = [];
    
    const memoryCache = {}; 
    let currentlyViewing = null; 

    // FALLBACK QUOTE (Chống sập giao diện nếu Quote.txt chưa kịp tải hoặc lỗi)
    let quoteList = [
        "Thanh xuân của chúng ta cất gọn trong ngăn bàn đầy bụi phấn. Những kỷ niệm này sẽ sống mãi."
    ];

    // ENGINE FETCH FILE QUOTE.TXT
    async function loadQuotesFromFile() {
        try {
            const response = await fetch('style/Quote.txt');
            if (!response.ok) return; // Bỏ qua nếu không tìm thấy file
            
            const text = await response.text();
            // Regex hỗ trợ bắt mọi loại ngoặc kép (" ", “ ”) và lọc các dòng trống
            const parsedQuotes = [];
            const lines = text.split(/\r?\n/);
            
            lines.forEach(line => {
                const trimmed = line.trim();
                const match = trimmed.match(/^-\s*["“”](.*)["“”]$/);
                if (match && match[1]) {
                    parsedQuotes.push(match[1]);
                }
            });

            if (parsedQuotes.length > 0) {
                quoteList = parsedQuotes; // Đè mảng mặc định bằng dữ liệu từ File
            }
        } catch (error) {
            console.warn("Chưa tải được Quote.txt, sử dụng Quote mặc định.");
        }
    }

    // Hàm random trích dẫn
    function getRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quoteList.length);
        return quoteList[randomIndex];
    }

    libraryBlueprint.forEach(row => {
        row.forEach(item => {
            if (item.type === "book") {
                memoryCache[item.name] = { folder: item.folder || item.name, images: [], finished: false, pattern: "Anh ($).webp" };
            }
            if (item.type === "stack") {
                item.items.forEach(b => {
                    memoryCache[b.name] = { folder: b.folder || b.name, images: [], finished: false, pattern: "Anh ($).webp" };
                });
            }
        });
    });

    function createBookElement(name, styleNum, posture) {
        const spine = document.createElement("div");
        spine.className = `book-spine style-${styleNum} posture-${posture}`;
        spine.innerHTML = `
            <span class="spine-hover-label">${name}</span>
            <span class="spine-text">${name}</span>
        `;
        spine.addEventListener("click", () => openBook(name));
        return spine;
    }

    // KHỞI TẠO ĐỒNG THỜI KỆ SÁCH & TẢI QUOTE
    if (bookshelfGrid) {
        bookshelfGrid.innerHTML = ''; 
        loadQuotesFromFile(); // Kích hoạt Fetch txt ngay lập tức
        
        libraryBlueprint.forEach(row => {
            const shelfRow = document.createElement("div");
            shelfRow.className = "shelf-row";

            row.forEach(item => {
                if (item.type === "book") {
                    shelfRow.appendChild(createBookElement(item.name, item.style, item.post));
                } else if (item.type === "stack") {
                    const stack = document.createElement("div");
                    stack.className = "book-stack";
                    item.items.forEach(b => stack.appendChild(createBookElement(b.name, b.style, 'horizontal')));
                    shelfRow.appendChild(stack);
                }
            });

            const board = document.createElement("div");
            board.className = "shelf-board-row";
            shelfRow.appendChild(board);
            bookshelfGrid.appendChild(shelfRow);
        });

        setTimeout(startGlobalPreload, 3000); 
    }

    function checkImageExistence(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve({ exists: true, url: url });
            img.onerror = () => resolve({ exists: false, url: url });
            img.src = url;
        });
    }

    async function fetchNextImage(name) {
        const cache = memoryCache[name];
        if (cache.finished) return false;
        
        const index = cache.images.length + 1;
        const targetFolder = cache.folder; 
        
        if (index === 1) {
            const patterns = [
                "Anh ($).webp",
                "Anh($).webp",
                "Anh ($).jpg",
                "anh ($).webp",
                "Anh ($).png"
            ];
            for (let p of patterns) {
                const url = `style/img/Bookmember/${targetFolder}/${p.replace('$', index)}`;
                const res = await checkImageExistence(url);
                if (res.exists) {
                    cache.pattern = p; 
                    cache.images.push(res.url);
                    return true;
                }
            }
            cache.finished = true;
            return false;
        } 
        
        const url = `style/img/Bookmember/${targetFolder}/${cache.pattern.replace('$', index)}`;
        const res = await checkImageExistence(url);
        if (res.exists) {
            cache.images.push(res.url);
            return true;
        } else {
            cache.finished = true;
            return false;
        }
    }

    async function startGlobalPreload() {
        const studentNames = Object.keys(memoryCache);
        for (let name of studentNames) {
            while (!memoryCache[name].finished) {
                if (currentlyViewing !== null && currentlyViewing !== name) break; 
                await fetchNextImage(name);
            }
        }
    }

    async function openBook(studentName) {
        currentlyViewing = studentName; 
        
        bookModal.classList.add("modal-active");
        bookScene.style.display = "none";
        bookControls.style.display = "none";
        bookLoader.style.display = "block";
        document.body.style.overflow = "hidden";

        flipbookWrapper.innerHTML = ''; 
        pagesDOM = [];
        currentPage = 0;
        totalPages = 0;

        if (memoryCache[studentName].images.length > 0) {
            memoryCache[studentName].images.forEach(imgUrl => {
                appendPage(imgUrl, studentName);
            });
            hideLoader();
        }

        while (!memoryCache[studentName].finished) {
            const success = await fetchNextImage(studentName);
            
            if (currentlyViewing !== studentName) return; 

            if (success) {
                const latestImg = memoryCache[studentName].images[memoryCache[studentName].images.length - 1];
                appendPage(latestImg, studentName);
                if (totalPages === 1) hideLoader(); 
            }
        }

        if (totalPages === 0) {
            appendPage('https://i.postimg.cc/P5nMWJnM/Logo.png', studentName);
            hideLoader();
        }
    }

    function hideLoader() {
        bookLoader.style.display = "none";
        bookScene.style.display = "flex";
        bookControls.style.display = "flex";
    }

    function appendPage(imgSrc, studentName) {
        if (currentlyViewing !== studentName) return; 

        const index = totalPages;
        totalPages++;
        
        const page = document.createElement("div");
        page.className = "book-page";
        
        // Random 1 câu Quote từ mảng đã load
        const randomQuote = getRandomQuote();
        
        page.innerHTML = `
            <div class="page-front">
                <div class="page-content">
                    <div class="polaroid">
                        <img src="${imgSrc}" loading="lazy" alt="${studentName}">
                    </div>
                </div>
            </div>
            <div class="page-back">
                <div class="page-content quote-page">
                    <p>"${randomQuote}"</p>
                    <span style="display:block; margin-top:20px; font-size:1.2rem; font-family:'Inter', sans-serif;">- ${studentName} -</span>
                </div>
            </div>
        `;
        
        page.addEventListener("click", () => {
            if (page.classList.contains("page-flipped")) flipPage(-1);
            else flipPage(1);
        });

        pagesDOM.forEach((p, idx) => {
            if (!p.classList.contains("page-flipped")) {
                p.style.zIndex = totalPages - idx;
            }
        });
        page.style.zIndex = totalPages - index;

        flipbookWrapper.appendChild(page);
        pagesDOM.push(page);
        updateBookUI();
    }

    function flipPage(direction) {
        if (direction === 1 && currentPage < totalPages) {
            pagesDOM[currentPage].classList.add("page-flipped");
            pagesDOM[currentPage].style.zIndex = currentPage + 1; 
            currentPage++;
        } else if (direction === -1 && currentPage > 0) {
            currentPage--;
            pagesDOM[currentPage].classList.remove("page-flipped");
            pagesDOM[currentPage].style.zIndex = totalPages - currentPage;
        }
        updateBookUI();
    }

    function updateBookUI() {
        pageIndicator.innerText = `${currentPage} / ${totalPages}`;
        if (window.innerWidth > 768) {
            flipbookWrapper.style.transform = currentPage > 0 ? "translateX(50%)" : "translateX(0)";
        }
    }

    document.getElementById("bookNext")?.addEventListener("click", () => flipPage(1));
    document.getElementById("bookPrev")?.addEventListener("click", () => flipPage(-1));
    
    closeBookBtn?.addEventListener("click", () => {
        currentlyViewing = null; 
        bookModal.classList.remove("modal-active");
        document.body.style.overflow = "auto";
        flipbookWrapper.innerHTML = ''; 
    });

    window.addEventListener("keydown", (e) => {
        if (bookModal.classList.contains("modal-active")) {
            if (e.key === "ArrowRight") flipPage(1);
            if (e.key === "ArrowLeft") flipPage(-1);
            if (e.key === "Escape") closeBookBtn.click();
        }
    });
});
