/*
 * Shuchi Paragbhai Mehta
 * CWID : 20009083
 */
import java.util.Random;
import java.util.Stack;

public class Treap<E extends Comparable<E> > {
	
	private Random priorityGenerator;
	private Node<E > root;
	
	/**
	 * Class Node to create nodes
	*/	
	private static class Node<E>{
		public E data;
		public int priority;
		public Node<E> left;
		public Node<E> right;
		
		/**
		* Constructor Method to create node
		* @data To store Key
	    * @priority To store Priority
	    */   
		public Node(E data,int priority) {
			if(data == null) {
				throw new IllegalArgumentException("Data is Empty");
			}			
			this.data = data;
			this.priority = priority;
			this.left = this.right = null;					
		}
		/**
		* Method performs a right rotation
		* @return Returns root node
	    */		
		public Node<E> rotateRight(){
			Node <E> CurrNode = new Node<E>(data,priority);
			if(this.left == null) {
				return this;
			}				
			CurrNode.right = this.right;
			CurrNode.left = this.left.right;				
			this.data = this.left.data;
			this.priority = this.left.priority;
			this.left = this.left.left;
			this.right = CurrNode;	
			return this;					
		}
		/**
		* Method performs a left rotation
		* @return Returns root node
	    */		
		public Node<E> rotateLeft(){
			Node <E> CurrNode= new Node<E>(data,priority);			
			if(this.right == null) {
				return this;
			}						
			CurrNode.right = this.right.left;
			CurrNode.left = this.left;
			this.data = this.right.data;
			this.priority = this.right.priority;
			this.right = this.right.right;
			this.left = CurrNode;	
			return this;		
		}				
	}
	/**
	 * Creates an empty treap
	*/
	public Treap() {
		root = null;
		priorityGenerator = new Random();				
	}
	
	/**
	 * Creates an empty treap and initializes priorityGenerator
	 * @seed New Random Number
	*/
	public Treap(long seed) {
		priorityGenerator = new Random(seed);		
	}
	
	/**
	* Method To insert the given element into the tree
	* @key Key data for a node
	* @return calls add method with given key and random priority number
    */ 
	boolean add (E key) {
		int random_p = priorityGenerator.nextInt();
		if(key == null) {
			throw new IllegalArgumentException("Key must not be Null");
		}
		return add(key, random_p);
	}
	/**
	* Method create a new node containing key as its data and a priority and inserts it into a treap
	* @key Key data for a node
	* @priority priority number for a node
	* @return Returns true if node is added successfully to tree, false otherwise.
    */ 	
	boolean add (E key,int priority) {
		
		if(key == null) {
			throw new IllegalArgumentException("Key must not be Null");
		}			
		Node<E > NodeNew = new Node<E>(key, priority);
		Node<E > TempRoot = root;		
		Stack<Node> TreapStack = new Stack<Node>();	
		
		if(root == null){
			root = NodeNew;
			return true;
		}		
		if(find(key) == true) {		//Check For duplication of a key
			return false;
		}		
	
		HelperCheckStack(NodeNew,TempRoot,TreapStack); //Helper method for insertion
		TreapStack.push(NodeNew);		//Add new node into Stack
		reheap(TreapStack);				//Call to reheap function
		return true;
	}	
	
	/**
	* Method to delete node from the treap 
	* @key Key of node which needs to be deleted from tree
	* @return Returns true if node is deleted successfully from treap, false otherwise.
    */ 	
	boolean delete(E key){		
		if(key == null) {
			throw new IllegalArgumentException("Key must not be Null");
		}
		if (find(key) == false || root==null) {
			return false;
		}else{			
			if(HelperDeleteNode(root,key)==null) {
				return false;
			}
			 return true;
		}	
	}
	/**
	* Method to Find node with given Key in the treap and rooted at root
	* @root Root node with key and Priority
	* @key Key of node which needs to be Found in a treap
	* @return Returns true if node is Found successfully from treap, false otherwise.
    */ 	
	private boolean find(Node<E > root,E key){	
		if(key == null) {
			throw new IllegalArgumentException("Key must not be Null");
		}
		if(root == null) {
			return false;
		}	
		if( (key.compareTo(root.data)) < 0 ) {
			return find(root.left, key);
		}else if( (key.compareTo(root.data)) > 0 ) {
			return find(root.right, key);
		}else if((key.compareTo(root.data)) == 0 ) {
			return true;
		}else{
			return false;
		}				
	}
	/**
	* Method to Find node with given Key in the treap 
	* @key Key of node which needs to be Found in a treap
	* @return Returns true if node is Found successfully from treap, false otherwise.
    */ 	
	public boolean find (E key){
		if(key == null) {
			throw new IllegalArgumentException("Key must not be Null");
		}
		return find(root,key);
	}
	/**
	* Method to Print result treap
	* @return Returns result treap in string form
    */ 	
	public String toString(){
		StringBuilder MainStr = new StringBuilder();
		return HelperToString(root, 1, MainStr);
	}
	/**
	* Method to sort nodes as per Key data and Priority number
	* @TreapStack Stack with each node of a tree.
    */ 	
	private void reheap(Stack <Node> TreapStack){		
		
		  Node<E> NodeChild = TreapStack.pop(); 
		  Node<E> NodeParent = TreapStack.pop();
		  
		  if(NodeParent!= null) {			  
			  if(NodeChild.priority > NodeParent.priority) {				  
				  do {	
					  if( (NodeChild.data.compareTo(NodeParent.data)) > 0 ) {
						  	NodeParent.rotateLeft();
					  }else{
						  	NodeParent.rotateRight();					  
					  }
					  if(!TreapStack.isEmpty()) {
							NodeParent = TreapStack.pop();
					  }else{
							NodeParent = null;
					  }					  
				  }while(NodeParent!= null && NodeChild.priority > NodeParent.priority);
			  }
		  }		
	}
	/**
	* Helper Method to add new node after comparing key data with other nodes and to sort treap accordingly
	* @NodeNew New node to add in  treap
	* @TempRoot current temp root Node 
	* @TreapStack Stack with all the nodes
    */ 	
	private void HelperCheckStack(Node<E> NodeNew,Node<E> TempRoot,Stack <Node> TreapStack) {
		
		while(TempRoot!=null){
			TreapStack.push(TempRoot); // Adds node in Stack			
			if(((NodeNew.data).compareTo(TempRoot.data)) < 0) { //key is less than root data 
				TempRoot = TempRoot.left;
			}else {
				TempRoot = TempRoot.right;
			}
		}		
		if(((NodeNew.data).compareTo((E)TreapStack.peek().data)) < 0) {
			TreapStack.peek().left = NodeNew;
		}else{		
			TreapStack.peek().right = NodeNew;			
		}		
		
	}
	/**
	* Helper Method to append all node data from treap and convert in into String
	* @EachNode  Each node with key and priority
	* @d d for depth of tree
	* @MainStr Main string which stores the result 
	* @return returns Final String result 
    */ 	
	private String HelperToString(Node<E> EachNode,int d, StringBuilder MainStr){
		
		for(int i = 1; i < d; i++){
			MainStr.append("  ");
		}		
		if(EachNode == null) {
			MainStr.append("null\n");
		}else{
			MainStr.append("(key="+EachNode.data+", priority="+EachNode.priority+")\n");
			HelperToString(EachNode.left, d + 1,MainStr);
			HelperToString(EachNode.right, d + 1,MainStr);
		}
		return MainStr.toString();
	}
	
	/**
	* Helper Method to Find Matching node from treap and Reorganize the treap
	* @SearchNode  Node which needs to be compared
	* @key Key data of the node 
	* @return Returns resulting SearchNode
    */ 	
	private Node<E> HelperDeleteNode(Node<E> SearchNode, E key){
       
        if (SearchNode == null) {
            return null;
        }
        if ((key.compareTo(SearchNode.data)) < 0) {
        	SearchNode.left = HelperDeleteNode(SearchNode.left, key);
        }else if ((key.compareTo(SearchNode.data)) > 0) {
        	SearchNode.right = HelperDeleteNode(SearchNode.right, key);
        }else {
        	if (SearchNode.left == null && SearchNode.right == null){
            	SearchNode = null;
            }else if (SearchNode.left != null && SearchNode.right != null){
                if (SearchNode.left.priority < SearchNode.right.priority){
                	SearchNode = SearchNode.rotateLeft();
                	SearchNode.left = HelperDeleteNode(SearchNode.left, key);
                }else {
                	SearchNode = SearchNode.rotateRight();
                	SearchNode.right = HelperDeleteNode(SearchNode.right, key);
                }
            }else{
            	Node<E> child = (SearchNode.left != null)? SearchNode.left: SearchNode.right;
                SearchNode = child;
                if((key.compareTo(root.data) == 0)){
                	root = SearchNode;
                }                
            }
        } 
        return SearchNode;
    }
	
	/**
	 * Main method
	*/
	public static void main(String[] args) {		
		Treap<Integer> T1 = new Treap < Integer >();
		Treap<Character> T2 = new Treap < Character >();
		
		System.out.println("/************* TEST CASE 1 *************/\n");
		System.out.println("--> Node with Specified key and Priority Number :\n");
		T1.add(4,19);
		T1.add(2,31);
		T1.add(6,70);
		T1.add(1,84);
		T1.add(3,12);
		T1.add(5,83);
		T1.add(7,26);
		System.out.println(T1.toString());
		
		System.out.println("\n\n\n/************* TEST CASE 2 *************/\n");
		System.out.println("--> Find Node with Key :\n\n");
		System.out.println("Find node with key '5' : "+ T1.find(5));		
		System.out.println("Find node with key '60' : "+ T1.find(60));		

		System.out.println("\n\n\n/************* TEST CASE 3 *************/\n");
		System.out.println("--> Delete Node with Key :\n\n");
		System.out.println("Delete when key is '5' : "+ T1.delete(5));
		System.out.println("Find Key '5' after deleting? "+ T1.find(5));
		System.out.println("\n"+T1.toString());
		
		System.out.println("\n\n\n/************* TEST CASE 4 *************/\n");
		System.out.println("--> Add Node with Random Priority :\n\n");
		T1.add(6);
		T1.add(20);
		T1.add(25);
		System.out.println(T1.toString());
		
		System.out.println("\n\n\n/************* TEST CASE 5 *************/\n");
		System.out.println("--> Node with Key value of character and Priority Number :\n\n");
		T2.add('p',99);
		T2.add('g',80);
		T2.add('u',75);
		T2.add('a',60);
		T2.add('j',65);
		T2.add('r',40);
		T2.add('z',47);
		T2.add('w',32);
		T2.add('v',21);
		T2.add('x',25);
		System.out.println(T2.toString());
		
		System.out.println("\n\n\n/************* TEST CASE 6 *************/\n");
		System.out.println("--> Find Node with Key :\n\n");
		System.out.println("Find node with key 'z' : "+ T2.find('z'));		
		System.out.println("Find node with key 's' : "+ T2.find('s'));		

		System.out.println("\n\n\n/************* TEST CASE 7 *************/\n");
		System.out.println("--> Delete Node with Key value of character :\n\n");
		System.out.println("Delete when key with 'z' : "+ T2.delete('z') +"\n");
		System.out.println(T2.toString());
		
		System.out.println("\n\n\n/************* TEST CASE 8 *************/\n");
		System.out.println("--> Add New Node with Key value of character and Priority number :\n\n");
		T2.add('i',93);
		System.out.println(T2.toString());
		
		
	}

}
