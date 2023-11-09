package Maze;

public class PairInt {

	private int x;
	private int y;
	
	/* Constructor method to Pair (x,y)
	 * @param x The x-coordinate of current point
     * @param y The y-coordinate of current point
	 */	
	public PairInt(int x, int y) {
		this.x = x;
		this.y = y;
	}
	/* Returns The x-coordinate of current point
	 * @return element value of x-coordinate of current point.
	 */	
	public int getX() {
		return this.x;
	}
	/* Returns The y-coordinate of current point
	 * @return element value of y-coordinate of current point.
	 */	
	public int getY() {
		return this.y;
	}
	/* Sets the value for x-coordinate of current point
	 * @param x value to set for x-coordinate.
	 */	
	public void setX(int x) {
		this.x = x;
	}
	/* Sets the value for y-coordinate of current point
	 * @param y value to set for x-coordinate.
	 */	
	public void setY(int y) {
		this.y = y;
	}
	/*
	 * @param p for object.
	 * @return true if result is equal to p otherwise false.
	 */
	public boolean equals(Object p) {
		return this == p;
	}
	/*
	 * Presents a string representation of (x,y).
	 * @return The (x,y) in string Format.
	 */
	public String toString() {
		return "(" + this.x + ", " + this.y + ")";
	}
	/*
	 * Copies a string representation of (x,y).
	 * @return The copy of (x,y) of current point.
	 */
	public PairInt copy() {
		return new PairInt(this.x, this.y);
	}
	
}
