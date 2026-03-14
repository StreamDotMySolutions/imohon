# Kehendak Sistem Penjejakan Inventori

## Gambaran Keseluruhan
Sistem ini digunakan untuk mengurus inventori, permohonan item, proses kelulusan, pengagihan item, penghantaran, dan penerimaan oleh pengguna akhir. Sistem ini membantu setiap peranan menjalankan tugas masing-masing dengan jelas supaya stok sentiasa terkawal dan setiap tindakan boleh dijejaki.

Semua item diurus dalam unit. Setiap `Item` berada di bawah satu `ItemCategory`, dan aliran sistem bergerak dari `Request` hingga ke `DistributionAcceptance`.

## Peranan Dalam Sistem

### User
`User` membuat `Request` untuk item yang diperlukan. Dalam setiap permohonan, pengguna menyatakan item yang diminta, jenis permintaan seperti `NEW` atau `REPLACEMENT`, nama penerima, dan lokasi. Selepas penghantaran diterima, `User` juga membuat `DistributionAcceptance` untuk mengesahkan item yang diterima atau melaporkan isu.

### Manager
`Manager` menyemak `Request` daripada pengguna dalam jabatan yang sama. `Manager` boleh meluluskan atau menolak permohonan. Jika ditolak, pengguna perlu membuat `Request` baharu.

### Admin
`Admin` menyemak permohonan yang telah diluluskan oleh `Manager`. Selepas itu, `Admin` menyemak stok di warehouse sebelum membuat `Distribution`. `Admin` hanya boleh menghantar kuantiti item yang masih mencukupi berdasarkan baki sebenar stok. `Admin` juga mengurus `DistributionTravel` selepas kelulusan diterima.

### GeneralManager
`GeneralManager` menyemak `Distribution` yang dihantar oleh `Admin`. Peranan ini menentukan sama ada cadangan pengagihan boleh diteruskan atau ditolak. Jika ditolak, proses tersebut ditutup dan permohonan baharu perlu dibuat semula dari awal.

### Vendor
`Vendor` ialah pengguna luar yang membekalkan item kepada sistem. Vendor membekalkan item berdasarkan `ItemCategory` yang dibenarkan. Setiap vendor boleh mempunyai beberapa `Contract` untuk tempoh bekalan yang berbeza.

## Konsep Inventori
Stok dalam warehouse perlu sentiasa jelas sebelum `Distribution` dihantar untuk kelulusan. Sistem perlu memaparkan jumlah stok keseluruhan, item yang sedang dalam proses kelulusan, item yang sudah diluluskan untuk penghantaran, dan baki semasa.

Baki item dikira daripada jumlah stok ditolak item yang sudah diluluskan untuk delivery. Kuantiti baharu yang hendak dihantar oleh `Admin` tidak boleh melebihi baki ini. Sistem juga perlu menunjukkan item yang sedang dipohon untuk kelulusan supaya lebihan agihan tidak berlaku.

## Aliran Proses Sistem
1. `User` membuat `Request` untuk item yang diperlukan.
2. `Manager` menyemak dan meluluskan atau menolak `Request`.
3. `Admin` menyemak permohonan yang telah diluluskan.
4. `Admin` menyemak stok warehouse dan menyediakan `Distribution`.
5. `GeneralManager` menyemak `Distribution` tersebut.
6. Jika diluluskan, `Admin` membuat `DistributionTravel` dengan tarikh perjalanan dan tarikh jangkaan sampai.
7. `User` menerima item dan membuat `DistributionAcceptance`.
8. `User` boleh menerima semua item, menerima sebahagian item, atau melaporkan isu seperti `MISSING`, `DAMAGED`, atau `WRONG_ITEM`.
9. Selepas acceptance dihantar, proses ditutup.

Sistem juga membenarkan partial distribution jika stok tidak mencukupi, tetapi satu `Request` hanya boleh mempunyai satu cubaan `Distribution`.

## Aliran Vendor dan Contract
`Vendor` membekalkan item mengikut `ItemCategory` yang dibenarkan dalam sistem. Hubungan vendor dengan bekalan dikawal melalui `Contract`.

Setiap `Contract` menyimpan:
- tarikh mula
- tarikh tamat
- tarikh penghantaran
- rujukan warehouse atau lokasi penghantaran

Maklumat ini membantu sistem memahami tempoh bekalan vendor dan bila item dijangka sampai ke warehouse.

## Ringkasan
Sistem ini memastikan setiap peranan mempunyai tanggungjawab yang jelas dari permohonan hingga penerimaan item. Pada masa yang sama, sistem mengawal stok dengan ketat supaya `Distribution` tidak melebihi baki item yang benar-benar tersedia. Dengan cara ini, proses inventori menjadi lebih teratur, telus, dan mudah dipantau.
