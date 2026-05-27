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
      name: "GVCN Cô Dung",
      nickname: "Cô Dung",
      quote: "Hành trình bất khả thi nhất chính là hành trình mà bạn không bao giờ chịu bắt đầu!",
      img: "style/img/ThanhVien/GVCN Cô Dung.jpg",
      hobbies: "Dạy học, Văn chương",
      message: "A12 thương mến! Mới ngày nào cô còn nhìn thấy những gương mặt bỡ ngỡ bước vào lớp với biết bao ngại ngùng của tuổi học trò, vậy mà hôm nay các em đã đứng trước ngưỡng cửa của những chia xa và trưởng thành. Bốn năm trôi qua không quá dài, nhưng đủ để lưu giữ biết bao kỷ niệm: những giờ học đầy tiếng cười, những lần cùng nhau cố gắng, những buổi ôn thi mệt nhoài và cả những khoảnh khắc vô tư chỉ tuổi học trò mới có. Có lẽ sau này, giữa bộn bề cuộc sống, các em sẽ chẳng nhớ hết những bài học trên trang giấy, nhưng cô tin các em sẽ luôn nhớ về nhau, nhớ về lớp học nhỏ đã từng là thanh xuân đẹp nhất của mình. Tuổi mười lăm của các em đẹp như khoảng trời tháng năm trong veo, rực rỡ và chẳng thể quay lại lần thứ hai. Thanh xuân của các em đã đi qua dưới mái trường này bằng tất cả sự hồn nhiên, nhiệt thành và những ước mơ còn dang dở phía trước. Mai này, khi mỗi người đi về một hướng, cô mong các em vẫn giữ cho mình sự tử tế, lòng biết ơn và ánh mắt dịu dàng dành cho cuộc sống. Hãy sống như những đóa hoa biết hướng về phía mặt trời, dù có lúc phải đi qua những ngày mưa gió. Cô chúc A12 sẽ bước vào kỳ thi tuyển sinh 10 với tâm thế bình tĩnh, tự tin và vững vàng nhất. Mong rằng những ước mơ các em đang nâng niu hôm nay sẽ trở thành hiện thực trong một ngày không xa. Và dù mai này các em có trở thành ai, đi đến nơi nào, cô vẫn luôn hy vọng rằng: khi nhớ về mái trường này, các em sẽ mỉm cười vì đã từng có một thanh xuân thật đẹp. Chúc các em thi thật tốt, đi thật xa và luôn giữ trong tim mình ngọn lửa của tuổi trẻ. Thương mến và tin tưởng.",
    },
    {
      name: "Bùi Chí Thành",
      nickname: "Thành",
      quote: "Tất cả chúng ta đều đang nằm dưới rãnh nước, nhưng vài người trong số chúng ta vẫn đang ngước nhìn những vì sao.",
      img: "style/img/ThanhVien/Bùi Chí Thành.jpg",
      hobbies: "Cafe, nghe nhạc",
      message: "Thanh xuân của chúng ta cất gọn trong ngăn bàn đầy bụi phấn. Sau này ra biển lớn, mong cậu giữ mãi sự chân thành và nhiệt huyết của tuổi mười tám. Chúc cậu một đời bình an, điệu cười vẫn rạng rỡ như ngày thuở nào.”,
    },
    {
      name: "Chu Trịnh Gia Bảo",
      nickname: "Bảo",
      quote: "Không ai có thể làm cho bạn cảm thấy kém cỏi nếu không có sự cho phép của chính bạn.",
      img: "style/img/ThanhVien/Chu Trịnh Gia Bảo.jpg",
      hobbies: "Chơi Game, Nghe nhạc",
      message: "Có những người bạn, chỉ cần ngồi cạnh nhau chẳng nói gì cũng thấy lòng bình yên. Cảm ơn cậu vì đã là một phần thanh xuân rực rỡ nhất của tớ. Hãy cứ đi và khám phá thế giới, nhưng đừng quên lối về nhé.",
    },
    {
      name: "Hồ Minh Khôi",
      nickname: "Khôi",
      quote: "Hãy trở thành sự thay đổi mà bạn muốn nhìn thấy trên thế giới này.",
      img: "style/img/ThanhVien/Hồ Minh Khôi.jpg",
      hobbies: "Nấu ăn, Chơi game",
      message: "Chúng ta của sau này có thể có tất cả, nhưng sẽ không có chúng ta của năm tháng ấy. Mong cậu ở thế giới người lớn vẫn giữ được trái tim dũng cảm của một đứa trẻ. Chúc cậu dẫu đi qua bão giông vẫn luôn thấy cầu vồng.",
    },
    {
      name: "Hồ Tường An",
      nickname: "An",
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
      nickname: "Hồng",
      quote: "Hãy như nước, mềm mại lách qua những khe nứt. Đừng cứng nhắc, hãy dọn sạch tâm trí, tĩnh tại và linh hoạt như nước.",
      img: "style/img/ThanhVien/Huỳnh Thị Cát Hồng.jpg",
      hobbies: "Sách, âm nhạc, lịch sử",
      message: "Mỗi chúng ta đều là một vì sao độc nhất trên bầu trời. Đừng để bất kỳ ai làm lu mờ ánh sáng của cậu. Chúc cậu một đời tự do tự tại, xinh đẹp và tỏa sáng theo cách riêng của mình.",
    },
    {
      name: "Lâm Quang Chánh",
      nickname: "Chánh",
      quote: "Việc bạn đi chậm thế nào không quan trọng, miễn là bạn đừng bao giờ dừng lại..",
      img: "style/img/ThanhVien/Lâm Quang Chánh.jpg",
      hobbies: "Game, Du lịch",
      message: "Chuyến tàu mang tên thanh xuân không có vé khứ hồi, nhưng kỉ niệm thì luôn ở lại. Mai này dù cuộc sống có xô bồ, mong cậu vẫn giữ được sự ngay thẳng và trái tim ấm áp. Hẹn ngày gặp lại trên đỉnh vinh quang.",
    },
    {
      name: "Lê Thành Nhân",
      nickname: "Nhân",
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
      nickname: "Uyên",
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
      nickname: "Huy",
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
      nickname: "Quân",
      quote: "Điều quan trọng không phải là chuyện gì xảy ra với bạn, mà là cách bạn phản ứng với nó.",
      img: "style/img/ThanhVien/Nguyễn Vũ Đông Quân.jpg",
      hobbies: "Sáng tạo nội dung, Truyền cảm hứng",
      message: "Mong bạn sau này chẳng cần ai định nghĩa mới biết mình là ai. Mỗi ngã rẽ đều là một bài học để ta hiểu về bản thân mình sâu sắc hơn. Chúc hành trình phía trước của bạn luôn đầy bản lĩnh và ngập tràn cảm hứng.",
    },
    {
      name: "Phạm Trần Song Thư",
      nickname: "Thư",
      quote: "Thấu hiểu bản thân là khởi nguồn của mọi sự thông thái.",
      img: "style/img/ThanhVien/Phạm Trần Song Thư.jpg",
      hobbies: "Sách, âm nhạc",
      message: "Lưu bút viết rồi nét mực cũng phai, chỉ có tình bạn mười tám đôi mươi là còn in dấu mãi. Chúc cậu viết nên những trang sách cuộc đời thật đẹp, nơi nhân vật chính là cậu luôn dũng cảm và rạng ngời.",
    },
    {
      name: "Phạm Vũ Huy Quỳnh",
      nickname: "Quỳnh",
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
      nickname: "Trọng",
      quote: "Những gì rớt lại phía sau và những gì đang chờ phía trước đều vô cùng nhỏ bé so với những gì nằm bên trong chúng ta.",
      img: "style/img/ThanhVien/Phạm Xuân Trọng.jpg",
      hobbies: "Game, bạn bè cùng nhau",
      message: "Tuổi xuân của chúng ta là những cơn mưa rào chẳng sợ ướt áo. Sau này ra đời, mong cậu luôn trân trọng những giá trị cốt lõi, sống một đời nhiệt thành, không hối tiếc, không thở dài.",
    },
    {
      name: "Trần Bình Minh",
      nickname: "Minh",
      quote: "Hành trình vạn dặm luôn bắt đầu từ một bước chân.",
      img: "style/img/ThanhVien/Trần Bình Minh.jpg",
      hobbies: "Hoá học, khoa học tự nhiên",
      message: "Khép lại cánh cửa trung học là mở ra muôn vàn những chân trời mới. Giống như cái tên của cậu, chúc mọi khởi đầu của cậu đều ngập tràn ánh sáng hy vọng và những điều tốt đẹp nhất.",
    },
    {
      name: "Trần Khải Hoàn",
      nickname: "Hoàn",
      quote: "Cuộc sống không phải là quá trình đi tìm bản thân mình. Cuộc sống là quá trình tự kiến tạo nên chính mình.",
      img: "style/img/ThanhVien/Trần Khải Hoàn.jpg",
      hobbies: "Men, Lịch sử",
      message: "Đường xa vạn dặm bắt đầu từ một bước chân. Dù sau này cậu đi đâu, làm gì, tớ vẫn luôn tin cậu sẽ mang về những chiến thắng rực rỡ. Chúc cậu một đời khúc ca khải hoàn luôn vang vọng.",
    },
    {
      name: "Trần Văn Nhật Quang",
      nickname: "Quang",
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

  for (let i = 1; i <= 27; i++) {
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

  const timelineList = document.getElementById("timelineList");
  const loadMoreTimeline = document.getElementById("loadMoreTimeline");
  let timelineData = [];
  let displayedTimelineCount = 0;

  function renderTimelineChunk(count) {
    const nextItems = timelineData.slice(
      displayedTimelineCount,
      displayedTimelineCount + count,
    );
    nextItems.forEach((itemData, index) => {
      const actualIndex = displayedTimelineCount + index;
      const item = document.createElement("div");
      item.className = `timeline-item ${actualIndex % 2 === 0 ? "left" : "right"} animate-up`;
      item.innerHTML = `
                <div class="timeline-dot"></div>
                <div class="timeline-card">
                    <span class="date">${itemData.date}</span>
                    <h3>${itemData.title}</h3>
                    <p>${itemData.desc}</p>
                </div>
            `;
      timelineList.appendChild(item);
    });

    displayedTimelineCount += nextItems.length;
    if (displayedTimelineCount >= timelineData.length) {
      loadMoreTimeline.style.display = "none";
    }
  }

  if (timelineList) {
    fetch("style/timeline.txt")
      .then((res) => res.text())
      .then((data) => {
        const lines = data.trim().split("\n");
        timelineData = lines
          .map((line) => {
            const parts = line.split("|").map((p) => p.trim());
            return parts.length >= 3
              ? { date: parts[0], title: parts[1], desc: parts[2] }
              : null;
          })
          .filter((i) => i);

        renderTimelineChunk(4);
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
});
