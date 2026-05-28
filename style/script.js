document.addEventListener("DOMContentLoaded", () => {
    
    // Mảng Data chuẩn xác 26 thư mục (Loại bỏ các bản lặp trùng lặp)
    const folderNames = [
        "Đông Quân", "Bình Minh", "Bảo Nam", "Bảo Ngân", "Bảo Uyên", 
        "Chí Thành", "Cát Hồng", "Gia Bảo", "Gia Huy", "Hoàng Anh", 
        "Hoàng Cung", "Huỳnh Quỳnh", "Khánh Châu", "Khánh Huyền", 
        "Khải Hoàn", "Minh Anh", "Minh Khôi", "Nhật Hoàn", "Nhật Quang", 
        "Phương Linh", "Quang Chánh", "Song Thư", "Thành Nhân", 
        "Thảo Nguyên ", "Tường An", "Xuân Trọng"
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

    // Bảng màu Pastel cho 26 cuốn
    const getPastelColor = (index) => {
        const hues = [210, 35, 10, 160, 280, 50, 320]; 
        return `hsl(${hues[index % hues.length]}, 40%, 65%)`;
    };

    // 1. Render Bookshelf Spines
    if (bookshelfGrid) {
        folderNames.forEach((folderName, index) => {
            const spine = document.createElement("div");
            spine.className = "book-spine animate-up";
            spine.style.animationDelay = `${(index % 10) * 0.1}s`; 
            spine.style.backgroundColor = getPastelColor(index);
            
            // Trim tên hiển thị ngoài gáy sách để gọn gàng, nhưng giữ nguyên data gốc cho Folder
            spine.innerHTML = `<span class="spine-text">${folderName.trim()}</span>`;
            
            spine.addEventListener("click", () => openBook(folderName));
            bookshelfGrid.appendChild(spine);
        });
    }

    // 2. Mở sách & kích hoạt Probing
    async function openBook(folderName) {
        if (isBookLoading) return;
        isBookLoading = true;
        
        bookModal.style.display = "flex";
        bookScene.style.display = "none";
        bookControls.style.display = "none";
        bookLoader.style.display = "block";
        document.body.style.overflow = "hidden";

        // Gửi chính xác tên gốc (bao gồm cả khoảng trắng nếu có) vào đường dẫn
        const images = await probeWebPImages(`style/img/Bookmember/${folderName}`);

        buildFlipbookDOM(images, folderName.trim());
        
        bookLoader.style.display = "none";
        bookScene.style.display = "flex";
        bookControls.style.display = "flex";
        isBookLoading = false;
    }

    // 3. JIT Probing (.webp)
    async function probeWebPImages(folderPath) {
        let validImages = [];
        let i = 1;
        while (true) {
            try {
                let url = `${folderPath}/Anh (${i}).webp`;
                await new Promise((resolve, reject) => {
                    let img = new Image();
                    img.onload = () => { resolve(); img = null; };
                    img.onerror = () => { reject(); img = null; };
                    img.src = url;
                });
                validImages.push(url);
                i++;
            } catch (e) {
                break; // Ngắt vòng lặp khi báo lỗi 404
            }
        }
        return validImages;
    }

    // 4. Build Flipbook DOM
    function buildFlipbookDOM(images, studentName) {
        flipbookWrapper.innerHTML = ''; 
        pagesDOM = [];
        currentPage = 0;
        
        if (images.length === 0) {
            images = ['https://i.postimg.cc/P5nMWJnM/Logo.png']; 
        }

        totalPages = images.length;
        
        images.forEach((imgSrc, i) => {
            const page = document.createElement("div");
            page.className = "book-page";
            // Z-Index Ban đầu: Lớp giấy đầu phải nằm cao nhất
            page.style.zIndex = totalPages - i; 
            
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

            flipbookWrapper.appendChild(page);
            pagesDOM.push(page);
        });

        updateBookUI();
    }

    // 5. Flip Mechanics & Z-Index Correction
    function flipPage(direction) {
        if (direction === 1 && currentPage < totalPages) {
            pagesDOM[currentPage].classList.add("page-flipped");
            // Sửa Z-index: Giấy lật sang trái phải nằm dưới tờ lật sau nó
            pagesDOM[currentPage].style.zIndex = currentPage + 1; 
            currentPage++;
        } else if (direction === -1 && currentPage > 0) {
            currentPage--;
            pagesDOM[currentPage].classList.remove("page-flipped");
            // Phục hồi Z-index khi trả giấy về bên phải
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

    // Events
    document.getElementById("bookNext")?.addEventListener("click", () => flipPage(1));
    document.getElementById("bookPrev")?.addEventListener("click", () => flipPage(-1));
    
    closeBookBtn?.addEventListener("click", () => {
        bookModal.style.display = "none";
        document.body.style.overflow = "auto";
        flipbookWrapper.innerHTML = ''; // Thiêu hủy ngay DOM để chống Memory Leak
    });

    window.addEventListener("keydown", (e) => {
        if (bookModal.style.display === "flex") {
            if (e.key === "ArrowRight") flipPage(1);
            if (e.key === "ArrowLeft") flipPage(-1);
            if (e.key === "Escape") closeBookBtn.click();
        }
    });
});
