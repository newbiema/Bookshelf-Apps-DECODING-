document.addEventListener("DOMContentLoaded", function () {
    const inputTitle = document.getElementById("inputTitle");
    const inputAuthor = document.getElementById("inputAuthor");
    const inputYear = document.getElementById("inputYear");
    const checkComplete = document.getElementById("inputComplete");
    const tombolSubmit = document.querySelector(".tombol");
    const textHeader = document.querySelector(".text-header");
  
    const listBuku = [];
    const RENDER_EVENT = "render-buku";
    const STORAGE_KEY = "BOOKSHELF_APPS";
  
    const submitForm = document.getElementById("formTambahBuku");
    submitForm.addEventListener("submit", function (event) {
      event.preventDefault();
  
      if (tombolSubmit.id == "") {
        tambahBuku();
      } else {
        ubahBuku(Number(tombolSubmit.id));
      }
      clearInputBuku();
    });
  
    const submitCari = document.getElementById("formCariBuku");
    submitCari.addEventListener("submit", function (event) {
      event.preventDefault();
      cariBuku();
    });
  
    const inputComplete = document.getElementById("inputComplete");
    inputComplete.addEventListener("input", function () {
      const isCheck = inputComplete.checked;
      const tombolSpan = document.querySelector(".tombol span");
      if (tombolSpan != null) {
        tombolSpan.innerText = isCheck ? "Selesai" : "Belum";
      }
    });
  
    document.addEventListener(RENDER_EVENT, function () {
      renderBuku(listBuku);
    });
  
    function renderBuku(objectBuku) {
      const rakSedangDibaca = document.getElementById("rakBukuSedangDibaca");
      rakSedangDibaca.innerHTML = "";
  
      const rakSelesaiDibaca = document.getElementById("rakBukuSelesaiDibaca");
      rakSelesaiDibaca.innerHTML = "";
  
      for (const buku of objectBuku) {
        const itemBuku = buatDataBuku(buku);
        if (buku.isComplete) {
          rakSelesaiDibaca.append(itemBuku);
        } else {
          rakSedangDibaca.append(itemBuku);
        }
      }
    }
  
    function tambahBuku() {
      const title = inputTitle.value;
      const author = inputAuthor.value;
      const year = Number(inputYear.value);
      const complete = checkComplete.checked;
      const idBuku = buatIdBuku();
      const objekBuku = buatObjekBuku(idBuku, title, author, year, complete);
  
      listBuku.push(objekBuku);
      document.dispatchEvent(new Event(RENDER_EVENT));
  
      simpanDataBuku();
    }
  
    function cariBuku() {
      const textCari = document.getElementById("inputCari");
      console.log(textCari.value);
      temukanDaftarBuku(textCari.value);
    }
  
    function ubahBuku(idBuku) {
      const targetBuku = temukanIndexBuku(idBuku);
  
      if (targetBuku === -1) return;
      listBuku[targetBuku].title = inputTitle.value;
      listBuku[targetBuku].author = inputAuthor.value;
      listBuku[targetBuku].year = Number(inputYear.value);
      listBuku[targetBuku].isComplete = checkComplete.checked;
      listBuku[targetBuku].id = idBuku;
  
      document.dispatchEvent(new Event(RENDER_EVENT));
  
      simpanDataBuku();
    }
  
    function formUbahBuku(objekBuku) {
      inputTitle.value = objekBuku.title;
      inputAuthor.value = objekBuku.author;
      inputYear.value = objekBuku.year;
      checkComplete.checked = objekBuku.isComplete;
  
      tombolSubmit.id = objekBuku.id;
      tombolSubmit.innerText = "Ubah Buku";
      textHeader.innerText = "Form Ubah Buku";
    }
  
    function clearInputBuku() {
      inputTitle.value = "";
      inputAuthor.value = "";
      inputYear.value = null;
      checkComplete.checked = false;
      tombolSubmit.id = "";
      tombolSubmit.innerHTML = "Masukkan Ke Rak <span>Sedang</span> Dibaca";
      textHeader.innerText = "Form Tambah Buku";
    }
  
    function buatIdBuku() {
      return +new Date();
    }
  
    function buatObjekBuku(id, title, author, year, isComplete) {
      return { id, title, author, year, isComplete };
    }
  
    function buatElement(tag, text = "") {
      const el = document.createElement(tag);
      el.innerText = text;
      return el;
    }
  
    function buatDataBuku(objekBuku) {
      const itemBuku = buatElement("div");
      itemBuku.classList.add("buku");
      itemBuku.id = `buku-${objekBuku.id}`;
  
      const title = buatElement("div");
      title.classList.add("buku-title");
      const titleIkon = buatElement("span", "📘");
      const titleText = buatElement("h4", objekBuku.title);
      title.append(titleIkon, titleText);
  
      const author = buatElement("div");
      author.classList.add("buku-author");
      const authorIkon = buatElement("span", "🙍");
      const authorText = buatElement("p", objekBuku.author);
      author.append(authorIkon, authorText);
  
      const year = buatElement("div");
      year.classList.add("buku-year");
      const yearIkon = buatElement("span", "📅");
      const yearText = buatElement("p", objekBuku.year);
      year.append(yearIkon, yearText);
  
      const aksi = buatElement("div");
      buatMenuAksi(aksi, objekBuku.isComplete, objekBuku.id);
      aksi.classList.add("aksi");
  
      itemBuku.append(title, author, year, aksi);
      return itemBuku;
    }
  
    function buatMenuAksi(elAksi, complete, id) {
      if (complete) {
        const tombolEditBuku = buatElement("button", "✒️");
        tombolEditBuku.classList.add("tombol-aksi");
  
        tombolEditBuku.addEventListener("click", function () {
          pindahFormUbahBuku(id);
        });
  
        const tombolSedangDibaca = buatElement("button", "🔄");
        tombolSedangDibaca.classList.add("tombol-aksi");
  
        tombolSedangDibaca.addEventListener("click", function () {
          pindahRakSedangDibaca(id);
        });
  
        const tombolHapusBuku = buatElement("button", "🗑️");
        tombolHapusBuku.classList.add("tombol-aksi");
  
        tombolHapusBuku.addEventListener("click", function () {
          hapusDariRakBuku(id);
        });
  
        elAksi.append(tombolEditBuku, tombolSedangDibaca, tombolHapusBuku);
      } else {
        const tombolEditBuku = buatElement("button", "✒️");
        tombolEditBuku.classList.add("tombol-aksi");
  
        tombolEditBuku.addEventListener("click", function () {
          pindahFormUbahBuku(id);
        });
  
        const tombolTelahDibaca = buatElement("button", "✔️");
        tombolTelahDibaca.classList.add("tombol-aksi");
  
        tombolTelahDibaca.addEventListener("click", function () {
          pindahRakSelesaiDibaca(id);
        });
  
        const tombolHapusBuku = buatElement("button", "🗑️");
        tombolHapusBuku.classList.add("tombol-aksi");
  
        tombolHapusBuku.addEventListener("click", function () {
          hapusDariRakBuku(id);
        });
  
        elAksi.append(tombolEditBuku, tombolTelahDibaca, tombolHapusBuku);
      }
    }
  
    function pindahRakSelesaiDibaca(idBuku) {
      const targetBuku = temukanBuku(idBuku);
  
      targetBuku.isComplete = true;
      document.dispatchEvent(new Event(RENDER_EVENT));
  
      simpanDataBuku();
    }
  
    function pindahRakSedangDibaca(idBuku) {
      const targetBuku = temukanBuku(idBuku);
  
      targetBuku.isComplete = false;
      document.dispatchEvent(new Event(RENDER_EVENT));
  
      simpanDataBuku();
    }
  
    function hapusDariRakBuku(idBuku) {
      const targetBuku = temukanIndexBuku(idBuku);
      if (targetBuku === -1) return;
  
      listBuku.splice(targetBuku, 1);
      document.dispatchEvent(new Event(RENDER_EVENT));
  
      simpanDataBuku();
    }
  
    function pindahFormUbahBuku(idBuku) {
      const targetBuku = temukanBuku(idBuku);
      formUbahBuku(targetBuku);
    }
  
    function temukanBuku(idBuku) {
      for (const itemBuku of listBuku) {
        if (itemBuku.id === idBuku) {
          return itemBuku;
        }
      }
      return null;
    }
  
    function temukanIndexBuku(idBuku) {
      for (const indexBuku in listBuku) {
        if (listBuku[indexBuku].id === idBuku) {
          return indexBuku;
        }
      }
      return -1;
    }
  
    function temukanDaftarBuku(judulBuku) {
      const serializedData = localStorage.getItem(STORAGE_KEY);
      let data = JSON.parse(serializedData);
  
      if (data !== null) {
        renderBuku(
          data.filter((dt) =>
            dt.title.toLowerCase().includes(judulBuku.toLowerCase())
          )
        );
      }
    }
  
    function simpanDataBuku() {
      if (supotStorage()) {
        const parsed = JSON.stringify(listBuku);
        localStorage.setItem(STORAGE_KEY, parsed);
      }
    }
  
    function ambilDataBuku() {
      const serializedData = localStorage.getItem(STORAGE_KEY);
      let data = JSON.parse(serializedData);
  
      if (data !== null) {
        for (const buku of data) {
          listBuku.push(buku);
        }
      }
  
      document.dispatchEvent(new Event(RENDER_EVENT));
    }
  
    function supotStorage() /* boolean */ {
      if (typeof Storage === undefined) {
        alert("Browser kamu tidak mendukung local storage");
        return false;
      }
      return true;
    }
  
    if (supotStorage()) {
      ambilDataBuku();
    }
  });