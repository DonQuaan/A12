document.addEventListener("DOMContentLoaded", () => {
    
    // Mảng Data chuẩn xác 26 thư mục (Giữ nguyên cấu trúc string, xóa bản duplicate)
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

    // Bảng màu Pastel cho gáy sách
    const getPastelColor = (index) => {
        const hues = [210, 35, 10, 160, 280, 50, 320]; 
        return `hsl(${hues[index % hues.length]}, 40%, 65%)`;
    };

    // 1. Render Bookshelf
    if (bookshelfGrid) {
        folderNames.forEach((folderName, index) => {
            const spine = document.createElement("div");
            spine.className = "book-spine animate-up";
            spine.style.animationDelay = `${(index % 10) * 0.1}s`; 
            spine.style.backgroundColor = getPastelColor(index);
            
            // Hàm trim() ẩn dấu cách ở gáy sách, nhưng biến truyền vào openBook vẫn giữ y nguyên
            spine.innerHTML = `<span class="spine-text">${folderName.trim()}</span>`;
            spine.addEventListener("click", () => openBook(folderName));
            bookshelfGrid.appendChild(spine);
        });
    }

    // 2. Logic Mở Sách An Toàn
    async function openBook(folderName) {
        if (isBookLoading) return;
        isBookLoading = true;
        
        // Gọi lệnh kích hoạt Class tĩnh, triệt tiêu lỗi che khuất màn hình
        bookModal.classList.add("modal-active");
        
        bookScene.style.display = "none";
        bookControls.style.display = "none";
        bookLoader.style.display = "block";
        document.body.style.overflow = "hidden";

        // Gửi chính xác tên gốc vào path
        const images = await probeWebPImages(`style/img/Bookmember/${folderName}`);

        buildFlipbookDOM(images, folderName.trim());
        
        bookLoader.style.display = "none";
        bookScene.style.display = "flex";
        bookControls.style.display = "flex";
        isBookLoading = false;
    }

    // 3. JIT Probing với FAIL-SAFE LIMIT (Chống tràn RAM)
    async function probeWebPImages(folderPath) {
        let validImages = [];
        // Giới hạn vòng lặp tối đa 150 để ngăn trình duyệt bị treo nếu Server lỗi
        for (let i = 1; i <= 150; i++) {
            try {
                let url = `${folderPath}/Anh (${i}).webp`;
                await new Promise((resolve, reject) => {
                    let img = new Image();
                    img.onload = () => { resolve(); img = null; };
                    img.onerror = () => { reject(); img = null; };
                    img.src = url;
                });
                validImages.push(url);
            } catch (e) {
                break; // Ngắt lập tức khi nhận được mã 404 (hết ảnh)
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

    // 5. Điều khiển Animation Lật
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

    // Events
    document.getElementById("bookNext")?.addEventListener("click", () => flipPage(1));
    document.getElementById("bookPrev")?.addEventListener("click", () => flipPage(-1));
    
    closeBookBtn?.addEventListener("click", () => {
        bookModal.classList.remove("modal-active"); // Hủy kích hoạt lớp kính
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
