function questionOne(arr) {
    let PrimeNumber = [];
    if(arr.length > 0){
        arr.filter((num) => {
            if(Number.isInteger(num) == true){
                let CheckPrime = true;
                if (num === 1 || num === 0 ) {
                    CheckPrime = false;   
                }else if (num > 1) {
                    for (let i = 2; i < num; i++) {
                        if (num % i == 0) {
                            CheckPrime = false; 
                            break;
                        }
                    }
                }else{
                    CheckPrime = false;
                }
                PrimeNumber.push(CheckPrime);
            }else{  
                console.log(Error('Please Enter Integer Values'));
            }
        });
    }else{
        console.log(Error("No Values Found"));
    }
    return PrimeNumber;
}

function questionTwo(startingNumber, commonRatio, numberOfTerms) {
    let sum = 0;
    if(numberOfTerms >= 0 && Number.isInteger(numberOfTerms) == true){
        if(startingNumber != 0 && commonRatio != 0){
            sum = startingNumber;
            for(let i=1;i<numberOfTerms;i++){
                let cSum = 1;
                for(let j=0; j<i;j++){
                    cSum = cSum * commonRatio;
                }
                sum += startingNumber * cSum;
            }
        }
    }else{
        sum = NaN;
    }
    return sum;
}

function questionThree(str) {
    const specialChars = `\`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`;
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    let mystr = str.replace(/\s+/g, '');
    let cnt = 0;
    if(mystr.length > 0){
        //Check for Consonants
        for(let i = 0;i < mystr.length; i++ ){
            let s = mystr[i];
            if(s != 'a' && s != 'e' && s != 'i' && s != 'o' && s != 'u' ){
                cnt++;
            }
            //Check for Special Characters
            specialChars.split('').some(specialChar => {
                if (s.includes(specialChar)) {
                    cnt--;
                }
            });
            //Check for Numbers
            numbers.some(num => {
                if (s.includes(num)) {
                    cnt--;
                }
            });
        }
    }
    return cnt;
}

function questionFour(fullString, substring) {
    let cnt = 0;
    if(typeof fullString == 'string' && typeof substring == 'string'){
        if(fullString.length > 0 && substring != ''){
            let Str = fullString.split(substring);
            cnt = Str.length - 1;
        }
    }else{
        console.log(Error("Please Enter String Value !"));
    }
    return cnt;
}

//TODO:  Change the values for firstName, lastName and studentId
module.exports = {
  firstName: 'SHUCHI',
  lastName: 'MEHTA',
  questionOne,
  questionTwo,
  questionThree,
  questionFour,
};
