var oyunAlani = document.getElementById("oyunAlani");
var oyuncu = document.getElementById("oyuncuImage");
var skor = document.getElementById("puan");
var oyunBitti = document.getElementById("gameOver");
var butonYenidenBasla = document.getElementById("butonYenidenBasla");
var rekor = document.getElementById("Rekor");

var oyunuSurdur = false;
var oyuncuX = 0;
var oyuncuHiz = 10;
var bombaBaslangicHiz = 5;
var bombaHiz = bombaBaslangicHiz;
var bombaEn = 50;
var bombalar = [];
var skor = 0;
var Rekor = 0;
var bombaOlusumHizi; // Obstacle creation interval ID
var bombaHizi; // Obstacle movement interval ID

function carpismaKontrol(kontrol1, kontrol2) {
  var cisim1 = kontrol1.getBoundingClientRect();
  var cisim2 = kontrol2.getBoundingClientRect();

  return !(
    cisim1.right < cisim2.left ||
    cisim1.left > cisim2.right ||
    cisim1.bottom < cisim2.top ||
    cisim1.top > cisim2.bottom
  );
}

function Baslat() {
  oyunuSurdur = true;
  oyunAlani.style.display = "block";
  oyuncuX = oyunAlani.offsetWidth / 2 - oyuncu.offsetWidth / 2;
  oyuncu.style.left = oyuncuX + "px";
  skor = 0;
  skor.innerText = "Puan: " + skor;
  oyunBitti.style.display = "none";
  bombaOlustur();
  oyunDongusu();
}

function oyunuBitir() {
  oyunuSurdur = false;
  oyunBitti.style.display = "block";
  if (skor > Rekor) {
    Rekor = skor;
    rekor.innerText = "En Yüksek Skor: " + Rekor;
  }
  skor = 0;
  skor.innerText = "Puan: " + skor;
  butonYenidenBasla.disabled = false;
  bombaHiz = bombaBaslangicHiz;
}
function restartGame() {
  bombaTemizle();
  oyuncu.style.left = "0";
  bombaHiz = bombaBaslangicHiz; // Reset bomba speed
  Baslat();
  butonYenidenBasla.disabled = true;
  clearInterval(bombaOlusumHizi); // Stop bomba creation interval
  clearInterval(bombaHizi); // Stop bomba movement interval
}

function bombaOlustur() {
  var bomba = document.createElement("div");
  bomba.className = "bomba";
  bomba.style.left =
    Math.floor(Math.random() * (oyunAlani.offsetWidth - bombaEn)) + "px";
  bomba.style.top = "0";
   
  // Obstacle image
    var bombaResmi = document.createElement("img");
    bombaResmi.src = "images/2.png";
    bombaResmi.alt = "Obstacle";
    bomba.appendChild(bombaResmi);
  
    oyunAlani.appendChild(bomba);
    bombalar.push(bomba);
  oyunAlani.appendChild(bomba);
  bombalar.push(bomba);

  // Increase bomba speed as the skor increases
  bombaHiz += 0.2 + skor / 10;

  // Adjust bomba speed if it exceeds a certain limit
  if (bombaHiz > 15) {
    bombaHiz = 15;
  }
}

function bombaHareketi() {
  for (var i = 0; i < bombalar.length; i++) {
    var bomba = bombalar[i];
    var bombaY = parseInt(bomba.style.top) + bombaHiz;

    if (bombaY > oyunAlani.offsetHeight) {
      bomba.parentNode.removeChild(bomba);
      bombalar.splice(i, 1);
      i--;
      skor++;
      skor.innerText = "Puan: " + skor;
    } else {
      bomba.style.top = bombaY + "px";
      if (carpismaKontrol(oyuncu, bomba)) {
        oyunuBitir();
        return;
      }
    }
  }
}

function bombaTemizle() {
  for (var i = 0; i < bombalar.length; i++) {
    bombalar[i].parentNode.removeChild(bombalar[i]);
    }
    bombalar = [];
    bombaHiz = bombaBaslangicHiz; // Reset bomba speed
    }
    
    function oyunDongusu() {
    var oyunAlaniWidth = oyunAlani.offsetWidth;
    var bombaOlusunHizi = 2000;
    
    bombaOlusumHizi = setInterval(function () {
    if (oyunuSurdur) {
    bombaOlustur();
    }
    }, bombaOlusunHizi);
    
    bombaHizi = setInterval(function () {
    if (oyunuSurdur) {
      bombaHareketi();
    }
    }, 20);
    
    document.addEventListener("keydown", function (event) {
    if (event.key === "a" && oyuncuX > 0) {
    oyuncuX -= oyuncuHiz;
    } else if (event.key === "d" && oyuncuX < oyunAlaniWidth - oyuncu.offsetWidth) {
    oyuncuX += oyuncuHiz;
    }
    oyuncu.style.left = oyuncuX + "px";
    });
    }
    
    Baslat();
    
    butonYenidenBasla.addEventListener("click", restartGame);
