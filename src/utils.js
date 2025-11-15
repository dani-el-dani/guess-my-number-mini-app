

export function getRandomNumber(numberOfDigits){
    const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    return digits.sort((a,b) =>{
        return Math.random() > 0.5 ? -1 : 1;
    }).slice(0,numberOfDigits)
}