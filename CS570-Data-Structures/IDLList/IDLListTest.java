import static org.junit.Assert.*;

import org.junit.Before;
import org.junit.Test;

public class IDLListTest {
	
	IDLList<Integer> list;

	@Before
	public void setUp() throws Exception {
		this.list = new IDLList<Integer>();
	}

	@Test
	public void addWith2Arg_HappyCase() {
		assertTrue(this.list.add(0, 20));
		assertTrue(this.list.add(0, 10));
		assertEquals("[10, 20]", this.list.toString());
		assertTrue(this.list.add(1, 30));
		assertTrue(this.list.add(1, 40));
		assertEquals("[10, 40, 30, 20]", this.list.toString());
	}
	
	@Test
	public void addWith2Arg_InvalidIndex_ReturnsFalse() {
		assertFalse(this.list.add(0, null));
		assertFalse(this.list.add(2, 10));
		assertFalse(this.list.add(-1, 10));
		this.list.add(0, 10);
		assertFalse(this.list.add(2, 10));
		assertFalse(this.list.add(1, 10));
		assertFalse(this.list.add(-1, 10));
	}

	
	@Test
	public void addWith1Arg_HappyCase() {
		assertTrue(this.list.add(10));
		assertEquals(1, this.list.size());
		assertTrue(this.list.add(20));
		assertEquals("[20, 10]", this.list.toString());
		assertEquals(2, this.list.size());
	}

	
	@Test
	public void addWith1Arg_InvalidInput_ReturnsFalse() {
		assertFalse(this.list.add(null));
	}

	
	@Test
	public void append_HappyCase() {
		assertTrue(this.list.append(10));
		assertEquals(1, this.list.size());
		assertEquals(Integer.valueOf(10), this.list.getHead());
		assertEquals(Integer.valueOf(10), this.list.getLast());
		assertEquals(Integer.valueOf(10), this.list.get(this.list.size() - 1 ));
		assertTrue(this.list.append(20));
		assertEquals(2, this.list.size());
		assertEquals(Integer.valueOf(10), this.list.getHead());
		assertEquals(Integer.valueOf(20), this.list.getLast());
		assertFalse(this.list.append(null));
	}
	
	@Test
	public void removeWith0Arg_HappyCase() {
		assertThrows(RuntimeException.class, () -> this.list.remove());
		this.list.add(10);
		this.list.add(20);
		assertEquals(Integer.valueOf(20), this.list.remove());
		assertEquals(Integer.valueOf(10), this.list.remove());
	}
	
	@Test
	public void removeAt_HappyCase() {
		this.list.add(10);
		this.list.append(20);
		this.list.append(30);
		this.list.append(40);
		assertEquals(Integer.valueOf(10), this.list.removeAt(0));
		assertEquals("[20, 30, 40]", this.list.toString());
		assertEquals(Integer.valueOf(30), this.list.removeAt(1));
	}
	
	@Test
	public void removeAt_InvalidIndex_ThrowsException() {
		assertThrows(IllegalArgumentException.class, () -> this.list.removeAt(-1));
		assertThrows(IllegalArgumentException.class, () -> this.list.removeAt(10));
	}
	
	@Test
	public void removeLast_HappyCase() {
		this.list.add(10);
		this.list.add(20);
		assertEquals(Integer.valueOf(10), this.list.removeLast());
		assertEquals(Integer.valueOf(20), this.list.removeLast());
	}
	
	@Test
	public void toString_HappyCase() {
		assertEquals("[]", this.list.toString());
	}
	
	@Test
	public void removeLast_EmptyList_ThrowsException() {
		assertThrows(RuntimeException.class, () -> this.list.removeLast());
	}
	
	@Test
	public void removeWith1Arg_EmptyList_ReturnsFalse() {
		assertFalse(this.list.remove(10));	
	}
	
	@Test
	public void removeWith1Arg_HappyCase() {
		this.list.add(10);
		assertTrue(this.list.remove(10));	
	}
	
	@Test
	public void get_WithIllegalArg_ThrowsException() {
		assertThrows(IllegalArgumentException.class, () -> this.list.get(-1));
		assertThrows(IllegalArgumentException.class, () -> this.list.get(2));
	}
	
	@Test
	public void getHead_WithEmptyList_ThrowsException() {
		assertThrows(IllegalArgumentException.class, () -> this.list.getHead());
	}
	
	@Test
	public void getLast_WithEmptyList_ThrowsException() {
		assertThrows(IllegalArgumentException.class, () -> this.list.getLast());
	}
}
