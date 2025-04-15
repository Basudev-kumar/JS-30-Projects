const count = document.querySelector("p");
const input = document.querySelector("input");

input.addEventListener('keyup',()=>{
    count.innerHTML = input.value.length;
});