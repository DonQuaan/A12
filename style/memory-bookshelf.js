document.addEventListener("DOMContentLoaded", () => {
    
    // Mảng Data đóng gói nội bộ, trùng khớp 100% tên thư mục của bạn
    const studentFolders = [
        "Cô Mỹ Dung - GVCN K9", "Thầy Quang Thạch - GVCN K8", "Cô Thu Thủy - GVCN K7",
        "Bùi Chí Thành", "Chu Trịnh Gia Bảo", "Hồ Minh Khôi", "Hồ Tường An", 
        "Hoàng Đỗ Bảo Nam", "Huỳnh Thị Cát Hồng", "Lâm Quang Chánh", "Lê Thành Nhân", 
        "Lê Võ Hoàng Cung", "Ngô Thái Bảo Uyên", "Nguyễn Bảo Ngân", "Nguyễn Đỗ Gia Huy", 
        "Nguyễn Lê Minh Anh", "Nguyễn Lê Phương Linh", "Nguyễn Thạc Hoàng Anh", 
        "Nguyễn Thảo Nguyên", "Nguyễn Vũ Đông Quân", "Phạm Trần Song Thư", 
        "Phạm Vũ Huy Quỳnh", "Tăng Khánh Châu", "Phạm Xuân Trọng", 
        "Trần Bình Minh", "Trần Khải Hoàn", "Trần Văn Nhật Quang", "Vũ Khánh Huyền"
    ];

    // Truy xuất DOM Elements
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

    // 1. Sinh màu gáy sách ngẫu nhiên nhưng tone Pastel nhẹ nhàng
    const getPastelColor = (index) => {
        const hues = [210, 35, 10, 160, 280, 50, 320]; 
        return `hsl(${hues[index % hues.length]}, 40%, 65%)`;
    };

    // 2. TẠO KỆ SÁCH
    if (bookshelfGrid) {
        studentFolders.forEach((folderName, index) => {
            const spine = document.createElement("div");
            spine.className = "book-spine animate-up";
            spine.style.animationDelay = `${(index % 10) * 0.1}s`; 
            spine.style.backgroundColor = getPastelColor(index);
            
            // Tên in trên gáy sách
            spine.innerHTML = `<span class="spine-text">${folderName}</span>`;
            
            // Gắn sự kiện click mở sách
            spine.addEventListener("click", () => openBook(folderName));
            bookshelfGrid.appendChild(spine);
        });
    }

    // 3. LOGIC MỞ SÁCH (Bảo vệ luồng)
    async function openBook(folderName) {
        if (isBookLoading) return;
        isBookLoading = true;
        
        // Hiện Loader, Khóa Scroll
        bookModal.style.display = "flex";
        bookScene.style.display = "none";
        bookControls.style.display = "none";
        bookLoader.style.display = "block";
        document.body.style.overflow = "hidden";

        // Dò tìm ảnh .webp trong thư mục thực tế
        const images = await probeWebPImages(`style/img/Bookmember/${folderName}`);

        // Dựng HTML trang sách
        buildFlipbookDOM(images, folderName);
        
        // Tắt Loader, Hiện Sách
        bookLoader.style.display = "none";
        bookScene.style.display = "flex";
        bookControls.style.display = "flex";
        isBookLoading = false;
    }

    // 4. THUẬT TOÁN DÒ ẢNH (.webp)
    async function probeWebPImages(folderPath) {
        let validImages = [];
        let i = 1;
        while (true) {
            try {
                // Ràng buộc cứng: "Anh (số).webp"
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
                break; // Đã bắt được 404 -> Hết ảnh trong thư mục này
            }
        }
        return validImages;
    }

    // 5. RENDER TRANG SÁCH VÀO DOM (JIT Rendering)
    function buildFlipbookDOM(images, studentName) {
        // Dọn rác của cuốn sách trước đó
        flipbookWrapper.innerHTML = ''; 
        pagesDOM = [];
        currentPage = 0;
        
        // Ngoại lệ: Nếu thư mục chưa có ảnh
        if (images.length === 0) {
            images = ['https://i.postimg.cc/P5nMWJnM/Logo.png']; 
        }

        totalPages = images.length;
        
        images.forEach((imgSrc, i) => {
            const page = document.createElement("div");
            page.className = "book-page";
            // Z-index xếp lớp quan trọng để giấy đè lên nhau chuẩn vật lý
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
                        <p>"Dù sau này đi đâu, làm gì, những năm tháng ở A12 vẫn là thước phim đẹp nhất."</p>
                        <span style="display:block; margin-top:20px; font-size:1rem; font-family:'Inter', sans-serif;">- ${studentName} -</span>
                    </div>
                </div>
            `;
            
            // Cho phép lật khi click trực tiếp vào trang giấy
            page.addEventListener("click", () => {
                if (page.classList.contains("page-flipped")) flipPage(-1);
                else flipPage(1);
            });

            flipbookWrapper.appendChild(page);
            pagesDOM.push(page);
        });

        updateBookUI();
    }

    // 6. ĐỘNG CƠ LẬT TRANG (3D Transform & Z-index Shift)
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

    // 7. CẬP NHẬT GIAO DIỆN NÚT BẤM
    function updateBookUI() {
        pageIndicator.innerText = `${currentPage} / ${totalPages}`;
        // Dịch chuyển sách ra giữa khi bắt đầu lật trên màn PC
        if (window.innerWidth > 768) {
            flipbookWrapper.style.transform = currentPage > 0 ? "translateX(50%)" : "translateX(0)";
        }
    }

    // 8. KẾT NỐI SỰ KIỆN (Events)
    document.getElementById("bookNext")?.addEventListener("click", () => flipPage(1));
    document.getElementById("bookPrev")?.addEventListener("click", () => flipPage(-1));
    
    closeBookBtn?.addEventListener("click", () => {
        bookModal.style.display = "none";
        document.body.style.overflow = "auto";
        flipbookWrapper.innerHTML = ''; // Tiêu hủy DOM ngay lập tức để trống RAM
    });

    // Hỗ trợ lật bằng phím mũi tên
    window.addEventListener("keydown", (e) => {
        if (bookModal.style.display === "flex") {
            if (e.key === "ArrowRight") flipPage(1);
            if (e.key === "ArrowLeft") flipPage(-1);
            if (e.key === "Escape") closeBookBtn.click();
        }
    });
});
