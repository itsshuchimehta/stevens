/*
 * SHUCHI PARAGBHAI MEHTA 
 * CWID : 20009083
 */

import java.util.*;
import java.io.*;

public class Anagrams {
	
	final Integer[] primes;
	Map <Character,Integer> letterTable;
	Map <Long, ArrayList<String>> anagramTable;

	/**
     * Constructor method to initialize an array consisting of the first 26 prime numbers.
     * And Format as Key (of type Long),Value (of type ArrayList<String>)
     * 
	*/
	public Anagrams() {
		this.primes = new Integer[] {2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101};		
		this.anagramTable = new HashMap<Long, ArrayList<String>>();
		buildLetterTable(); 
	}
	/*
	 * Method to build the hash table
	 */
	private void buildLetterTable() {
		this.letterTable = new HashMap<Character, Integer>();
		 String letters = "abcdefghijklmnopqrstuvwxyz";
		 for (int l = 0; l < letters.length(); l++) {
	           this.letterTable.put(letters.charAt(l), primes[l]);
	      }
	} 
	/*
	 * Method to add the word to the hash table
	 * @param the word
	 */
	private void addWord(String s) {
		if(s == null  ||  s.length() == 0)
			throw new IllegalArgumentException("Value must not be Null");
		
		long MyHash = myHashCode(s);
	    ArrayList<String> WordList = this.anagramTable.get(MyHash);
	    if(WordList == null){
	    	WordList = new ArrayList<String>();
	    	WordList.add(s);
	    }else if(WordList.contains(s) == false){
	      	WordList.add(s);
	    }else {
	    	System.out.println(" The Word : " + s + ", already exists in the List"); return;
	    }
	    
	    this.anagramTable.put(MyHash, WordList);		
	}
	/*
	 * Method to compute its hash code
	 * @param word per line
	 * @return Hash code
	 */
	private Long myHashCode(String s) {
		if(s == null  || s.length() == 0)
			throw new IllegalArgumentException("Value must not be Null");
		
		long MyKey = 1L;
		Character ch;long M;
		for(int k = 0; k < s.length(); k++) {
			ch = s.charAt(k);
			M = (long)letterTable.get(ch);
			MyKey *= M;
		}
		return MyKey;
	}
	
	 /**
     * Method to receive the name of a text file containing words, one per line, and builds the hash table anagramTable.    
     * @param s word per line
     */
	private void processFile(String s) throws IOException {		 
		FileInputStream fStream = new FileInputStream(s);
		BufferedReader br = new BufferedReader(new InputStreamReader(fStream));
        String strLine;	 
        while((strLine = br.readLine()) != null) {
			this.addWord(strLine);
		}
		br.close();
	}
	/*
	 * Method to get the list of largest number of anagrams
	 * @return the list 
	 */
	private ArrayList<Map.Entry<Long,ArrayList<String>>> getMaxEntries(){
		
		int MaxSize = 0;
		ArrayList<Map.Entry<Long,ArrayList<String>>> MyList = new ArrayList<>(); 		
				
		for (Map.Entry<Long,ArrayList<String>> Word : anagramTable.entrySet()) {			
		  if(Word.getValue().size() > MaxSize) {
			  MyList.clear();
			  MyList.add(Word);
				MaxSize = Word.getValue().size();
		  }else {
			  if(Word.getValue().size() == MaxSize) {				  
				  MyList.add(Word);
			  }
		  }
		}
		 return MyList;
	}
	/*
	 * The main method
	 */
	public static void main ( String [] args ) {
		Anagrams a = new Anagrams();
		final long startTime = System.nanoTime();
		try{
			a.processFile("words_alpha.txt");
		}catch(IOException e1){
			e1.printStackTrace();
		}
		ArrayList < Map.Entry < Long , ArrayList < String >>> maxEntries = a.getMaxEntries();
		
		final long estimatedTime = System.nanoTime () - startTime;
		final double seconds = (( double ) estimatedTime / 1000000000 ) ;	
		
		long KeyValue = maxEntries.get(0).getKey();
		int ListSize = maxEntries.get(0).getValue().size();
			
		System.out.println ( " Time : "+ seconds );
		System.out.println(" Key of max anagrams : "+ KeyValue);
		System.out.println ( " List of max anagrams : "+ maxEntries.get(0).getValue());
		System.out.println(" Length of list of max anagrams : "+ ListSize);
	}
}
