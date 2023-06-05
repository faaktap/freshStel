<template>
<div class="backdrop">
  <div class="modal">
    I am a modal
  </div>
</div>
</template>

<script> (not really)
function toggleModal(e) {
    e.stopPropagation()
    backdrop.classList.toggle("active")
}
const backdrop = document.querySelector(".backdrop")
backdrop.addEventListener("click", toggleModal)
</script>

<style>
.backdrop {
  display: none;
  position: fixed;
  width:100vw;
  height:100vh;
  cursor:pointer;
  background:#00000088;
  top: 0;
}
.backdrop.active {
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  background: #ffffff;
  min-width:30vw;
  min-height: 30vh;
  cursor:initial;
}
</style>