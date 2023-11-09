/*
 * Shuchi Paragbhai Mehta
 * CWID : 20009083
 */
import java.util.Arrays;

public class BinaryNumber {
   
	private int data[];
	private boolean overflow;
	
	/**
	* Constructor Method for creating a binary number of length and consisting only of zeros
	* @length To specify Length	 
	**/
    public BinaryNumber(int length){
    	if(length <= 0) 
    		throw new NumberFormatException("Length must be Positive integer Value. (> 0)");
    	
    	System.out.println("Binary number of given length consisting only of zeros : ");
        this.data = new int[length];
        for(int i = 0;i < length; i++){
            this.data[i] = 0;
            System.out.print(data[i]);
        }
    }
    
    /**
	* Constructor Method for creating a binary number given a string
	* @str String of Binary Number	 
	**/
    public BinaryNumber(String str){
    	System.out.println();
        this.data = new int[str.length()];
        String s1=str;
      
        try {
        	// Removing all 1's and 0's from the input to check the string only contains 1 and 0
        	String validateStr = s1.replaceAll("\\b[01]+\\b", "");
        	if (validateStr.length() == 0) {
        		for(int i = 0; i < this.data.length ; i++){
        			this.data[i] = Character.getNumericValue(str.charAt(i));
        		}
        	}
        	else {
        		throw new NumberFormatException();
        	}
        }
        catch(NumberFormatException m) {
        	System.out.println("Error, Unable to convert given string to binary number");
        }
    }
    
    /**
   	* Method for determining the length of a binary number
   	* @return length of Binary Number	 
   	**/
    public int getLength(){
        return this.data.length;
    }
    /**
   	* Method to obtain a digit of a binary number given an index
   	* @index For Index number
   	* @return Digit at Given Index	 
   	**/
    public int getDigit(int index){
    	if(index < 0) 
    		throw new NumberFormatException("Index must be Positive Integer Value.");
        return this.data[index];
    }
    /**
   	* Method to shift all digits in a binary number any number of places to the right
   	* @amount number of places to shift the number
   	**/
    public void shiftR(int amount){
    	//CopyOf always adds zeros to the right of the new array. Therefore we need to reverse it
        int newReversedData[] = Arrays.copyOf(this.data, this.getLength() + amount);
        int result[] = new int[newReversedData.length];
    	int j = newReversedData.length - 1;
        for( int i = 0; i < newReversedData.length ; i++ ) {
        	if(i<amount) {
	    		result[i] = newReversedData[j];
	    		j--;
        	}
        	if(i==amount) {
        		j=0;
        		result[i] = newReversedData[j];
        		j++;
        	}
        	if(i>amount) {
        		result[i] = newReversedData[j];
        		j++;
        	}
    		System.out.print(result[i]);
    	}
        
    }
    /**
   	* Method for adding two binary numbers
   	* @aBinaryNumber number to add with Current Binary Number
   	**/
    public void add(BinaryNumber aBinaryNumber) {
    	// ' == true ' is redundant, used for readability only
    	if(aBinaryNumber.getLength() != this.getLength()) {
    		System.out.println("Given binary numbers should be of equal length");
    	}
    	else if(aBinaryNumber.overflow == true || this.overflow == true) {
    		System.out.println("Cannot add numbers with overflow");
    	}
    	else {
    		int sumOfDigit = 0;
    		int CarriedDigit=0;
    		int newNumber[] = new int[this.getLength()];
    		for(int i = 0; i < this.getLength() ; i++ ) {
    			//Add carry if previous sum of digits was greater than 1
    			sumOfDigit = this.getDigit(i) + aBinaryNumber.getDigit(i) + (sumOfDigit > 1 ? 1 : 0);
    			//Getting remainder from dividing by 2 to convert to binary
    			newNumber[i] = sumOfDigit % 2;    			
    			if(sumOfDigit > 1) {
    				CarriedDigit = 1;
    			}else {
    				CarriedDigit = 0;
    			}
    		}    		
    		//Replacing current binary number with the sum
    		this.data = newNumber;
    		if( CarriedDigit > 0 ) {
    			this.overflow = true;
    		  	System.out.print("\n Result : " + toString());  
    		}else {  	
    			clearOverflow();
	        	System.out.print("\nAddition Result : " + toString());    		 
	        	System.out.print("\nResult in Decimal  : " + toDecimal());
    		}
    	}
    }
    /**
   	* Method for transforming a binary number to a String
   	* @return If overflow is true then OverFlow, Otherwise Binary Number as String	 
   	**/
    public String toString() {
    	if(this.overflow == true)
    		return "Overflow";
    	
    	String num = "";
    	for(int i = 0; i < this.getLength() ; i++) {
    		num += this.getDigit(i) + "";
    	}
    	return num;
    }
    /**
   	* Method for transforming a binary number to its decimal notation
   	* @return Transformed Decimal No.	 
   	**/
    public int toDecimal() {
    	int decimal = 0;    	
    	for(int i = 0; i < this.getLength() ; i++) {
    		//little-endian format
    		decimal += this.getDigit(i)* Math.pow(2, i);
    	}  
    	return decimal;    	
    }
    /**
   	* A Method that clears the overflow flag
   	**/
    public void clearOverflow() {
    	this.overflow = false;
    }
    
	/*
	 * Main Method 
	*/
    public static void main(String[] args) {    	
    	//Binary number of length length and consisting only of zeros 
    	BinaryNumber BinaryNumberLength= new BinaryNumber(5);    	
    	//Binary Number with String
		BinaryNumber BinaryNumberInString1= new BinaryNumber("10110");
		BinaryNumber BinaryNumberInString2= new BinaryNumber("11100"); 		
		//Length of BinaryNumberInString1
		System.out.println("The Length of the Binary number "+BinaryNumberInString1.toString()+" : "+BinaryNumberInString1.getLength());
		//Right Shifting of BinaryNumberInString1
		System.out.println("\nThe Right Shifting of number "+BinaryNumberInString1.toString()+" :");
		BinaryNumberInString1.shiftR(3);
		//Display Digit of BinaryNumberInString1 at specified Index 
		System.out.println("\n\nThe Digit at given index: "+BinaryNumberInString1.getDigit(1));
		//Conversion of Binary to Decimal 
		System.out.println("\n\nBinary number "+BinaryNumberInString1.toString()+" transformed to decimal : "+BinaryNumberInString1.toDecimal());		
		System.out.println("Binary number "+BinaryNumberInString2.toString()+" transformed to decimal : "+BinaryNumberInString2.toDecimal());
		//Addition Of BinaryNumberInString1 AND BinaryNumberInString2	    
		BinaryNumberInString1.add(BinaryNumberInString2);
    }
}