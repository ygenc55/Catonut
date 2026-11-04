# catonut.com vitrin sitesi

Ürünler `urunler.json` dosyasından okunur. "Satın Al" butonu ürünün Shopier sayfasına gider.

## Telefondan ürün ekleme / fiyat değiştirme
1. GitHub'da bu depoda `urunler.json` dosyasını açın, sağ üstteki kalem (Edit) simgesine basın.
2. Bir ürün bloğunu kopyalayıp altına yapıştırın, değerleri değiştirin (virgüllere dikkat).
   - `kod`: adres için kısa ad (Türkçe karakter ve boşluk yok), ör. `cig-findik-250g`
   - `ad`, `baslik`, `kisa`, `aciklama`: ürün metinleri
   - `fiyat` / `eski_fiyat`: sayı (ör. `389.90`); indirim yoksa `null`
   - `gorsel`: Shopier'deki ürün fotoğrafının adresi veya `img/urunler/` klasörüne yüklediğiniz dosya
   - `shopier_link`: Shopier'deki ürün sayfasının linki
   - `stokta`: `true` / `false`, `one_cikan`: ana sayfada öne çıksın mı
3. "Commit changes" deyin. 1-2 dakika içinde site güncellenir.
