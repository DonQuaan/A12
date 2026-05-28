document.addEventListener("DOMContentLoaded", () => {
    
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
    
    // --- SMART PRELOAD QUEUE (Chống liệt nút) ---
    const imageCache = {}; // Lưu trữ URL ảnh đã dò được: { "Đông Quân": ["url1", "url2"] }
    const isFinished = {}; // Đánh dấu thư mục đã tải hết (gặp 404): { "Đông Quân": true }
    let backgroundQueue = [...folderNames]; // Hàng đợi tải nền
    let priorityStudent = null; // Cờ kích hoạt ưu tiên ép xung tải
    
    // Khởi tạo Dictionary Cache
    folderNames.forEach(name => {
        imageCache[name] = [];
        isFinished[name] = false;
    });

    // Hàm tạo 1 Element sách
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

    // --- RENDER 3 TẦNG KỆ THỰC TẾ ---
    if (bookshelfGrid) {
        bookshelfGrid.innerHTML = ''; 
        // Trộn ngẫu nhiên 26 người
        const shuffled = [...folderNames].sort(() => 0.5 - Math.random());
        
        // Chia 3 tầng (9, 9, 8)
        const shelves = [ shuffled.slice(0, 9), shuffled.slice(9, 18), shuffled.slice(18, 26) ];
        
        const postures = ['upright', 'upright', 'upright', 'lean-left', 'lean-right'];

        shelves.forEach((shelfStudents, shelfIndex) => {
            const shelfRow = document.createElement("div");
            shelfRow.className = "shelf-row";

            let i = 0;
            while (i < shelfStudents.length) {
                // Tỉ lệ 15% tạo một cụm sách nằm ngang (Stack 2 cuốn)
                if (Math.random() < 0.15 && i < shelfStudents.length - 1) {
                    const stack = document.createElement("div");
                    stack.className = "book-stack";
                    
                    const name1 = shelfStudents[i];
                    const name2 = shelfStudents[i+1];
                    const s1 = Math.floor(Math.random() * 10) + 1;
                    const s2 = Math.floor(Math.random() * 10) + 1;
                    
                    stack.appendChild(createBookElement(name1, s1, 'horizontal'));
                    stack.appendChild(createBookElement(name2, s2, 'horizontal'));
                    shelfRow.appendChild(stack);
                    i += 2;
                } else {
                    const name = shelfStudents[i];
                    const style = Math.floor(Math.random() * 10) + 1;
                    const post = postures[Math.floor(Math.random() * postures.length)];
                    shelfRow.appendChild(createBookElement(name, style, post));
                    i++;
                }

                // Random chèn chậu cây trang trí
                if (Math.random() < 0.25) {
                    const plant = document.createElement("div");
                    plant.className = "decor-plant";
                    shelfRow.appendChild(plant);
                }
            }

            const board = document.createElement("div");
            board.className = "shelf-board-row";
            shelfRow.appendChild(board);
            
            bookshelfGrid.appendChild(shelfRow);
        });

        // Bắt đầu chạy tiến trình tải ngầm cực nhẹ
        setTimeout(processBackgroundQueue, 2000); 
    }

    // --- ENGINE XỬ LÝ ẢNH (Không gây treo máy) ---
    function checkImageExistence(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve({ exists: true, url: url });
            img.onerror = () => resolve({ exists: false, url: url });
            img.src = url;
        });
    }

    async function processBackgroundQueue() {
        if (backgroundQueue.length === 0) return; // Đã quét xong cả lớp

        // Nếu có ai đó click vào sách, DỪNG QUÉT NỀN để nhường 100% băng thông cho cuốn đó
        if (priorityStudent) {
            setTimeout(processBackgroundQueue, 500);
            return; 
        }

        const student = backgroundQueue[0];
        const nextIndex = imageCache[student].length + 1;
        const url = `style/img/Bookmember/${student}/Anh (${nextIndex}).webp`;

        const result = await checkImageExistence(url);
        
        if (result.exists) {
            imageCache[student].push(result.url); // Lưu vào cache
            // Vẫn quét tiếp người này ở vòng lặp sau
        } else {
            isFinished[student] = true; // Hết ảnh
            backgroundQueue.shift(); // Xóa người này khỏi Queue
        }

        // Đợi 200ms cho mượt rồi lặp lại
        setTimeout(processBackgroundQueue, 200); 
    }

    // --- LOGIC MỞ SÁCH ---
    async function openBook(folderName) {
        bookModal.classList.add("modal-active");
        bookScene.style.display = "none";
        bookControls.style.display = "none";
        bookLoader.style.display = "block";
        document.body.style.overflow = "hidden";

        // Kích hoạt cờ ưu tiên. Chặn mọi tiến trình ngầm khác.
        priorityStudent = folderName;
        
        // Quét tốc độ cao cho đến khi báo Finished
        let index = imageCache[folderName].length + 1;
        while (!isFinished[folderName]) {
            const url = `style/img/Bookmember/${folderName}/Anh (${index}).webp`;
            const result = await checkImageExistence(url);
            if (result.exists) {
                imageCache[folderName].push(result.url);
                index++;
            } else {
                isFinished[folderName] = true;
            }
        }

        // Sau khi đã ép xung tải xong, nhả cờ ưu tiên ra
        priorityStudent = null;

        // Render toàn bộ ảnh từ Cache ra UI
        buildFlipbookDOM(imageCache[folderName], folderName.trim());
        
        bookLoader.style.display = "none";
        bookScene.style.display = "flex";
        bookControls.style.display = "flex";
    }

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
