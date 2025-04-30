document.addEventListener("DOMContentLoaded",function(){

    const numberInput = document.getElementById("numberInput");
    const checkButton = document.getElementById("checkButton");
    const resultMessage = document.getElementById("resultMessage");

    checkButton.addEventListener("click",function(){

        const number = parseInt(numberInput.value);
        
        if(isNaN(number)){
            resultMessage.textContent = "Please enter a valid number";
            resultMessage.style.color = "red";
            return;
        }    

        if(isPrime(number)){
            resultMessage.textContent = `${number} is a prime number`
            resultMessage.style.color = "green";
        }else{
            resultMessage.textContent = `${number} is not a prime number`
            resultMessage.style.color = "red";
        }


    });

    function isPrime(num){

        if (num <= 1) return false;
        if (num <=3) return true;

        if(num % 2 === 0 || num % 3 === 0) return false;

        return true;
    }


});