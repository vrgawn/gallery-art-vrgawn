document.addEventListener("alpine:init", () => {
  Alpine.data("collections", () => ({
    items: [
      {
        id: 1,
        name: "Kaneki",
        img: "1.png",
        price: 90000,
        refrence: "Tokyo Ghoul",
      },
      { id: 2, name: "Random", img: "2.png", price: 50000, refrence: "Komik" },
      {
        id: 3,
        name: "Zenitsu",
        img: "3.png",
        price: 150000,
        refrence: "Demon Slayer",
      },
      {
        id: 4,
        name: "Sukuna",
        img: "4.png",
        price: 120000,
        refrence: "Jujutsu Kaisen",
      },
      {
        id: 5,
        name: "Arthur",
        img: "5.png",
        price: 75000,
        refrence: "The Beginning After The End",
      },
    ],
  }));

  Alpine.store("mark", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      // cek apakah da barangyang sama
      const cariItem = this.items.find((item) => item.id === newItem.id);

      // jika belum ada
      if (!cariItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        // jika barang sudah ada, cek apakah ada yang sama
        this.item = this.items.map((item) => {
          // jika barang berbeda
          if (item.id !== newItem.id) {
            return item;
          } else {
            // jika barang sudah ada, tambah quantity dan totalnya
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },
    remove(id) {
      // ambil item yang mau diremove berdasarkan id
      const markItem = this.items.find((item) => item.id === id);

      // jika item lebih dari 1
      if (markItem.quantity > 1) {
        // telusuri satu persatu
        this.items = this.items.map((item) => {
          // jika bukan barang yang diklik
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (markItem.quantity === 1) {
        // jika barangnya sisa 1
        this.items = this.items.filter((item) => item.id != id);
        this.quantity--;
        this.total -= markItem.price;
      }
    },
  });
});

// // form validation versi pak sandhika
// const checkoutButton = document.querySelector(".checkout-button");
// checkoutButton.disabled = true;

// const form = document.querySelector("#checkoutForm");

// form.addEventListener("keyup", function () {
//   for (let i = 0; i < form.elements.length; i++) {
//     if (form.elements[i].value.length !== 0) {
//       checkoutButton.classList.remove("disabled");
//       checkoutButton.classList.add("disabled");
//     } else {
//       return false;
//     }
//     // checkoutButton.disabled = false;
//     // checkoutButton.classList.remove("disabled");
//   }
//   checkoutButton.disabled = false;
//   checkoutButton.classList.remove("disabled");
// });

// form validation versi ai
const checkoutButton = document.querySelector(".checkout-button");
const form = document.querySelector("#checkoutForm");

// Initially disable the button
checkoutButton.disabled = true;
checkoutButton.classList.add("disabled");

// Function to check form validity
function checkFormValidity() {
  // Assume form is valid initially
  let isValid = true;

  // Loop through form elements and check if any field is empty
  for (let i = 0; i < form.elements.length; i++) {
    if (
      form.elements[i].type !== "submit" &&
      form.elements[i].value.trim() === ""
    ) {
      isValid = false;
      break;
    }
  }

  // Update button state based on form validity
  if (isValid) {
    checkoutButton.disabled = false;
    checkoutButton.classList.remove("disabled");
  } else {
    checkoutButton.disabled = true;
    checkoutButton.classList.add("disabled");
  }
}
// Add event listener to the form
form.addEventListener("keyup", checkFormValidity);

// Kirim data ketika tombol checkout diklik
checkoutButton.addEventListener("click", async function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);
  // const message = formatMessage(objData);
  // window.open("http://wa.me/6282131819088?text=" + encodeURIComponent(message));

  // minta transaction token menggunakan ajax
  try {
    const response = await fetch("php/placeOrder.php", {
      method: "POST",
      body: data,
    });
    const token = await response.text();
    window.snap.pay(token);
  } catch (err) {
    console.log(err.message);
  }
});

// format pesan ke whatsapp
const formatMessage = (obj) => {
  return `Data Customer
    Nama: ${obj.name}
    Email: ${obj.email}
    No HP: ${obj.phone}
  Data Pesanan: 
    ${JSON.parse(obj.items).map(
      (item) => `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n`
    )}
  TOTAL: ${rupiah(obj.total)}
    Terima Kasih.`;
};

// konvensi ke Rp
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
