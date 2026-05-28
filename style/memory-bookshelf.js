document.addEventListener("DOMContentLoaded", () => {
    
    // Mảng Data chuẩn xác 26 học sinh (Không chứa GVCN, không trùng lặp)
    const folderNames = [
        "Đông Quân", "Bình Minh", "Bảo Nam", "Bảo Ngân", "Bảo Uyên", 
        "Chí Thành", "Cát Hồng", "Gia Bảo", "Gia Huy", "Hoàng Anh", 
        "Hoàng Cung", "Huỳnh Quỳnh", "Khánh Châu", "Khánh Huyền", 
        "Khải Hoàn", "Minh Anh", "Minh Khôi", "Nhật Hoàn", "Nhật Quang", 
        "Phương Linh", "Quang Chánh", "Song Thư", "Thành Nhân", 
        "Thảo Nguyên", "Tường An", "Xuân Trọng"
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
    let isBookLoading = false;
    let currentStreamId = 0; // Chìa khóa chống Race Condition

    const getPastelColor = (index) => {
        const hues = [210, 35, 10, 160, 280, 50, 320]; 
        return `hsl(${hues[index % hues.length]}, 40%, 65%)`;
    };

    if (bookshelfGrid) {
        folderNames.forEach((folderName, index) => {
            const spine = document.createElement("div");
            spine.className = "book-spine animate-up";
            spine.style.animationDelay = `${(index % 10) * 0.1}s`; 
            spine.style.backgroundColor = getPastelColor(index);
            spine.innerHTML = `<span class="spine-text">${folderName}</span>`;
            
            // ⚡ HOVER INTENT: Kích hoạt tải vào bộ nhớ đệm (Cache) 4 ảnh đầu khi di chuột
            spine.addEventListener("mouseenter", () => {
                if (!spine.dataset.preloaded) {
                    spine.dataset.preloaded = "true";
                    for (let i = 1; i <= 4; i++) {
                        const img = new Image();
                        img.src = `style/img/Bookmember/${folderName}/Anh (${i}).webp`;
                    }
                }
            });

            spine.addEventListener("click", () => openBook(folderName));
            bookshelfGrid.appendChild(spine);
        });
    }

    async function openBook(folderName) {
        if (isBookLoading) return;
        isBookLoading = true;
        
        currentStreamId++; // Tạo ID mới để cắt đứt các luồng tải sách cũ (nếu có)
        const myStreamId = currentStreamId; 
        
        bookModal.classList.add("modal-active");
        bookScene.style.display = "none";
        bookControls.style.display = "none";
        bookLoader.style.display = "block";
        document.body.style.overflow = "hidden";

        flipbookWrapper.innerHTML = ''; 
        pagesDOM = [];
        currentPage = 0;
        totalPages = 0;

        const folderPath = `style/img/Bookmember/${folderName}`;
        
        // BƯỚC 1: Dò tìm đồng thời 4 ảnh đầu tiên (Nhanh x4 lần)
        let initialPromises = [];
        for (let i = 1; i <= 4; i++) {
            initialPromises.push(checkImageExistence(`${folderPath}/Anh (${i}).webp`));
        }
        
        const initialResults = await Promise.all(initialPromises);
        let has404 = false;
        
        for (let res of initialResults) {
            if (res.exists) {
                appendPageToBook(res.url, folderName);
            } else {
                has404 = true;
                break;
            }
        }

        if (totalPages === 0) {
            appendPageToBook('https://i.postimg.cc/P5nMWJnM/Logo.png', folderName);
        }

        bookLoader.style.display = "none";
        bookScene.style.display = "flex";
        bookControls.style.display = "flex";
        isBookLoading = false;

        // BƯỚC 2: STREAMING NGẦM (Tải dần số ảnh còn lại khi user đang xem 4 trang đầu)
        if (!has404) {
            streamRemainingImages(folderPath, folderName, 5, myStreamId);
        }
    }

    function checkImageExistence(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve({ exists: true, url: url });
            img.onerror = () => resolve({ exists: false, url: url });
            img.src = url;
        });
    }

    // Engine đa luồng tải ngầm ảnh không gây giật lag
    async function streamRemainingImages(folderPath, studentName, startIndex, streamId) {
        let i = startIndex;
        let keepGoing = true;
        
        while (keepGoing && currentStreamId === streamId) {
            // Tải Batch 3 hình / mẻ
            let batch = [];
            for (let j = 0; j < 3; j++) {
                batch.push(checkImageExistence(`${folderPath}/Anh (${i + j}).webp`));
            }
            const results = await Promise.all(batch);
            
            for (let res of results) {
                if (currentStreamId !== streamId) return; // Nếu đổi sách, hủy luồng ngay lập tức
                if (res.exists) {
                    appendPageToBook(res.url, studentName);
                } else {
                    keepGoing = false;
                    break;
                }
            }
            i += 3;
        }
    }

    // Cơ chế động: Cứ nạp được 1 ảnh vào là tái cấu trúc Z-index ngay
    function appendPageToBook(imgSrc, studentName) {
        const index = totalPages;
        totalPages++;
        
        const page = document.createElement("div");
        page.className = "book-page";
        
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
                    <p>"Thanh xuân của chúng ta cất gọn trong ngăn bàn đầy bụi phấn. Những kỷ niệm này sẽ sống mãi."</p>
                    <span style="display:block; margin-top:20px; font-size:1.2rem; font-family:'Inter', sans-serif;">- ${studentName} -</span>
                </div>
            </div>
        `;
        
        page.addEventListener("click", () => {
            if (page.classList.contains("page-flipped")) flipPage(-1);
            else flipPage(1);
        });

        // Tính toán lại tọa độ lớp (Z) của tất cả các trang nằm im
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
        currentStreamId++; // Vô hiệu hóa luồng tải ngầm hiện tại
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
