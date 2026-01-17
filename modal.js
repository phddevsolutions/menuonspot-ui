document.addEventListener("click", function (e) {
  if (e.target.classList.contains("item-img")) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");

    modalImg.src = e.target.src;
    modal.style.display = "flex";
  }

  if (e.target.classList.contains("close") || e.target.id === "imageModal") {
    document.getElementById("imageModal").style.display = "none";
  }
});