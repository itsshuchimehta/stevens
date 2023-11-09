import java.util.*;
import java.util.stream.Collectors;

public class IDLList<E> {
	
	private Node<E> head;
	private Node<E> tail;
	private int size;
	private ArrayList<Node<E>> indices;
	
	private class Node<E>{
		private E data;
		private Node<E> next;
		private Node<E> prev;
		
		private Node(E elem) {
			if(elem == null)
				throw new IllegalArgumentException("Please provide valid value for element.");
			this.data = elem;
			this.next = null;
			this.prev = null;
		}
	
		private Node(E elem, Node<E> prev, Node<E> next) {
			if(elem == null)
				throw new IllegalArgumentException("Please provide valid value for element.");
			this.data = elem;
			this.prev = prev;
			this.next = next;
		}
	} 
	
	
	////////////////////////////////////// Operations that require index maintenance. ////////////////////////////////////////
	public IDLList () {
		 this.head = this.tail = null; 
		 this.size = 0;
		 this.indices = new ArrayList<Node<E>>();
	}
	
	/*
	 * Adds element at position index (counting from wherever head is). It uses the index for fast access.
	 * @param elem Element to be added at given index.
	 * @return True if operation is successful. Otherwise, False.
	 */
	public boolean add (int index, E elem) {
		try {
			if(this.size == 0) {
				if(0 > index || index > this.size)
					return false;
				Node<E> node = new Node<E>(elem);
				this.indices.add(node);
				this.head = this.tail = node;
				this.size++;
				return true;
			}
			if(index >= this.size || index < 0)
				return false;
			Node<E> currentNode = this.indices.get(index);
			Node<E> newNode = this.helperAddNext(currentNode, elem);
			if(index == 0)
				this.head = newNode;
			this.indices.add(index, newNode);
			this.size++;
			return true;
		} catch(IllegalArgumentException e) {
			return false;
		}
	}
	
	/*
	 * Adds element at the head (i.e. it becomes the first element of the list).
	 * @param elem Element to be added at Head Node
	 * @return True if operation is successful. Otherwise, False.
	 */
	public boolean add (E elem) {
		try {
			Node<E> newNode = new Node<E>(elem, null, this.head);
			this.head = newNode;
			if(this.size == 0)
				this.tail = newNode;
			this.indices.add(0, newNode);
			this.size++;
			return true;
		} catch(IllegalArgumentException e) {
			return false;
		}
	}
	
	/*
	 * Adds element as the new last element of the IDLList (i.e. at the tail).
	 * @param elem Element to be appended
	 * @return True if operation is successful. Otherwise, False.
	 */
	public boolean append (E elem) {		
		try {
			Node<E> newNode = new Node<E>(elem, this.tail, null);
			if(this.size == 0) {
				this.head = newNode;
			} else {
				this.tail.next = newNode;
			}			
			this.tail = newNode;
			this.indices.add(newNode);
			this.size++;
			return true;
		} catch(IllegalArgumentException e) {
			return false;
		}
	}
	
	/*	
	 * @return Removes and returns the element at the head.
	 */
	public E remove() {
		if(this.size == 0)
			throw new RuntimeException("IDLList is empty.");
		Node<E> thisNode = this.head;
		this.helperRemoveNext(thisNode);
		this.size--;
		if(this.size > 0)
			this.head = this.indices.get(1);
		this.indices.remove(0);
		return thisNode.data;
	}
	
	/*
	 * @return Removes and returns the element at the tail.
	 */	
	public E removeLast () {
		if(this.size == 0)
			throw new RuntimeException("IDLList is empty.");
		Node<E> thisNode = this.tail;
		this.helperRemoveNext(thisNode);
		this.indices.remove(this.size - 1);
		this.size--;
		if(this.size > 0)
			this.tail = this.indices.get(this.size - 1);		
		return thisNode.data;
	}
	
	/*
	 * Removes and returns the element at the index index. Use the index for fast access.
	 * @param Element to be removed at given Index
	 * @return node value at given index.
	 */	
	public E removeAt (int index) {
		if(index < 0 || index >= this.size) {
			throw new IllegalArgumentException("Please enter valid index value.");
		}
		
		Node<E> thisNode = this.indices.get(index);
		this.helperRemoveNext(thisNode);
		this.indices.remove(index);
		if(this.indices.size() > 0)
			this.head = this.indices.get(0);
		this.size--;
		return thisNode.data;
	}
	
	/*
	* Removes the first occurrence of element in the IDLList and returns true. Return false if element was not in the IDLList.
	* @param elem Element to be removed at given Index
	* @return node value.
	*/
	public boolean remove (E elem) {
		try {
			List<E> elementList = this.indices.stream().map(node -> node.data).collect(Collectors.toList());
			this.removeAt(elementList.indexOf(elem));
			return true;
		} catch(IllegalArgumentException e) {			
			return false;
		}	
	}

	
	/////////////////////////////// Operations that do not require index maintenance. ////////////////////////////////////////
	
	/*
	 * Presents a string representation of the IDLList.
	 * @return The IDLList in string Format.
	 */
	public String toString() {
		return (this.indices.stream().map(node -> node.data).collect(Collectors.toList())).toString();
	}
	
	/*
	 * Returns the object at position index from the head.
	 * @param index to be used to get element.
	 * @return element value of given index.
	 */	
	public E get (int index) {
		if(index < 0 || index >= this.size) {
			throw new IllegalArgumentException("Please enter valid index value.");
		}
		return this.indices.get(index).data;
	}
	
	/*
	 * Returns the object at the head.
	 * @return Head value in the IDLList.
	 */
	public E getHead () {
		if(this.size == 0) {
			throw new IllegalArgumentException("The IDLList is Empty. No Head Value Found.");
		}
		return this.head.data;
	} 
	 	 
	/*
	 * Returns the object at the tail.
	 * @return Last value in the IDLList.
	 */	 
	public E getLast () {
		if(this.size == 0) {
			throw new IllegalArgumentException("The IDLList is Empty. No Tail Value Found.");
		}
		return this.tail.data;
	} 
	 
	/*
	 * Returns the IDLList size.
	 * @return Size of the IDLList.
	 */
	public int size() {
		return this.size;
	}
	
	// Additional Methods
	private Node<E> helperAddNext(Node<E> pointer, E elem) {
		Node<E> newNode = new Node<E>(elem);
		if(pointer.next != null) {
			pointer.next.prev = newNode;
		}
		newNode.next = pointer.next;
		newNode.prev = pointer;
		pointer.next = newNode;
		return newNode;
	}
	
	private void helperRemoveNext(Node<E> pointer) {
		if(pointer.next != null) {
			pointer.next.prev = pointer.prev;
		}
		if(pointer.prev != null) {
			pointer.prev.next = pointer.next;
		}
	}
}
