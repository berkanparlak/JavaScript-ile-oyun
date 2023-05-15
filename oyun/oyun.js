var oyunAlani = document.getElementById("oyunAlani");
var oyuncu = document.getElementById("oyuncuImage");
var skor = document.getElementById("puan");
var oyunBitti = document.getElementById("gameOver");
var butonYenidenBasla = document.getElementById("butonYenidenBasla");
var rekor = document.getElementById("Rekor");

var oyunuSurdur = false;
var oyuncuX = 0;
var oyuncuHiz = 50;
var bombaBaslangicHiz = 5;
var bombaHiz = bombaBaslangicHiz;
var bombaEn = 50;
var bombalar = [];
var skor = 0;
var Rekor = 0;
var bombaOlusumHizi; //bomba olusum hizini ve bomba hizini tanimlamamizin sebebi oyun yeniden baslatıldiginda bu veriyi sifirlayarak oyunun en bastaki zorlukta baslamasını saglamak.
var bombaHizi;

function carpismaKontrol(kontrol1, kontrol2) {//carpisma kontrolu yapan fonksiyon donen degere gore oyunu bitiriyoruz
  var cisim1 = kontrol1.getBoundingClientRect();
  var cisim2 = kontrol2.getBoundingClientRect();

  return !(
    cisim1.right < cisim2.left ||//cisim1 ve cisim2 ye kus ve bombayi atadik. koordinatlarinin aynı yerde olup olmamasi durumuna gore True veya False degeri donuyor.
    cisim1.left > cisim2.right ||
    cisim1.bottom < cisim2.top ||
    cisim1.top > cisim2.bottom
  );
}

function Baslat() {//oyunu baslatma fonksiyonu bomba olusumu baslar ve oyunDongusu fonksiyonu cagrilir. oyunDongusu fonksiyonu oyun akisinin saglandı fonksiyon asagida aciklamasi yapildi
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

function oyunuBitir() {//kus ve bombanin koordinatlarinin aynı oldugu durumda cagrilan fonksiyon. oyun bitirlir, yeniden baslatma ekrani gelir en yuksek skor gecildiye yenilenir, skor sifirlanir,bomba hizlari sifirlanır.
  oyunuSurdur = false;
  oyunBitti.style.display = "block";
  if (skor > Rekor) {
    Rekor = skor;
    rekor.innerText = "En Yuksek Skor: " + Rekor;
  }
  skor = 0;
  skor.innerText = "Puan: " + skor;
  butonYenidenBasla.disabled = false;
  bombaHiz = bombaBaslangicHiz;
}
function restartGame() {//oyun bittip yeniden basla butonuna basildiginda cagrilan fonksiyon, bu fonksiyon ile bomba hizi,bomba olusum hizi oyuncu oyuncu konumu sifirlanir. Bombar dizisi sifirlanir ve baslat fonksiyonu cagrilarak oyun tekrar baslatilir
  bombaTemizle();
  oyuncu.style.left = "0";
  bombaHiz = bombaBaslangicHiz;
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


  var bombaResmi = document.createElement("img");
  bombaResmi.src = "images/2.png";
  bombaResmi.alt = "Bomba";
  bomba.appendChild(bombaResmi);

  oyunAlani.appendChild(bomba);
  bombalar.push(bomba);

  bombaHiz += 3 + skor / 10;  //SKOR ARTTIKCA BOMBA DUSME HIZI ARTIYOR

  
  if (bombaHiz > 30) {   //BELLI BIR HIZDAN SONRA OYUNUN HIZINI SABITLENIYOR
    bombaHiz = 30;
  }
}

function bombaHareketi() {//bomba hareketlerinin kontrol edildigi kisim.
  for (var i = 0; i < bombalar.length; i++) {
    var bomba = bombalar[i];//yeni bomba uretilir ve bomba dizisine aktarilir
    var bombaY = parseInt(bomba.style.top) + bombaHiz;//bombanin konumu hizina gore degisiyor.

    if (bombaY > oyunAlani.offsetHeight) {//bomba oyun alanindan ciktigi durum.
      bomba.parentNode.removeChild(bomba);//bomba dizisinden uretilen bomba cikariliyor.
      bombalar.splice(i, 1);//bomba siliniyor
      i--;
      skor++;//bomba silindikten sonra skor 1 artiyor.
      skor.innerText = "puan:" +skor;
    } else {//bombanin oyun alaninda oldugu durum
      bomba.style.top = bombaY + "px";
      if (carpismaKontrol(oyuncu, bomba)) {//carpisma kontrolu yapilarak oyunun devam edip etmeyecegi kontrol ediliyor
        oyunuBitir();//carpisma kontrol fonksiyonundan true degeri donerse oyun bitiriliyor.
        return;
      }
    }
  }
}

function bombaTemizle() { //oyunda uretilmis bomba dizisi temizlendi ve bomba hizi sifirlandı
  for (var i = 0; i < bombalar.length; i++) {
    bombalar[i].parentNode.removeChild(bombalar[i]);
  }
  bombalar = [];
  bombaHiz = bombaBaslangicHiz;
}

function oyunDongusu() {//oyunun ana akisini saglayan fonksiyon bomba hareketleri ve oyuncu hareketleri denetlenir.
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

  document.addEventListener("keydown", function (event) {//a ve d tuslarına hareketler atandı(capsLock acıksa hareketler gecersiz)
    if (event.key === "a" && oyuncuX > 0) {
      oyuncuX -= oyuncuHiz;
    } else if (
      event.key === "d" &&
      oyuncuX < oyunAlaniWidth - oyuncu.offsetWidth
    ) {
      oyuncuX += oyuncuHiz;
    }
    oyuncu.style.left = oyuncuX + "px";
  });
}

Baslat();

butonYenidenBasla.addEventListener("click", restartGame);
