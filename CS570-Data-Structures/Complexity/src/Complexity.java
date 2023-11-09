/* SHUCHI PARAGBHAI MEHTA HW 2 */

public class Complexity {
	static int BASE = 2 ;
	static int METHOD_SIX_BASE = 2 ; //FOR METHOD 6
	static int cnt=0; //FOR METHOD 6
	
	public static void main(String[] args) {		
		method1(3);
		method2(2);
		method3(33);
		method4(8);
		method5(256);		
		System.out.println("\n#### Executing Method 6 ####\n");
		method6(3);
	}
	
	/*
	 * Time Complexity : O(n^2)
	 */
	public static void method1(int n) {
		System.out.println("\n#### Executing Method 1 ####\n");
		checkInput(n);
		int counter=0;
		for(int i=0;i<n;i++) {
			for(int j=0;j<n;j++) {
				System.out.println("Operation : "+counter);
				counter++;
			}
			
		}
	}
	
	/*
	 * Time Complexity : O(n^3)
	 */
	public static void method2(int n) {
		System.out.println("\n#### Executing Method 2 ####\n");
		checkInput(n);
		int counter=0;
		for(int i=0;i<n;i++) {			
			for(int j=0;j<n;j++) {				
				for(int k=0;k<n;k++) {
					System.out.println("Operation : "+counter);
					counter++;
				}
			}			
		}
	}
	
	/*
	 * Time Complexity : O(log n)
	 */
	public static void method3(int n) {
		System.out.println("\n#### Executing Method 3 ####\n");
		checkInput(n);
		int counter=0;
		for(int i=1;i<n;i=i*BASE) {			
			System.out.println("Operation : "+counter);
			counter++;					
		}
	}
	
	/*
	 * Time Complexity : O(n log n)
	 */
	public static void method4(int n) {
		System.out.println("\n#### Executing Method 4 ####\n");
		checkInput(n);
		int counter=0;
		for(int i=0;i<n;i++) {	
			for(int j=1;j<n;j=j*BASE) {	
				System.out.println("Operation : "+counter);
				counter++;		
			}
		}
	}
	
	/*
	 * Time Complexity : O(log log n) 
	 */
	public static void method5(int n) {
		System.out.println("\n#### Executing Method 5 ####\n");
		checkInput(n);
		int counter=0;
		for(int i=1;i<n;i=i*BASE*BASE) {
			System.out.println("Operation : "+counter);
			counter++;	
		}
	}
	
	/*
	 * Time Complexity : O(2^n) 
	 */
	public static void method6(int n) {
		checkInput(n);
		if(n==0) {
			System.out.println("Operation : "+cnt++);

			return;
		}
		
		for(int i=0;i<METHOD_SIX_BASE;i++)
		method6(n-1);
	}
	
	/*
	 * Check Input Value.
	 */
	private static int checkInput(int n) {
		if(n<0) {
			throw new IllegalArgumentException("Please enter valid positive integer value.");
		}else {
			return n;
		}
	}
	
}
