document.addEventListener("DOMContentLoaded", () => {
  const gatekeeper = document.getElementById("gatekeeper");
  const gateBtns = document.querySelectorAll(".gate-btn");
  const gateAlert = document.getElementById("gateAlert");
  const alertGif = document.getElementById("alertGif");
  const alertMsg = document.getElementById("alertMsg");

  const correctGif =
    "https://i.pinimg.com/originals/b7/c6/4a/b7c64aca651271c52087f58276bd1de1.gif";
  const wrongGif =
    "https://i.pinimg.com/originals/59/4f/99/594f995748f0463a8c61c1c593510815.gif";

  // SFX for verification
  const correctSfx = new Audio("style/question/correct.mp3");
  const wrongSfx = new Audio("style/question/wrong.mp3");
// ==================== HỆ THỐNG FLIPBOOK ĐỘNG TỐI ƯU ====================
    const deskGrid = document.getElementById('deskGrid');
    const flipbookModal = document.getElementById('flipbookModal');
    const flipbookWrapper = document.getElementById('flipbookWrapper');
    const closeFlipbook = document.querySelector('.close-flipbook');
    const loadingText = document.createElement('div');
    loadingText.className = 'fb-loading';
    loadingText.innerText = 'Đang lục tìm ký ức...';
    if(flipbookModal) flipbookModal.appendChild(loadingText);

    // Mảng Quotes ngẫu nhiên chuẩn form "Lưu bút"
    const youthQuotes = [
        "Thanh xuân là cơn mưa rào, dẫu cảm lạnh vẫn muốn tắm lại lần nữa.",
        "Mỗi nụ cười ngày đó, giờ là kho báu vô giá.",
        "Năm tháng trôi qua, chỉ có ánh mắt ấy là không đổi thay.",
        "Tuổi 15 rực rỡ, ta đã có mọi thứ, kể cả sự ngây ngô.",
        "Cảm ơn vì đã xuất hiện trong thanh xuân của tôi.",
        "Góc sân trường ngày đó, còn vương mãi tiếng cười.",
        "Tạm biệt nhé, những ngày tháng vô lo vô nghĩ."
    ];

    // Trích xuất 26 cái tên từ biến members có sẵn ở trên
    const bookNames = members.map(m => m.name.split('-')[0].trim());

    // 1. Render tủ sách vật lý
    if (deskGrid) {
        bookNames.forEach(name => {
            const spine = document.createElement('div');
            spine.className = 'book-spine';
            spine.innerHTML = `<span>${name}</span>`;
            spine.onclick = () => openFlipbook(name);
            deskGrid.appendChild(spine);
        });
    }

    // 2. Thuật toán Image Probing Đệ Quy
    function probeImages(studentName) {
        return new Promise(resolve => {
            let validUrls = [];
            let index = 1;
            function checkNext() {
                const img = new Image();
                // Đường dẫn chuẩn theo file structure yêu cầu
                const url = `style/img/Bookmember/${studentName}/Anh (${index}).jpg`;
                
                img.onload = () => {
                    validUrls.push(url);
                    index++;
                    checkNext();
                };
                img.onerror = () => resolve(validUrls); // Gặp lỗi 404 (hết ảnh) thì dừng
                img.src = url;
            }
            checkNext();
        });
    }

    // 3. Xây dựng Virtual DOM Flipbook
    async function openFlipbook(studentName) {
        flipbookModal.style.display = 'flex';
        loadingText.style.display = 'block';
        flipbookWrapper.innerHTML = ''; 
        
        // Cân bằng trục X khi mở sách
        flipbookWrapper.style.transform = 'translateX(0)'; 

        const imgUrls = await probeImages(studentName);
        loadingText.style.display = 'none';

        if (imgUrls.length === 0) {
            flipbookWrapper.innerHTML = `<div style="color:#fff;text-align:center;width:100%;margin-top:50%;">Chưa có dữ liệu ảnh cho ${studentName}</div>`;
            return;
        }

        // Setup DOM Sách
        let totalPages = Math.ceil(imgUrls.length / 2) + 1; // +1 cho bìa sách
        let htmlContext = '';
        let zIndexCounter = totalPages;

        // Trang Bìa
        htmlContext += `
            <div class="fb-page" style="z-index: ${zIndexCounter};" data-page="0">
                <div class="fb-front fb-cover"><h2>${studentName}</h2></div>
                <div class="fb-back">
                    <div class="fb-img-container"><img src="${imgUrls[0]}" alt="Memory"></div>
                    <p class="fb-quote">"${youthQuotes[0 % youthQuotes.length]}"</p>
                </div>
            </div>
        `;
        zIndexCounter--;

        // Các trang nội dung
        let imgIndex = 1;
        for (let i = 1; i < totalPages; i++) {
            const frontImg = imgUrls[imgIndex] ? `<div class="fb-img-container"><img src="${imgUrls[imgIndex]}" alt="Memory"></div><p class="fb-quote">"${youthQuotes[imgIndex % youthQuotes.length]}"</p>` : '';
            imgIndex++;
            const backImg = imgUrls[imgIndex] ? `<div class="fb-img-container"><img src="${imgUrls[imgIndex]}" alt="Memory"></div><p class="fb-quote">"${youthQuotes[imgIndex % youthQuotes.length]}"</p>` : '';
            imgIndex++;

            htmlContext += `
                <div class="fb-page" style="z-index: ${zIndexCounter};" data-page="${i}">
                    <div class="fb-front">${frontImg}</div>
                    <div class="fb-back">${backImg}</div>
                </div>
            `;
            zIndexCounter--;
        }

        flipbookWrapper.innerHTML = htmlContext;

        // Xử lý Logic Lật Sách vật lý
        const pages = document.querySelectorAll('.fb-page');
        let currentPage = 0;

        pages.forEach((page, index) => {
            page.addEventListener('click', function(e) {
                // Kiểm tra click nửa trái hay nửa phải để xác định lật tới hay lùi
                const rect = this.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                
                if (clickX > rect.width / 2) {
                    // Lật Tới
                    if (currentPage < pages.length) {
                        pages[currentPage].classList.add('flipped');
                        // Fix Z-index Tearing
                        pages[currentPage].style.zIndex = currentPage + 1;
                        currentPage++;
                        flipbookWrapper.style.transform = `translateX(${rect.width / 2}px)`;
                    }
                } else {
                    // Lật Lùi
                    if (currentPage > 0) {
                        currentPage--;
                        pages[currentPage].classList.remove('flipped');
                        // Khôi phục Z-index
                        pages[currentPage].style.zIndex = pages.length - currentPage;
                        if(currentPage === 0) flipbookWrapper.style.transform = 'translateX(0)';
                    }
                }
            });
        });
    }

    if (closeFlipbook) {
        closeFlipbook.addEventListener('click', () => {
            flipbookModal.style.display = 'none';
            flipbookWrapper.innerHTML = ''; // Garbage Collection: Xóa Node chống Leak RAM
        });
    }
  if (gatekeeper && gateAlert) {
    gateBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const answer = btn.getAttribute("data-answer");
        const card = gatekeeper.querySelector(".gate-card");

        if (answer === "D") {
          btn.classList.add("correct");
          if (card) card.classList.add("blur-all");
          if (alertGif) alertGif.src = correctGif;
          alertMsg.innerText = "Chào mừng trở lại!";
          gateAlert.className = "gate-alert success show";

          // SFX and Music Start
          correctSfx.play();
          playSongAtIndex(0); // Start the first song in bgMusic

          setTimeout(() => {
            gatekeeper.classList.add("fade-out");
            document.body.style.overflow = "auto";
            setTimeout(() => gatekeeper.remove(), 1000);
          }, 1800);
        } else {
          btn.classList.add("wrong");
          if (card) card.classList.add("blur-all");
          if (alertGif) alertGif.src = wrongGif;
          alertMsg.innerText = "Bạn không phải là thành viên của lớp này";
          gateAlert.className = "gate-alert error show";

          // Play Wrong SFX
          wrongSfx.play();

          setTimeout(() => {
            gateAlert.classList.remove("show");
            btn.classList.remove("wrong");
            if (card) card.classList.remove("blur-all");
          }, 2000);
        }
      });
    });
  }
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  const burger = document.querySelector(".burger");
  const navLinks = document.querySelector(".nav-links");

  burger.addEventListener("click", () => {
    navLinks.classList.toggle("nav-active");
    burger.classList.toggle("toggle");
  });

  const links = document.querySelectorAll(".nav-links li a");
  links.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("nav-active");
      burger.classList.remove("toggle");
    });
  });

  const memberGrid = document.getElementById("memberGrid");
  const loadMoreBtn = document.getElementById("loadMoreBtn");

  const members = [
    {
      name: "Cô Mỹ Dung - GVCN K9",
      nickname: "ÁNH DƯƠNG",
      quote: "Hành trình bất khả thi nhất chính là hành trình mà bạn không bao giờ chịu bắt đầu!",
      img: "style/img/ThanhVien/GVCN Cô Dung.jpg",
      hobbies: "Dạy học, Văn chương",
      message: "A12 thương mến! Mới ngày nào cô còn nhìn thấy những gương mặt bỡ ngỡ bước vào lớp với biết bao ngại ngùng của tuổi học trò, vậy mà hôm nay các em đã đứng trước ngưỡng cửa của những chia xa và trưởng thành. Bốn năm trôi qua không quá dài, nhưng đủ để lưu giữ biết bao kỷ niệm: những giờ học đầy tiếng cười, những lần cùng nhau cố gắng, những buổi ôn thi mệt nhoài và cả những khoảnh khắc vô tư chỉ tuổi học trò mới có. Có lẽ sau này, giữa bộn bề cuộc sống, các em sẽ chẳng nhớ hết những bài học trên trang giấy, nhưng cô tin các em sẽ luôn nhớ về nhau, nhớ về lớp học nhỏ đã từng là thanh xuân đẹp nhất của mình. Tuổi mười lăm của các em đẹp như khoảng trời tháng năm trong veo, rực rỡ và chẳng thể quay lại lần thứ hai. Thanh xuân của các em đã đi qua dưới mái trường này bằng tất cả sự hồn nhiên, nhiệt thành và những ước mơ còn dang dở phía trước. Mai này, khi mỗi người đi về một hướng, cô mong các em vẫn giữ cho mình sự tử tế, lòng biết ơn và ánh mắt dịu dàng dành cho cuộc sống. Hãy sống như những đóa hoa biết hướng về phía mặt trời, dù có lúc phải đi qua những ngày mưa gió. Cô chúc A12 sẽ bước vào kỳ thi tuyển sinh 10 với tâm thế bình tĩnh, tự tin và vững vàng nhất. Mong rằng những ước mơ các em đang nâng niu hôm nay sẽ trở thành hiện thực trong một ngày không xa. Và dù mai này các em có trở thành ai, đi đến nơi nào, cô vẫn luôn hy vọng rằng: khi nhớ về mái trường này, các em sẽ mỉm cười vì đã từng có một thanh xuân thật đẹp. Chúc các em thi thật tốt, đi thật xa và luôn giữ trong tim mình ngọn lửa của tuổi trẻ. Thương mến và tin tưởng.",
    },
    {
      name: "Thầy Quang Thạch - GVCN K8",
      nickname: "Thầy Voi",
      quote: "Thầy chỉ trao chiếc la bàn, còn đi về hướng nào để hạnh phúc là ở các em!",
      img: "style/img/ThanhVien/Trịnh Quang Thạch.jpg",
      hobbies: "Dạy học, Địa Lý",
      message: "Bản đồ thế giới chỉ cho các em thấy những ranh giới địa lý được vẽ bằng mực, nhưng cuộc đời các em là một vùng đất hoang sơ chưa có dấu chân người. Sẽ có những lúc cuộc đời kiến tạo nên những đứt gãy đột ngột, hay những dòng sông số phận đổi dòng bất ngờ khiến các em mất phương hướng. Nhưng hãy nhớ, ngay cả những đỉnh núi cao nhất cũng được hình thành từ sự va chạm đầy đau đớn của các mảng kiến tạo, và những thung lũng màu mỡ nhất lại là kết quả của sự xói mòn qua năm tháng. Đừng sợ những gập ghềnh địa hình của số phận. Thầy không thể đi cùng để chỉ lối, nhưng thầy mong mỗi em sẽ tự vẽ nên một hệ tọa độ của riêng mình bằng lòng can đảm, và định vị bản thân bằng sự tử tế. Thế giới ngoài kia rộng lớn vô cùng, cứ đi để biết mình nhỏ bé, rồi quay về để thấy mình vĩ đại.",
    },
    {
      name: "Cô Thu Thủy - GVCN K7",
      nickname: "Dòng Sông Tình Yêu",
      quote: "Đời người như một bài toán, Cô tin chúng em tự tin tìm ra đáp án của riêng mình. Chúc các em mãi là hằng số của sự bình yên và vui vẻ!",
      img: "style/img/ThanhVien/Nguyễn Thị Thu Thuỷ.jpg",
      hobbies: "Dạy học, Toán Học",
      message: "Toán học dạy chúng ta tìm nghiệm cho những phương trình có sẵn, nhưng cuộc đời thực lại là một chuỗi những phương trình vô số ẩn, nơi các em phải tự định nghĩa các giá trị cho riêng mình. Có những giai đoạn các em sẽ thấy cuộc sống biến thiên liên tục, áp lực đè nặng tưởng chừng như tiệm cận đến vô cực, và những phép thử chỉ mang lại sai số đau lòng. Nhưng đừng quên rằng, một đường cong dù có phức tạp đến đâu cũng được kiến tạo từ vô số những điểm chấm nhỏ li ti đứng cạnh nhau một cách kiên nhẫn. Sự trưởng thành chính là tích phân của những nỗ lực thầm lặng tích lũy qua mỗi ngày. Khi bước vào thế giới của những người trưởng thành đầy rẫy biến số, cô mong các em luôn giữ cho mình một 'hằng số' bất biến: đó là sự lương thiện và lòng tự trọng. Đáp án cuối cùng của bài toán cuộc đời không nằm ở con số x bằng bao nhiêu, mà nằm ở việc các em đã giải nó bằng tất cả sự kiên nhẫn và thanh danh của chính mình.",
    },
    {
      name: "Bùi Chí Thành",
      nickname: "Con Bot mạnh nhất lịch sử",
      quote: "Tất cả chúng ta đều đang nằm dưới rãnh nước, nhưng vài người trong số chúng ta vẫn đang ngước nhìn những vì sao.",
      img: "style/img/ThanhVien/Bùi Chí Thành.jpg",
      hobbies: "Cafe, nghe nhạc",
      message: "Thanh xuân của chúng ta cất gọn trong ngăn bàn đầy bụi phấn. Sau này ra biển lớn, mong cậu giữ mãi sự chân thành và nhiệt huyết của tuổi mười tám. Chúc cậu một đời bình an, điệu cười vẫn rạng rỡ như ngày thuở nào.",
    },
    {
      name: "Chu Trịnh Gia Bảo",
      nickname: "Chật nít Gas",
      quote: "Không ai có thể làm cho bạn cảm thấy kém cỏi nếu không có sự cho phép của chính bạn.",
      img: "style/img/ThanhVien/Chu Trịnh Gia Bảo.jpg",
      hobbies: "Chơi Game, Nghe nhạc",
      message: "Có những người bạn, chỉ cần ngồi cạnh nhau chẳng nói gì cũng thấy lòng bình yên. Cảm ơn cậu vì đã là một phần thanh xuân rực rỡ nhất của tớ. Hãy cứ đi và khám phá thế giới, nhưng đừng quên lối về nhé.",
    },
    {
      name: "Hồ Minh Khôi",
      nickname: "Khôi (me myy)",
      quote: "Hãy trở thành sự thay đổi mà bạn muốn nhìn thấy trên thế giới này.",
      img: "style/img/ThanhVien/Hồ Minh Khôi.jpg",
      hobbies: "Nấu ăn, Chơi game",
      message: "Chúng ta của sau này có thể có tất cả, nhưng sẽ không có chúng ta của năm tháng ấy. Mong cậu ở thế giới người lớn vẫn giữ được trái tim dũng cảm của một đứa trẻ. Chúc cậu dẫu đi qua bão giông vẫn luôn thấy cầu vồng.",
    },
    {
      name: "Hồ Tường An",
      nickname: "An An",
      quote: "Dù bạn nghĩ rằng mình có thể hay không thể, bạn đều đúng cả.",
      img: "style/img/ThanhVien/Hồ Tường An.jpg",
      hobbies: "Piano, Vẽ tranh",
      message: "Gấp lại trang sách cuối, chúng ta chính thức trở thành những 'người lớn' tập sự. Cầu mong đường cậu đi muôn ngả luôn trải đầy hoa, và tâm hồn cậu mãi an yên như chính cái tên của cậu vậy.",
    },
    {
      name: "Hoàng Đỗ Bảo Nam",
      nickname: "Nam",
      quote: "Bất cứ nơi nào bạn đi, hãy đi bằng tất cả trái tim mình.",
      img: "style/img/ThanhVien/Hoàng Đỗ Bảo Nam.jpg",
      hobbies: "Ngoại ngữ, game",
      message: "Tuổi trẻ cho phép chúng ta sai và làm lại. Đừng sợ những vấp ngã, vì đó là huy chương của sự trưởng thành. Chúc cậu nhắm trúng những vì sao và vươn tới những đỉnh cao mà cậu hằng ao ước.",
    },
    {
      name: "Huỳnh Thị Cát Hồng",
      nickname: "Pink Sand",
      quote: "Hãy như nước, mềm mại lách qua những khe nứt. Đừng cứng nhắc, hãy dọn sạch tâm trí, tĩnh tại và linh hoạt như nước.",
      img: "style/img/ThanhVien/Huỳnh Thị Cát Hồng.jpg",
      hobbies: "Sách, âm nhạc, lịch sử",
      message: "Mỗi chúng ta đều là một vì sao độc nhất trên bầu trời. Đừng để bất kỳ ai làm lu mờ ánh sáng của cậu. Chúc cậu một đời tự do tự tại, xinh đẹp và tỏa sáng theo cách riêng của mình.",
    },
    {
      name: "Lâm Quang Chánh",
      nickname: "Anh Lớn",
      quote: "Việc bạn đi chậm thế nào không quan trọng, miễn là bạn đừng bao giờ dừng lại..",
      img: "style/img/ThanhVien/Lâm Quang Chánh.jpg",
      hobbies: "Game, Du lịch",
      message: "Chuyến tàu mang tên thanh xuân không có vé khứ hồi, nhưng kỉ niệm thì luôn ở lại. Mai này dù cuộc sống có xô bồ, mong cậu vẫn giữ được sự ngay thẳng và trái tim ấm áp. Hẹn ngày gặp lại trên đỉnh vinh quang.",
    },
    {
      name: "Lê Thành Nhân",
      nickname: "Skibidi",
      quote: "Hãy nhắm tới mặt trăng. Dù có trượt, bạn cũng sẽ hạ cánh giữa những vì sao.",
      img: "style/img/ThanhVien/Lê Thành Nhân.jpg",
      hobbies: "Xem phim, chơi game",
      message: "Bài học khó nhất không nằm trong sách giáo khoa, mà nằm ở trường đời. Chúc cậu đủ mạnh mẽ để bao dung, đủ trí tuệ để thấu hiểu, và luôn thành công trên con đường trở thành phiên bản tốt nhất của chính mình.",
    },
    {
      name: "Lê Võ Hoàng Cung",
      nickname: "Cung",
      quote: "Mọi thứ bạn từng mong muốn đều nằm ở phía bên kia của sự sợ hãi.",
      img: "style/img/ThanhVien/Lê Võ Hoàng Cung.jpg",
      hobbies: "Chơi game, đi chơi cùng bạn bè",
      message: "Tiếng trống trường khép lại cũng là lúc tiếng còi tàu vào đời vang lên. Hãy xây dựng một 'vương quốc' ước mơ cho riêng mình và kiêu hãnh bước đi. Tớ tin cậu sẽ làm được những điều tuyệt vời nhất.",
    },
    {
      name: "Ngô Thái Bảo Uyên",
      nickname: "Bảo Uyên",
      quote: "Những người nhảy múa thường bị coi là điên rồ bởi những kẻ không thể nghe thấy tiếng nhạc.",
      img: "style/img/ThanhVien/Ngô Thái Bảo Uyên.jpg",
      hobbies: "Quay phim, Nghe nhạc",
      message: "Sẽ có lúc cậu thấy chênh vênh giữa dòng đời vội vã, hãy nhớ về khoảng sân trường đầy nắng và những nụ cười ngây ngô hôm nay để lấy thêm sức mạnh. Chúc cô gái nhỏ của chúng ta luôn kiên cường và hạnh phúc.",
    },
    {
      name: "Nguyễn Bảo Ngân",
      nickname: "Ngân",
      quote: "Tại sao phải nỗ lực hòa lẫn vào đám đông trong khi bạn sinh ra là để nổi bật?",
      img: "style/img/ThanhVien/Nguyễn Bảo Ngân.jpg",
      hobbies: "Đọc sách, Chơi game",
      message: "Tài sản lớn nhất của tuổi học trò chính là những giọt nước mắt và nụ cười trao cho nhau. Mang theo hành trang này, mong cậu đi muôn nơi vẫn được trân trọng và yêu thương. Tương lai rực rỡ đang chờ cậu phía trước.",
    },
    {
      name: "Nguyễn Đỗ Gia Huy",
      nickname: "TOP 1 HSG Tin",
      quote: "Bạn không thể bơi đến những chân trời mới cho đến khi có đủ can đảm để không còn nhìn thấy bờ.",
      img: "style/img/ThanhVien/Nguyễn Đỗ Gia Huy.jpg",
      hobbies: "Du lịch, chụp ảnh",
      message: "Chúng ta mất ba năm để học cách làm quen, nhưng lại phải dùng cả đời để nhớ về nhau. Chặng đường sắp tới sẽ rất dài, mong cậu luôn giữ được ngọn lửa đam mê và sự tự tin vốn có. Đừng bao giờ lùi bước nhé!",
    },
    {
      name: "Nguyễn Lê Minh Anh",
      nickname: "Manh",
      quote: "Trí tưởng tượng còn quan trọng hơn cả kiến thức. Kiến thức là hữu hạn, còn trí tưởng tượng bao trùm cả thế giới.",
      img: "style/img/ThanhVien/Nguyễn Lê Minh Anh.jpg",
      hobbies: "Ăn, Game",
      message: "Ánh sáng của tuổi trẻ không nằm ở những điều lớn lao, mà ở sự thuần khiết trong đáy mắt. Chúc cậu sau này dù nhìn thấy bao nhiêu góc khuất của cuộc đời, vẫn giữ được đôi mắt trong veo và tâm hồn tươi sáng.",
    },
    {
      name: "Nguyễn Lê Phương Linh",
      nickname: "Linh",
      quote: "Và một khi cơn bão qua đi, bạn sẽ không nhớ mình đã vượt qua nó như thế nào... Nhưng có một điều chắc chắn: Khi bước ra khỏi cơn bão, bạn sẽ không còn là người đã bước vào.",
      img: "style/img/ThanhVien/Nguyễn Lê Phương Linh.jpg",
      hobbies: "Mạng xã hội, Làm đẹp",
      message: "Chiếc lá bàng rơi nghiêng ngoài cửa sổ mang theo cả những năm tháng mộng mơ. Mong cuộc đời cậu sau này sẽ như một bản nhạc êm dịu, không cần quá ồn ào nhưng đủ sâu lắng và bình yên.",
    },
    {
      name: "Nguyễn Thạc Hoàng Anh",
      nickname: "Hanh",
      quote: "Thành công không phải là điểm đến cuối cùng, thất bại cũng không phải là vực sâu tử thần: lòng can đảm bước tiếp mới là điều quan trọng.",
      img: "style/img/ThanhVien/Nguyễn Thạc Hoàng Anh.jpg",
      hobbies: "Thể dục, TOP 1 MMA",
      message: "Hôm nay chúng ta chia tay để ngày mai gặp lại nhau ở những phiên bản trưởng thành hơn. Chúc cậu gom đủ nắng để làm nên rạng đông của riêng mình, mọi sự đều viên mãn và trọn vẹn.",
    },
    {
      name: "Nguyễn Thảo Nguyên",
      nickname: "Nguyên",
      quote: "Hãy tự tin bước đi theo hướng những giấc mơ của bạn. Hãy sống cuộc đời mà bạn đã từng tưởng tượng.",
      img: "style/img/ThanhVien/Nguyễn Thảo Nguyên.jpg",
      hobbies: "Mạng xã hội, Giao lưu",
      message: "Bầu trời ngoài kia rộng lớn lắm, chim non rồi cũng phải rời tổ để tập bay. Chúc cậu đôi cánh thật vững chãi, bay qua giông bão để đón lấy ánh mặt trời rực rỡ nhất.",
    },
    {
      name: "Nguyễn Vũ Đông Quân",
      nickname: "Haruka donkai",
      quote: "Điều quan trọng không phải là chuyện gì xảy ra với bạn, mà là cách bạn phản ứng với nó.",
      img: "style/img/ThanhVien/Nguyễn Vũ Đông Quân.jpg",
      hobbies: "Sáng tạo nội dung, Truyền cảm hứng",
      message: "Mong bạn sau này chẳng cần ai định nghĩa mới biết mình là ai. Mỗi ngã rẽ đều là một bài học để ta hiểu về bản thân mình sâu sắc hơn. Chúc hành trình phía trước của bạn luôn đầy bản lĩnh và ngập tràn cảm hứng.",
    },
    {
      name: "Phạm Trần Song Thư",
      nickname: "Chị Cả",
      quote: "Thấu hiểu bản thân là khởi nguồn của mọi sự thông thái.",
      img: "style/img/ThanhVien/Phạm Trần Song Thư.jpg",
      hobbies: "Sách, âm nhạc",
      message: "Lưu bút viết rồi nét mực cũng phai, chỉ có tình bạn mười tám đôi mươi là còn in dấu mãi. Chúc cậu viết nên những trang sách cuộc đời thật đẹp, nơi nhân vật chính là cậu luôn dũng cảm và rạng ngời.",
    },
    {
      name: "Phạm Vũ Huy Quỳnh",
      nickname: "Quỳnh peo",
      quote: "Chỉ khi ở trong tận cùng của bóng tối, bạn mới có thể nhìn thấy những vì sao.",
      img: "style/img/ThanhVien/Phạm Vũ Huy Quỳnh.jpg",
      hobbies: "Làm đẹp, Mạng xã hội",
      message: "Đóa hoa Quỳnh chỉ nở rộ vào ban đêm, tỏa hương tĩnh lặng mà nồng nàn. Cậu cũng vậy, không cần ồn ào chứng tỏ, hãy cứ âm thầm nỗ lực và nở rộ vào thời khắc huy hoàng nhất của đời mình.",
    },
    {
      name: "Tăng Khánh Châu",
      nickname: "Châu",
      quote: "Hãy là chính mình, vì những người khác đã có người đóng mất rồi.",
      img: "style/img/ThanhVien/Tăng Khánh Châu.jpg",
      hobbies: "Âm nhạc, yên bình",
      message: "Đóa hoa Quỳnh chỉ nở rộ vào ban đêm, tỏa hương tĩnh lặng mà nồng nàn. Cậu cũng vậy, không cần ồn ào chứng tỏ, hãy cứ âm thầm nỗ lực và nở rộ vào thời khắc huy hoàng nhất của đời mình.",
    },
    {
      name: "Phạm Xuân Trọng",
      nickname: "Vua Trò Chơi",
      quote: "Những gì rớt lại phía sau và những gì đang chờ phía trước đều vô cùng nhỏ bé so với những gì nằm bên trong chúng ta.",
      img: "style/img/ThanhVien/Phạm Xuân Trọng.jpg",
      hobbies: "Game, bạn bè cùng nhau",
      message: "Tuổi xuân của chúng ta là những cơn mưa rào chẳng sợ ướt áo. Sau này ra đời, mong cậu luôn trân trọng những giá trị cốt lõi, sống một đời nhiệt thành, không hối tiếc, không thở dài.",
    },
    {
      name: "Trần Bình Minh",
      nickname: "HSXS HOÁ",
      quote: "Hành trình vạn dặm luôn bắt đầu từ một bước chân.",
      img: "style/img/ThanhVien/Trần Bình Minh.jpg",
      hobbies: "Hoá học, khoa học tự nhiên",
      message: "Khép lại cánh cửa trung học là mở ra muôn vàn những chân trời mới. Giống như cái tên của cậu, chúc mọi khởi đầu của cậu đều ngập tràn ánh sáng hy vọng và những điều tốt đẹp nhất.",
    },
    {
      name: "Trần Khải Hoàn",
      nickname: "Chị đại",
      quote: "Cuộc sống không phải là quá trình đi tìm bản thân mình. Cuộc sống là quá trình tự kiến tạo nên chính mình.",
      img: "style/img/ThanhVien/Trần Khải Hoàn.jpg",
      hobbies: "Men, Lịch sử",
      message: "Đường xa vạn dặm bắt đầu từ một bước chân. Dù sau này cậu đi đâu, làm gì, tớ vẫn luôn tin cậu sẽ mang về những chiến thắng rực rỡ. Chúc cậu một đời khúc ca khải hoàn luôn vang vọng.",
    },
    {
      name: "Trần Văn Nhật Quang",
      nickname: "7.5 ielts",
      quote: "Thời gian của bạn là hữu hạn, đừng lãng phí nó để sống cuộc đời của người khác.",
      img: "style/img/ThanhVien/Trần Văn Nhật Quang.jpg",
      hobbies: "Ngoại ngữ, Chơi Game",
      message: "Hãy sống như đóa hướng dương, luôn hướng về phía mặt trời thì bóng tối sẽ ngả về sau lưng cậu. Chúc cậu mang ánh sáng của sự tử tế và ấm áp lan tỏa đến mọi nơi cậu đặt chân tới.",
    },
    {
      name: "Vũ Khánh Huyền",
      nickname: "Huyền",
      quote: "Tương lai thuộc về những ai tin vào vẻ đẹp trong những giấc mơ của mình.",
      img: "style/img/ThanhVien/Vũ Khánh Huyền.jpg",
      hobbies: "Viết lách, Piano",
      message: "Có những tháng năm trôi qua kẽ tay nhẹ như một tiếng thở dài, nhưng lại in sâu vào tâm trí mãi mãi. Chúc cậu giữ mãi nét huyền diệu của tuổi trẻ, sống một cuộc đời như một giấc mơ có thật, rực rỡ và an nhiên.",
    },
  ];

  let currentIndex = 0;
  let isShowingAll = false;

  function getInitialItemsCount() {
    return window.innerWidth <= 768 ? 3 : 6;
  }

  function createMemberCard(m) {
    const card = document.createElement("div");
    card.className = "member-card animate-up";
    card.innerHTML = `
            <div class="member-img-wrapper">
                <img src="${m.img}" alt="${m.name}" loading="lazy">
                <div class="member-overlay">
                    <p class="quote">"${m.quote}"</p>
                    <div class="view-more">Xem chi tiết <i class="fas fa-arrow-right"></i></div>
                </div>
            </div>
            <div class="member-info">
                <div class="name-container">
                    <h3 class="member-name">${m.name}</h3>
                    <h3 class="member-nickname">${m.nickname}</h3>
                </div>
            </div>
        `;
    card.addEventListener("click", () => openProfile(m));
    return card;
  }

  function renderMembers(count, isReset = false) {
    if (isReset) {
      memberGrid.innerHTML = "";
      currentIndex = 0;
      isShowingAll = false;
    }

    const nextItems = members.slice(currentIndex, currentIndex + count);
    nextItems.forEach((m) => {
      const card = createMemberCard(m);
      memberGrid.appendChild(card);
    });

    currentIndex += nextItems.length;
    const initialCount = getInitialItemsCount();
    if (members.length <= initialCount) {
      loadMoreBtn.style.display = "none";
    } else {
      loadMoreBtn.style.display = "inline-block";
      if (currentIndex >= members.length) {
        isShowingAll = true;
        loadMoreBtn.innerHTML = 'Ẩn bớt <i class="fas fa-chevron-up"></i>';
      } else {
        isShowingAll = false;
        loadMoreBtn.innerHTML = 'Xem thêm <i class="fas fa-chevron-down"></i>';
      }
    }
  }

  if (loadMoreBtn) {
    renderMembers(getInitialItemsCount());

    loadMoreBtn.addEventListener("click", () => {
      if (isShowingAll) {
        renderMembers(getInitialItemsCount(), true);
        const membersSection = document.getElementById("members");
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = membersSection.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      } else {
        renderMembers(3);
      }
    });
  }

  const profileModal = document.getElementById("profileModal");
  const closeProfile = document.querySelector(".close-profile");
  const modalCard = profileModal.querySelector(".modal-card");

  function openProfile(m) {
    document.getElementById("profileImg").src = m.img;
    document.getElementById("profileName").innerText = m.name;
    document.getElementById("profileNickname").innerText = m.nickname;
    document.getElementById("profileMessage").innerText = m.message;

    profileModal.style.display = "flex";
    setTimeout(() => modalCard.classList.add("show"), 10);
  }

  closeProfile.addEventListener("click", () => {
    modalCard.classList.remove("show");
    setTimeout(() => (profileModal.style.display = "none"), 300);
  });

  const galleryGrid = document.getElementById("galleryGrid");
  const galleryImages = [];
  const layoutClasses = ["", "wide", "tall", ""];

  for (let i = 1; i <= 54; i++) {
    const randomClass =
      layoutClasses[Math.floor(Math.random() * layoutClasses.length)];
    galleryImages.push({
      src: `style/img/AnhTapThe/Anh (${i}).jpg`,
      class: randomClass,
    });
  }

  galleryImages.forEach((img) => {
    const item = document.createElement("div");
    item.className = `gallery-item ${img.class}`;
    item.innerHTML = `<img src="${img.src}" alt="Gallery image" loading="lazy">`;
    item.addEventListener("click", () => openLightbox(img.src));
    galleryGrid.appendChild(item);
  });

  setInterval(() => {
    const grid = document.getElementById("galleryGrid");
    const items = document.querySelectorAll(".gallery-item");

    grid.style.opacity = "0";
    grid.style.transform = "scale(0.98)";
    grid.style.transition = "all 0.6s ease-in-out";

    setTimeout(() => {
      items.forEach((item) => {
        item.classList.remove("wide", "tall");
        const newLayout =
          layoutClasses[Math.floor(Math.random() * layoutClasses.length)];
        if (newLayout) item.classList.add(newLayout);
      });

      grid.style.opacity = "1";
      grid.style.transform = "scale(1)";
    }, 600); // Match this with the transition time
  }, 15000);

  // 6. Gallery Lightbox & Reactions
  const modal = document.getElementById("galleryModal");
  const modalImg = document.getElementById("modalImg");
  const closeModal = document.querySelector(".close-modal");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  let currentImgIndex = 0;

  function openLightbox(src) {
    currentImgIndex = galleryImages.findIndex((img) => img.src === src);
    updateModalImage();
    modal.style.display = "flex";
    document.body.style.overflow = "hidden"; // Prevent scrolling
  }

  function updateModalImage() {
    modalImg.style.opacity = "0";
    setTimeout(() => {
      modalImg.src = galleryImages[currentImgIndex].src;
      modalImg.style.opacity = "1";
    }, 150);
  }

  function showNext() {
    currentImgIndex = (currentImgIndex + 1) % galleryImages.length;
    updateModalImage();
  }

  function showPrev() {
    currentImgIndex =
      (currentImgIndex - 1 + galleryImages.length) % galleryImages.length;
    updateModalImage();
  }

  if (nextBtn)
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      showNext();
    });
  if (prevBtn)
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      showPrev();
    });

  closeModal.onclick = () => {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  };

  window.onclick = (e) => {
    if (e.target == modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
    if (e.target == profileModal) {
      modalCard.classList.remove("show");
      setTimeout(() => (profileModal.style.display = "none"), 300);
    }
  };

  // Reaction System
  const reactionItems = document.querySelectorAll(".reaction-item");
  let clickCounts = {};
  let holdTimers = {};

  reactionItems.forEach((item) => {
    const emoji = item.getAttribute("data-emoji");
    clickCounts[emoji] = 0;

    const startContinuousFloating = (x, y) => {
      // Initial one
      createFloatingEmoji(emoji, x, y);
      // Continuous
      item.floatInterval = setInterval(() => {
        createFloatingEmoji(emoji, x, y);
      }, 100);
    };

    const stopContinuousFloating = () => {
      clearInterval(item.floatInterval);
      clearTimeout(holdTimers[emoji]);
    };

    item.addEventListener("mousedown", (e) => {
      startContinuousFloating(e.clientX, e.clientY);

      // Rapid click logic
      clickCounts[emoji]++;
      if (clickCounts[emoji] >= 10) {
        createEmojiRain(emoji);
        clickCounts[emoji] = 0;
      }
      clearTimeout(item.clickTimeout);
      item.clickTimeout = setTimeout(() => {
        clickCounts[emoji] = 0;
      }, 2000);

      // Long press rain logic
      holdTimers[emoji] = setTimeout(() => {
        createEmojiRain(emoji);
      }, 800);
    });

    item.addEventListener("mouseup", stopContinuousFloating);
    item.addEventListener("mouseleave", stopContinuousFloating);

    // Touch support
    item.addEventListener("touchstart", (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      startContinuousFloating(touch.clientX, touch.clientY);
      holdTimers[emoji] = setTimeout(() => {
        createEmojiRain(emoji);
      }, 800);
    });
    item.addEventListener("touchend", stopContinuousFloating);
  });

  function createFloatingEmoji(emoji, x, y) {
    const span = document.createElement("span");
    span.innerText = emoji;
    span.className = "floating-emoji";
    span.style.left = x + "px";
    span.style.top = y + "px";
    span.style.setProperty("--random-x", Math.random() * 100 - 50 + "px");
    span.style.setProperty("--random-rotate", Math.random() * 40 - 20 + "deg");
    document.body.appendChild(span);
    setTimeout(() => span.remove(), 1500);
  }

  function createEmojiRain(emoji) {
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        const rain = document.createElement("span");
        rain.innerText = emoji;
        rain.className = "rain-emoji";
        rain.style.left = Math.random() * 100 + "vw";
        rain.style.animationDelay = Math.random() * 1.5 + "s";
        document.body.appendChild(rain);
        setTimeout(() => rain.remove(), 4000);
      }, i * 60);
    }
  }
  const stickyNotes = document.getElementById("stickyNotes");
  const loadMoreGuestbook = document.getElementById("loadMoreGuestbook");
  let guestbookData = [];
  let mobilePageIdx = 0;
  let isDesktopExpanded = false;
  let mobileInterval;

  function getGuestbookMode() {
    return window.innerWidth <= 768 ? "mobile" : "desktop";
  }

  function addNoteDOM(text, isNew = false) {
    const note = document.createElement("div");
    const randomColorIdx = Math.floor(Math.random() * 6) + 1;
    note.className = `sticky-note color-${randomColorIdx} note-appear`;

    let contentHTML = "";
    const trimmedText = text.trim();
    const lastDashIdx = trimmedText.lastIndexOf("-");

    if (lastDashIdx !== -1 && lastDashIdx > trimmedText.length - 25) {
      const content = trimmedText.substring(0, lastDashIdx).trim();
      const signature = trimmedText.substring(lastDashIdx + 1).trim();
      contentHTML = `<p>${content}</p><span class="signature">- ${signature}</span>`;
    } else {
      contentHTML = `<p>${trimmedText}</p>`;
    }

    note.innerHTML = `
            ${contentHTML}
            <i class="fas fa-thumbtack" style="position:absolute; top:10px; right:10px; color:rgba(0,0,0,0.1);"></i>
        `;
    const randomRotate = Math.floor(Math.random() * 20) - 10;
    note.style.transform = `rotate(${randomRotate}deg)`;

    if (isNew) stickyNotes.prepend(note);
    else stickyNotes.appendChild(note);
  }

  function renderGuestbook() {
    if (!stickyNotes) return;
    const mode = getGuestbookMode();
    stickyNotes.innerHTML = "";

    if (mode === "mobile") {
      stickyNotes.classList.remove("collapsed");
      const start = mobilePageIdx % guestbookData.length;
      const note1 = guestbookData[start];
      const note2 = guestbookData[(start + 1) % guestbookData.length];

      if (note1) addNoteDOM(note1);
      if (note2) addNoteDOM(note2);

      loadMoreGuestbook.innerHTML =
        'Thêm lời nhắn khác <i class="fas fa-sync"></i>';
    } else {
      guestbookData.forEach((text) => addNoteDOM(text));
      if (isDesktopExpanded) {
        stickyNotes.classList.remove("collapsed");
        loadMoreGuestbook.innerHTML =
          'Ẩn bớt lời nhắn <i class="fas fa-chevron-up"></i>';
      } else {
        stickyNotes.classList.add("collapsed");
        loadMoreGuestbook.innerHTML =
          'Xem thêm lời nhắn <i class="fas fa-chevron-down"></i>';
      }
    }
  }

  function startMobileCycle() {
    clearInterval(mobileInterval);
    if (getGuestbookMode() === "mobile") {
      mobileInterval = setInterval(() => {
        mobilePageIdx = (mobilePageIdx + 2) % guestbookData.length;
        renderGuestbook();
      }, 5000);
    }
  }

  fetch("style/guestbook.txt")
    .then((res) => res.text())
    .then((data) => {
      guestbookData = data
        .trim()
        .split("\n")
        .filter((line) => line.trim());
      renderGuestbook();
      startMobileCycle();
    })
    .catch((err) => console.error("Could not load guestbook.txt", err));

  window.addEventListener("resize", () => {
    renderGuestbook();
    startMobileCycle();
  });

  if (loadMoreGuestbook) {
    loadMoreGuestbook.addEventListener("click", () => {
      if (getGuestbookMode() === "mobile") {
        mobilePageIdx = (mobilePageIdx + 2) % guestbookData.length;
        renderGuestbook();
        startMobileCycle();
      } else {
        isDesktopExpanded = !isDesktopExpanded;
        renderGuestbook();
      }
    });
  }

  const musicMenu = document.getElementById("musicMenu");
  const musicModal = document.getElementById("musicModal");
  const closeMusic = document.querySelector(".close-music");
  const musicOptions = document.querySelectorAll(".music-option");
  const bgMusic = document.getElementById("bg-music");
  const musicOptionsArray = Array.from(musicOptions);
  let currentSongIdx = 0;

  function playSongAtIndex(index) {
    if (index < 0) index = musicOptionsArray.length - 1;
    if (index >= musicOptionsArray.length) index = 0;

    currentSongIdx = index;
    const option = musicOptionsArray[currentSongIdx];
    const src = option.getAttribute("data-src");
    const img = option.getAttribute("data-img");
    const title = option.querySelector("strong")
      ? option.querySelector("strong").innerText
      : "";

    const currentAlbumArt = document.getElementById("currentAlbumArt");
    const currentSongTitle = document.getElementById("currentSongTitle");
    const mainPlayBtn = document.getElementById("mainPlayBtn");

    musicOptionsArray.forEach((opt) => opt.classList.remove("active"));
    option.classList.add("active");

    bgMusic.src = src;
    bgMusic
      .play()
      .then(() => {
        musicModal.classList.add("playing");
        mainPlayBtn.className = "fas fa-pause";
      })
      .catch((e) => console.log("Playback error:", e));

    if (currentAlbumArt && img) currentAlbumArt.src = img;
    if (currentSongTitle) {
      currentSongTitle.innerText = title;
      currentSongTitle.style.animation = "none";
      currentSongTitle.offsetHeight;
      currentSongTitle.style.animation = "";
    }
  }

  if (musicMenu) {
    musicMenu.addEventListener("click", () => {
      const card = musicModal.querySelector(".modal-card");
      musicModal.style.display = "flex";
      setTimeout(() => card.classList.add("show"), 10);
    });
  }

  if (closeMusic) {
    closeMusic.addEventListener("click", () => {
      const card = musicModal.querySelector(".modal-card");
      card.classList.remove("show");
      setTimeout(() => (musicModal.style.display = "none"), 300);
    });
  }

  musicOptionsArray.forEach((option, index) => {
    option.addEventListener("click", () => {
      playSongAtIndex(index);
    });
  });

  const mainPlayBtn = document.getElementById("mainPlayBtn");
  if (mainPlayBtn) {
    mainPlayBtn.addEventListener("click", () => {
      if (
        !bgMusic.src ||
        bgMusic.src === "" ||
        bgMusic.src.endsWith("index.html") ||
        bgMusic.getAttribute("src") === null
      ) {
        playSongAtIndex(0);
        return;
      }

      if (bgMusic.paused) {
        bgMusic.play().then(() => {
          musicModal.classList.add("playing");
          mainPlayBtn.className = "fas fa-pause";
        });
      } else {
        bgMusic.pause();
        musicModal.classList.remove("playing");
        mainPlayBtn.className = "fas fa-play";
      }
    });
  }

  const prevSongBtn = document.getElementById("prevSongBtn");
  if (bgMusic) {
    bgMusic.addEventListener("ended", () => {
      playSongAtIndex(currentSongIdx + 1);
    });
  }

  const nextSongBtn = document.getElementById("nextSongBtn");

  if (prevSongBtn) {
    prevSongBtn.addEventListener("click", () => {
      playSongAtIndex(currentSongIdx - 1);
    });
  }

  if (nextSongBtn) {
    nextSongBtn.addEventListener("click", () => {
      playSongAtIndex(currentSongIdx + 1);
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === musicModal) {
      const card = musicModal.querySelector(".modal-card");
      card.classList.remove("show");
      setTimeout(() => (musicModal.style.display = "none"), 300);
    }
  });

// PARALLAX TIMELINE 
  const timelineList = document.getElementById("timelineList");
  const loadMoreTimeline = document.getElementById("loadMoreTimeline");
  const timelineBg = document.getElementById("timelineBg");
  let timelineData = [];
  let displayedTimelineCount = 0;

  // Danh sách ảnh sẽ làm Background thay đổi tuần tự (Bạn có thể đổi số tùy ý)
  // Tự động nạp toàn bộ 54 ảnh nền để thay đổi tuần tự
  const timelineBgs = [];
  for (let i = 1; i <= 54; i++) {
      timelineBgs.push(`style/img/AnhTapThe/Anh (${i}).jpg`);
  }

  // Khởi tạo công cụ theo dõi (Observer) để biết khi nào người dùng cuộn tới Card nào
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Khi 60% diện tích của Card Ký Ức lọt vào màn hình
      if (entry.isIntersecting) {
        // 1. Cho card hiện ra (Fade-in)
        entry.target.classList.add("visible");
        
        // 2. Lấy link ảnh được gán lén vào card và thay đổi Background nền lớn
        const bgUrl = entry.target.getAttribute("data-bg");
        if (bgUrl && timelineBg) {
            timelineBg.style.backgroundImage = `url('${bgUrl}')`;
        }
      }
    });
  }, { threshold: 0.6 });

  function renderTimelineChunk(count) {
    const nextItems = timelineData.slice(
      displayedTimelineCount,
      displayedTimelineCount + count
    );

    nextItems.forEach((itemData, index) => {
      const actualIndex = displayedTimelineCount + index;
      const item = document.createElement("div");
      
      // Chia trái/phải và gán link ảnh làm data ngầm định
      item.className = `timeline-item ${actualIndex % 2 === 0 ? "left" : "right"}`;
      const bgIndex = actualIndex % timelineBgs.length;
      item.setAttribute("data-bg", timelineBgs[bgIndex]);

      item.innerHTML = `
          <div class="timeline-dot"></div>
          <div class="timeline-card glass-card">
              <span class="date">${itemData.date}</span>
              <h3>${itemData.title}</h3>
              <p>${itemData.desc}</p>
          </div>
      `;
      timelineList.appendChild(item);
      
      // Bắt đầu theo dõi Card này khi cuộn
      timelineObserver.observe(item);
    });

    // Cài đặt ảnh nền mặc định lúc mới tải trang
    if (displayedTimelineCount === 0 && nextItems.length > 0) {
        timelineBg.style.backgroundImage = `url('${timelineBgs[0]}')`;
    }

    displayedTimelineCount += nextItems.length;
    if (displayedTimelineCount >= timelineData.length) {
      loadMoreTimeline.style.display = "none";
    }
  }

  if (timelineList) {
    // Tạo đường kẻ dọc chính giữa
    const line = document.createElement("div");
    line.className = "timeline-line";
    timelineList.appendChild(line);

    fetch("style/timeline.txt")
      .then((res) => res.text())
      .then((data) => {
        const lines = data.trim().split("\n");
        timelineData = lines
          .map((line) => {
            // Loại bỏ nếu có và tách chuỗi
            let cleanLine = line.replace(/\\s*/g, '').trim();
            const parts = cleanLine.split("|").map((p) => p.trim());
            return parts.length >= 3
              ? { date: parts[0], title: parts[1], desc: parts[2] }
              : null;
          })
          .filter((i) => i);

        renderTimelineChunk(4); // Load 4 sự kiện đầu tiên
      })
      .catch((err) => console.error("Could not load timeline.txt", err));

    loadMoreTimeline.addEventListener("click", () => {
      renderTimelineChunk(4);
    });
  }

  function createParticle() {
    const hero = document.getElementById("home");
    if (!hero) return;
    const particle = document.createElement("div");
    particle.style.position = "absolute";
    particle.style.background = "rgba(255, 255, 255, 0.4)";
    particle.style.width = Math.random() * 4 + "px";
    particle.style.height = particle.style.width;
    particle.style.borderRadius = "50%";
    particle.style.top = Math.random() * 100 + "%";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.zIndex = "1";
    particle.style.pointerEvents = "none";

    hero.appendChild(particle);

    const animation = particle.animate(
      [
        { transform: "translateY(0) translateX(0)", opacity: 0 },
        {
          transform: `translateY(-${Math.random() * 100}px) translateX(${Math.random() * 50 - 25}px)`,
          opacity: 0.8,
        },
        {
          transform: `translateY(-${Math.random() * 200}px) translateX(${Math.random() * 100 - 50}px)`,
          opacity: 0,
        },
      ],
      {
        duration: Math.random() * 3000 + 2000,
        easing: "linear",
      },
    );

    animation.onfinish = () => particle.remove();
  }

  setInterval(createParticle, 300);
  
  // Đặt mốc thời gian đích xác 5 năm sau tính từ 31/05/2026 -> Ngày 31 tháng 5 năm 2031
  const targetUnlockTime = new Date("May 31, 2031 00:00:00").getTime();

  const timeCapsuleTimer = setInterval(() => {
    const currentTime = new Date().getTime();
    const timeRemaining = targetUnlockTime - currentTime;

    // Xử lý toán học bóc tách Ngày, Giờ, Phút, Giây chuẩn xác
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    // Tìm các thẻ ID hiển thị ngoài màn hình
    const daysElement = document.getElementById("cd-days");
    const hoursElement = document.getElementById("cd-hours");
    const minutesElement = document.getElementById("cd-minutes");
    const secondsElement = document.getElementById("cd-seconds");

    // Nếu tìm thấy thẻ, đổ số vào và tự thêm số "0" phía trước nếu số chỉ có 1 chữ số
    if (daysElement) daysElement.innerText = days < 10 ? "0" + days : days;
    if (hoursElement) hoursElement.innerText = hours < 10 ? "0" + hours : hours;
    if (minutesElement) minutesElement.innerText = minutes < 10 ? "0" + minutes : minutes;
    if (secondsElement) secondsElement.innerText = seconds < 10 ? "0" + seconds : seconds;

    // KỊCH BẢN KHI ĐỦ 5 NĂM (Thời gian còn lại bé hơn hoặc bằng 0)
    if (timeRemaining <= 0) {
      clearInterval(timeCapsuleTimer); // Dừng bộ đếm ngược chạy ngầm để tiết kiệm RAM

      const lockedBox = document.getElementById("capsuleLocked");
      const unlockedBox = document.getElementById("capsuleUnlocked");

      // Giấu hộp khóa đếm ngược đi và kích hoạt hiển thị video bí mật
      if (lockedBox) lockedBox.style.display = "none";
      if (unlockedBox) unlockedBox.style.display = "block";
    }
  }, 1000); // Lặp lại kiểm tra liên tục sau mỗi 1000 mili-giây (1 giây)
  // ================= QUIZ MINI GAME LOGIC =================
  const quizData = [
    { q: 'Ai là GVCN năm lớp 8 của A12 với biệt danh vô cùng "đồ sộ" và đáng yêu là "Thầy Voi"?', options: ['Thầy Quang Thạch', 'Cô Mỹ Dung', 'Cô Thu Thủy', 'Có thầy này nữa hả ta? Cứu tui với!'], ans: 0 },
    { q: 'Đâu là cô giáo chủ nhiệm đầu tiên đặt nền móng và dìu dắt A12 vào năm học lớp 7 đầy bỡ ngỡ?', options: ['Cô Mỹ Dung', 'Cô Thu Thủy', '[Điền tên một học sinh để lừa]', 'Ủa lớp 7 có đi học hả? Sao tui không nhớ gì!'], ans: 1 },
    { q: 'Người đã đồng hành cùng A12 vượt qua năm học cuối cấp lớp 9 đầy giông bão, thi cử áp lực là ai?', options: ['Cô Mỹ Dung', 'Cô Thu Thủy', 'Thầy Quang Thạch', 'Giờ hỏi tên GVCN lớp 9 là một hệ tâm linh rồi...'], ans: 0 },
    { q: 'Ai là "chiến thần ngủ gật", coi bàn học giờ Toán như chiếc giường King-size êm ái nhất quả đất?', options: ['Đông Quân', 'Bảo Nam', 'Hoàng Anh', 'Đứa nào cũng ngủ gật như nhau, hỏi câu này trầm cảm quá!'], ans: 3 },
    { q: 'Thành viên nào trong lớp có cái tên mang ý nghĩa là "khởi đầu của ánh sáng mặt trời và những điều tốt đẹp nhất"?', options: ['Nhật Quang', 'Bình Minh', 'Đông Quân', 'Nghe tên thấy thơ mộng quá mà đầu tui thì trống rỗng'], ans: 1 },
    { q: 'Bạn học nào sinh ra đã mang định mệnh của sự chiến thắng, với cái tên là "khúc ca khải hoàn"?', options: ['Hoàng Cung', 'Khải Hoàn', 'Quang Chánh', 'Tên gì nghe sang dữ thần, nhưng tui không biết ai đâu á.'], ans: 1 },
    { q: '"Đóa hoa Quỳnh chỉ nở rộ vào ban đêm, tỏa hương tĩnh lặng mà nồng nàn" là câu lưu bút miêu tả về ai?', options: ['Huỳnh Quỳnh', 'Cát Hồng', 'Thảo Nguyên', 'Ủa hoa quỳnh là hoa gì dợ? Tui chỉ biết hoa "ăn học" thôi.'], ans: 0 },
    { q: 'Đâu là cặp đôi "kề vai áp cánh" gây nhiều nghi án tình cảm hoặc "thuyền" được chèo nhiệt tình nhất A12?', options: ['Cát Hồng & Gia Huy', 'Bảo Ngân & Hoàng Cung', 'Chánh & Minh Anh', 'OTP này tui không dám chèo, sợ lật thuyền bay màu lắm.'], ans: 2 },
    { q: '"Chúa tể ăn vụng" bất chấp giờ ra chơi hay giờ học, tốc độ nhai và tẩu tán tang vật nhanh hơn tốc độ ánh sáng?', options: ['Chí Thành', 'Đông Quân', 'Chánh', 'Nhìn quanh ai cái mỏ cũng nhai nhồm nhoàm, chịu chết!'], ans: 0 },
    { q: 'Ai là "mỏ neo nhạy cảm", người dễ rơi nước mắt nhất mỗi khi lớp có sự kiện cảm động, xem clip kỷ niệm hoặc chia tay?', options: ['Minh Anh', 'Cát Hồng', 'Hoàng Cung', 'Tâm hồn sỏi đá như tui làm sao cảm nhận được giọt nước mắt rơi.'], ans: 1 },
    { q: 'Người nắm giữ kỷ lục "vua đi trễ", luôn xuất hiện đúng lúc tiếng trống trường vừa dứt?', options: ['Song Thư', 'Tường An', 'Đông Quân', 'Tui lo chạy muốn chết có rảnh đâu mà canh đứa nào trễ nhất!'], ans: 0 },
    { q: '"Phao cứu sinh quốc dân" của lớp mỗi sáng sớm trước giờ truy bài là ai? (Người mà cả lớp xếp hàng mượn vở)', options: ['Bảo Ngân', 'Bình Minh', 'Minh Anh', 'Sáng nào tui cũng lo mượn chứ có kịp nhìn xem nguồn gốc từ đâu ra đâu.'], ans: 1 },
    { q: '"Cái loa phát thanh" của A12, chỉ cần bạn ấy cất tiếng là cả dãy hành lang đều phải ngoảnh lại nhìn?', options: ['Chánh', 'Song Thư', 'Huy Quỳnh', 'Tai tui điếc luôn rồi, không nghe không thấy không biết nha!'], ans: 2 },
    { q: '"Nghệ sĩ hài nhân dân" chuyên phát ngôn ra những câu vô tri hoặc làm trò hề xả stress cực mạnh?', options: ['Nhật Quang', 'Minh Khôi', 'Minh Anh', 'Câu này hề quá, tế nhị quá tui xin đầu hàng!'], ans: 0 },
    { q: 'Ai là "ông hoàng visual/bà chúa điệu đà" luôn chăm chút cho đầu tóc, quần áo chuẩn chỉnh chỉnh chu nhất lớp?', options: ['Đông Quân', 'Huy Quỳnh', 'Chí Thành', 'Ai cũng lộng lẫy kiêu sa trừ tui ra, chịu nha!'], ans: 1 },
    { q: 'Kẻ chuyên đi mượn bút, mượn thước, máy tính rồi "bốc hơi" luôn không thấy ngày trả lại là ai?', options: ['Nhật Quang', 'Chánh', 'Hoàng Anh', 'Hỏi vậy rồi sao đứa lấy dám trả, tui chọn im lặng là vàng!'], ans: 3 },
    { q: '"Chiến thần trực nhật" có tâm nhất hệ mặt trời, lau bảng sạch bóng không tì vết?', options: ['Bình Minh', 'Gia Huy', 'Minh Anh', 'Tui toàn trốn trực nhật nên tui không biết ai chăm đâu!'], ans: 2 },
    { q: 'Bạn thuộc hệ "hướng nội full-time", không nói câu nào nhưng cứ thi là điểm cao ngất ngưởng làm ai cũng sốc?', options: ['Khánh Châu', 'Cát Hồng', 'Minh Anh', 'Đã bảo hướng nội rồi sao tui biết được mà trả lời!'], ans: 0 },
    { q: '"Hãy sống như đóa hướng dương, luôn hướng về phía mặt trời..." là lời chúc dành cho bạn nào?', options: ['Nhật Quang', 'Đông Quân', 'Gia Huy', 'Thôi xin đầu hàng, học văn dốt lắm nghe thơ xong muốn xỉu ngang.'], ans: 0 },
    { q: '"KOL ngầm" của lớp, sở hữu MXH nhiều follow nhất hoặc suốt ngày rủ cả lớp quay TikTok?', options: ['Nhật Hoàng', 'Huy Quỳnh', 'Chí Thành', 'Tui tối cổ lắm, không theo kịp trào lưu đâu cứu tui.'], ans: 1 },
    { q: 'Tại sao Thầy Quang Thạch (lớp 8) lại có biệt danh vô cùng đáng yêu là "Thầy Voi"?', options: ['Vì thầy có vóc dáng cao lớn và uy nghiêm', 'Vì thầy có thân hình mập mạp dễ thương', 'Vì thầy hay ăn nhiều đồ ăn và thích du lịch', 'Câu này chỉ có thầy biết chứ học trò tụi em chịu cứng!'], ans: 1 },
    { q: 'Hình phạt "đặc sản" hoặc câu nói cửa miệng huyền thoại của cô Mỹ Dung mỗi khi lớp A12 ồn ào là gì?', options: ['“Ra đây cô nói chuyện…”', 'Cô chưa bao giờ phạt tôi kkkk', 'Một câu trích dẫn văn học nào đó', 'Nhắc tới là rén ngang, thôi chọn phương án này cho an toàn.'], ans: 0 },
    { q: 'Nếu tính cả 26 học sinh và 3 thầy cô giáo chủ nhiệm qua các năm, tổng số thành viên của gia đình A12 là?', options: ['28 thành viên', '29 thành viên', '31 thành viên', '33 thành viên'], ans: 3 },
    { q: 'Câu lưu bút: “Mong bạn sau này chẳng cần ai định nghĩa mới biết mình là ai...” là của bạn nào?', options: ['Bảo Nhân', 'Đông Quân', 'Tường An', 'Lưu bút của ai nấy giữ, tui hổng biết đâu nha!'], ans: 1 },
    { q: 'Lời chúc mở đầu đầy hoài niệm: "Thanh xuân của chúng ta cất gọn trong ngăn bàn đầy bụi phấn..." là của ai?', options: ['Chí Thành', 'Hoàng Anh', 'Bảo Nam', 'Cứu tui, trí nhớ 3 giây không nhớ nổi ai viết hết trơn!'], ans: 0 }
  ];

  let currentQIndex = 0;
  let score = 0;
  let wrongList = [];
  let isAnswering = false; // Chống click đúp

  const quizIntro = document.getElementById("quizIntro");
  const quizContainer = document.getElementById("quizContainer");
  const resultContainer = document.getElementById("resultContainer");
  const questionText = document.getElementById("questionText");
  const optionsContainer = document.getElementById("optionsContainer");
  const questionCounter = document.getElementById("questionCounter");
  const scoreTracker = document.getElementById("scoreTracker");

  // Âm thanh Game (Sử dụng 2 file audio đã có sẵn)
  const soundCorrect = new Audio("style/question/correct.mp3");
  const soundWrong = new Audio("style/question/wrong.mp3");

  document.getElementById("startQuizBtn")?.addEventListener("click", () => {
      quizIntro.style.display = "none";
      quizContainer.style.display = "block";
      loadQuestion();
  });

  function loadQuestion() {
      isAnswering = false;
      const qData = quizData[currentQIndex];
      questionCounter.innerText = `Câu ${currentQIndex + 1}/25`;
      scoreTracker.innerText = `Điểm: ${score}`;
      questionText.innerText = qData.q;
      optionsContainer.innerHTML = '';

      qData.options.forEach((opt, index) => {
          const btn = document.createElement("button");
          btn.className = "option-btn";
          // Render theo format A. B. C. D.
          const labels = ['A', 'B', 'C', 'D'];
          btn.innerText = `${labels[index]}. ${opt}`;
          btn.onclick = () => handleAnswer(index, btn);
          optionsContainer.appendChild(btn);
      });
  }

  function handleAnswer(selectedIndex, btnElement) {
      if (isAnswering) return;
      isAnswering = true;
      const qData = quizData[currentQIndex];
      
      const allBtns = optionsContainer.querySelectorAll(".option-btn");
      const correctBtn = allBtns[qData.ans];

      if (selectedIndex === qData.ans) {
          // Đúng
          score++;
          btnElement.classList.add("correct-ans");
          soundCorrect.currentTime = 0;
          soundCorrect.play();
      } else {
          // Sai
          btnElement.classList.add("wrong-ans");
          correctBtn.classList.add("correct-ans"); // Nhá đèn xanh cho đáp án đúng
          wrongList.push({ q: qData.q, correctOpt: qData.options[qData.ans] });
          soundWrong.currentTime = 0;
          soundWrong.play();
      }
      
      scoreTracker.innerText = `Điểm: ${score}`;

      // Đợi 1.5 giây để nhìn kết quả rồi nhảy câu tiếp
      setTimeout(() => {
          currentQIndex++;
          if (currentQIndex < quizData.length) {
              loadQuestion();
          } else {
              showResults();
          }
      }, 1500);
  }

  function showResults() {
      quizContainer.style.display = "none";
      resultContainer.style.display = "block";
      document.getElementById("finalScoreText").innerText = `${score}/25`;
      
      // Xếp hạng Thần Thánh
      const rankEl = document.getElementById("rankTitle");
      if (score === 25) rankEl.innerText = "🏆 Gia Phả Sống Hệ VIP PRO của A12";
      else if (score >= 20) rankEl.innerText = "⚡ Chiến Thần TVA: Kẻ Nắm Giữ Dòng Thời Gian A12";
      else if (score >= 15) rankEl.innerText = "🎥 Camera Chạy Bằng Cơm Cấp Vũ Trụ";
      else if (score >= 10) rankEl.innerText = "😎 PHONG CÁCH PHONG CÁCH";
      else if (score >= 5) rankEl.innerText = "👌 Pha xử lý này CƠ BẢN";
      else rankEl.innerText = "🐔 non";

      // Hiển thị danh sách câu sai
      const wrongBlock = document.getElementById("wrongAnswersBlock");
      const wrongUl = document.getElementById("wrongAnswersList");
      wrongUl.innerHTML = '';
      
      if (wrongList.length === 0) {
          wrongBlock.style.display = "none";
      } else {
          wrongBlock.style.display = "block";
          wrongList.forEach(item => {
              const li = document.createElement("li");
              li.innerHTML = `<strong>Câu hỏi:</strong> ${item.q}<br><span style="color:#2ecc71;">=> Đáp án đúng: ${item.correctOpt}</span>`;
              wrongUl.appendChild(li);
          });
      }
  }

  document.getElementById("retryQuizBtn")?.addEventListener("click", () => {
      currentQIndex = 0;
      score = 0;
      wrongList = [];
      resultContainer.style.display = "none";
      quizContainer.style.display = "block";
      loadQuestion();
  });
  // LOGIC CHUYỂN ĐỔI SÁNG/TỐI
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const themeIcon = themeToggleBtn.querySelector("i");
  
  // Kiểm tra xem trước đó người dùng đã chọn chế độ nào chưa (Lưu trong LocalStorage)
  const currentSavedTheme = localStorage.getItem("a12-theme");

  // Nếu trước đó họ chọn Dark, thì kích hoạt ngay lập tức khi vào web
  if (currentSavedTheme === "dark") {
      document.body.setAttribute("data-theme", "dark");
      themeIcon.classList.replace("fa-moon", "fa-sun"); // Đổi icon thành Mặt trời
  }

  // Lắng nghe sự kiện click vào nút
  themeToggleBtn.addEventListener("click", () => {
      // Kiểm tra xem body đang có data-theme="dark" hay không
      const isDarkMode = document.body.getAttribute("data-theme") === "dark";

      if (isDarkMode) {
          // Đang là Tối -> Chuyển sang Sáng
          document.body.removeAttribute("data-theme");
          localStorage.setItem("a12-theme", "light"); // Lưu lại vào não trình duyệt
          themeIcon.style.transform = "rotate(-360deg)"; // Hiệu ứng xoay mượt
          setTimeout(() => {
              themeIcon.classList.replace("fa-sun", "fa-moon");
              themeIcon.style.transform = "rotate(0deg)";
          }, 150);
      } else {
          // Đang là Sáng -> Chuyển sang Tối
          document.body.setAttribute("data-theme", "dark");
          localStorage.setItem("a12-theme", "dark");
          themeIcon.style.transform = "rotate(360deg)";
          setTimeout(() => {
              themeIcon.classList.replace("fa-moon", "fa-sun");
              themeIcon.style.transform = "rotate(0deg)";
          }, 150);
      }
    // ==================== HỆ THỐNG FLIPBOOK ĐỘNG (BẢN VÁ LỖI KIẾN TRÚC) ====================
    // Vùng bảo vệ Try-Catch: Nếu Code này lỗi, website gốc của bạn VẪN SỐNG sót và bấm nút bình thường.
    try {
        const deskGrid = document.getElementById('deskGrid');
        const flipbookModal = document.getElementById('flipbookModal');
        const flipbookWrapper = document.getElementById('flipbookWrapper');
        const closeFlipbook = document.querySelector('.close-flipbook');
        
        let isBookLoading = false; // Khóa an toàn chống click bừa bãi

        const loadingText = document.createElement('div');
        loadingText.className = 'fb-loading';
        loadingText.innerText = 'Đang lục tìm ký ức...';
        if (flipbookModal) flipbookModal.appendChild(loadingText);

        const youthQuotes = [
            "Thanh xuân là cơn mưa rào, dẫu cảm lạnh vẫn muốn tắm lại lần nữa.",
            "Mỗi nụ cười ngày đó, giờ là kho báu vô giá.",
            "Năm tháng trôi qua, chỉ có ánh mắt ấy là không đổi thay.",
            "Tuổi 15 rực rỡ, ta đã có mọi thứ, kể cả sự ngây ngô.",
            "Cảm ơn vì đã xuất hiện trong thanh xuân của tôi.",
            "Góc sân trường ngày đó, còn vương mãi tiếng cười.",
            "Tạm biệt nhé, những ngày tháng vô lo vô nghĩ."
        ];

        // DEFENSIVE PROGRAMMING: Kiểm tra sinh tử của biến 'members'
        if (typeof members === 'undefined') {
            console.error("⚠️ Red Team System Guard: Biến 'members' chưa được khởi tạo! Hãy đảm bảo đoạn code này nằm DƯỚI đoạn định nghĩa danh sách học sinh.");
        } else if (deskGrid) {
            // Chỉ chạy tính năng này khi hệ thống gốc đã sẵn sàng
            const bookNames = members.map(m => m.name.split('-')[0].trim());

            bookNames.forEach(name => {
                const spine = document.createElement('div');
                spine.className = 'book-spine';
                spine.innerHTML = `<span>${name}</span>`;
                spine.onclick = () => {
                    if (!isBookLoading) openFlipbook(name); // Chỉ lật sách khi đã load xong quyển trước
                };
                deskGrid.appendChild(spine);
            });
        }

        // Kỹ thuật quét ảnh bất đồng bộ an toàn với bộ nhớ
        function probeImages(studentName) {
            return new Promise(resolve => {
                let validUrls = [];
                let index = 1;
                function checkNext() {
                    let img = new Image();
                    const url = `style/img/Bookmember/${studentName}/Anh (${index}).jpg`;
                    img.onload = () => { validUrls.push(url); index++; checkNext(); };
                    img.onerror = () => { 
                        img.src = ""; // Cắt stream ngay lập tức
                        img = null;   // Ép trình duyệt dọn rác, giải phóng RAM
                        resolve(validUrls); 
                    };
                    img.src = url;
                }
                checkNext();
            });
        }

        async function openFlipbook(studentName) {
            isBookLoading = true;
            if(flipbookModal) flipbookModal.style.display = 'flex';
            loadingText.style.display = 'block';
            if(flipbookWrapper) {
                flipbookWrapper.innerHTML = ''; 
                flipbookWrapper.style.transform = 'translateX(0)'; 
            }

            const imgUrls = await probeImages(studentName);
            loadingText.style.display = 'none';
            isBookLoading = false;

            if (imgUrls.length === 0) {
                if(flipbookWrapper) flipbookWrapper.innerHTML = `<div style="color:#fff; text-align:center; width:100%; margin-top:50%; font-family:'Inter', sans-serif;">Hòm thư của ${studentName} đang được số hóa...</div>`;
                return;
            }

            let totalPages = Math.ceil(imgUrls.length / 2) + 1; 
            let htmlContext = '';
            let zIndexCounter = totalPages;

            // Xây dựng trang Bìa
            htmlContext += `
                <div class="fb-page" style="z-index: ${zIndexCounter};" data-page="0">
                    <div class="fb-front fb-cover"><h2>${studentName}</h2></div>
                    <div class="fb-back">
                        <div class="fb-img-container"><img src="${imgUrls[0]}" alt="Kỷ niệm"></div>
                        <p class="fb-quote">"${youthQuotes[0 % youthQuotes.length]}"</p>
                    </div>
                </div>
            `;
            zIndexCounter--;

            // Xây dựng các trang ruột bên trong
            let imgIndex = 1;
            for (let i = 1; i < totalPages; i++) {
                const frontImg = imgUrls[imgIndex] ? `<div class="fb-img-container"><img src="${imgUrls[imgIndex]}" alt="Kỷ niệm"></div><p class="fb-quote">"${youthQuotes[imgIndex % youthQuotes.length]}"</p>` : '';
                imgIndex++;
                const backImg = imgUrls[imgIndex] ? `<div class="fb-img-container"><img src="${imgUrls[imgIndex]}" alt="Kỷ niệm"></div><p class="fb-quote">"${youthQuotes[imgIndex % youthQuotes.length]}"</p>` : '';
                imgIndex++;

                htmlContext += `
                    <div class="fb-page" style="z-index: ${zIndexCounter};" data-page="${i}">
                        <div class="fb-front">${frontImg}</div>
                        <div class="fb-back">${backImg}</div>
                    </div>
                `;
                zIndexCounter--;
            }

            if(flipbookWrapper) flipbookWrapper.innerHTML = htmlContext;

            // Thuật toán lật sách đa lớp
            const pages = document.querySelectorAll('.fb-page');
            let currentPage = 0;

            pages.forEach((page) => {
                page.addEventListener('click', function(e) {
                    const rect = this.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    if (clickX > rect.width / 2) {
                        if (currentPage < pages.length) {
                            pages[currentPage].classList.add('flipped');
                            pages[currentPage].style.zIndex = currentPage + 1;
                            currentPage++;
                            if(flipbookWrapper) flipbookWrapper.style.transform = `translateX(${rect.width / 2}px)`;
                        }
                    } else {
                        if (currentPage > 0) {
                            currentPage--;
                            pages[currentPage].classList.remove('flipped');
                            pages[currentPage].style.zIndex = pages.length - currentPage;
                            if(currentPage === 0 && flipbookWrapper) flipbookWrapper.style.transform = 'translateX(0)';
                        }
                    }
                });
            });
        }

        if (closeFlipbook) {
            closeFlipbook.addEventListener('click', () => {
                if(flipbookModal) flipbookModal.style.display = 'none';
                if(flipbookWrapper) flipbookWrapper.innerHTML = ''; // Đốt sách ngay khi đóng để xả RAM
            });
        }
    } catch (error) {
        console.error("⚠️ Red Team Guard đã cách ly thành công vùng lỗi Flipbook. Hệ thống chính vẫn hoạt động:", error);
    }
  });
});
