package Maze;

import java.awt.Color;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Stack;

/**
 * Class that solves maze problems with backtracking.
 * @author Koffman and Wolfgang
 **/
public class Maze implements GridColors {

    /** The maze */
    private TwoDimGrid maze;

    public Maze(TwoDimGrid m) {
        maze = m;
    }

    /** Wrapper method. */
    public boolean findMazePath() {
        return findMazePath(0, 0); // (0, 0) is the start point. ### For Problem 1
       // return findAllMazePaths(0, 0).size() > 0; // (0, 0) is the start point. ### For Problem 2
       // return findMazePathMin(0, 0).size() > 0; // (0, 0) is the start point. ### For Problem 3
    }

    /**
     * Attempts to find a path through point (x, y).
     * @pre Possible path cells are in BACKGROUND color;
     *      barrier cells are in ABNORMAL color.
     * @post If a path is found, all cells on it are set to the
     *       PATH color; all cells that were visited but are
     *       not on the path are in the TEMPORARY color.
     * @param x The x-coordinate of current point
     * @param y The y-coordinate of current point
     * @return If a path through (x, y) is found, true;
     *         otherwise, false
     */
    public boolean findMazePath(int x, int y) {
        // COMPLETE HERE FOR PROBLEM 1
    	if(x<0 || y<0 || x>= maze.getNCols() || y>= maze.getNRows()) {
    		return false;
    	}
    	Color currentColor = maze.getColor(x, y);
    	if(currentColor == BACKGROUND || currentColor == TEMPORARY || currentColor == PATH) {
    		return false;
    	}
    	if(x == maze.getNCols()-1 && y == maze.getNRows()-1) {
        	maze.recolor(x, y, PATH);
    		return true;
    	}
    	maze.recolor(x, y, PATH);
    	if(
    			// Left
    			findMazePath(x-1, y) || 
    			// Up
    			findMazePath(x, y-1) || 
    			//Right
    			findMazePath(x+1, y) || 
    			//Down
    			findMazePath(x, y+1)) {
    		return true;
    	}
    	maze.recolor(x, y, TEMPORARY);
    	return false;
    }

    // ADD METHOD FOR PROBLEM 2 HERE
    /*
     * Attempts to find all path through point (x, y).
     * @param x The x-coordinate of current point
     * @param y The y-coordinate of current point
     * @return Result of all possible path
     */
    public ArrayList<ArrayList<PairInt>> findAllMazePaths(int x, int y) {
    	ArrayList<ArrayList<PairInt>> result = new ArrayList<ArrayList<PairInt>>();
    	Stack<PairInt> trace = new Stack<PairInt>();
    	findMazePathStackBased(0 ,0 , result , trace); 
    	System.out.println("All Path: " + result);
    	return result;
    }
    
    /*
     * Helper method attempts to copy  the contents of the stack  into a list.
     * @param x The x-coordinate of current point
     * @param y The y-coordinate of current point
     * @result The list of successful paths recorded up to now
	 * @trace  The trace of the current path being explored
     */
    private void findMazePathStackBased(int x, int y, ArrayList<ArrayList<PairInt>> result, Stack<PairInt> trace) {
    	if(x<0 || y<0 || x>= maze.getNCols() || y>= maze.getNRows()) {
    		return;
    	}
    	Color currentColor = maze.getColor(x, y);
    	if(currentColor == BACKGROUND || currentColor == TEMPORARY || currentColor == PATH) {
    		return;
    	}
    	if(x == maze.getNCols()-1 && y == maze.getNRows()-1) {
    		trace.add(new PairInt(x, y));
    		result.add(new ArrayList<PairInt>(trace));
    		trace.pop();
    		return;
    	}
		maze.recolor(x, y, PATH);
		trace.add(new PairInt(x, y));
		findMazePathStackBased(x-1, y, result, trace);
		findMazePathStackBased(x, y-1, result, trace);
		findMazePathStackBased(x+1, y, result, trace);
		findMazePathStackBased(x, y+1, result, trace);
		trace.pop();
		maze.recolor(x,  y, NON_BACKGROUND);
    }

    // ADD METHOD FOR PROBLEM 3 HERE
    /*
     * Attempts to find shortest path in the list of paths through point (x, y).
     * @param x The x-coordinate of current point
     * @param y The y-coordinate of current point
     * @return shortest path
     */
    public ArrayList<PairInt> findMazePathMin(int x, int y) {
    	ArrayList<ArrayList<PairInt>> allPaths = findAllMazePaths(x, y);
    	final ArrayList<PairInt> bestPath = new ArrayList<>();
    	allPaths.forEach(path -> {
    		if(path.size() < bestPath.size() || bestPath.size() == 0) {
    			bestPath.clear();
    			bestPath.addAll(path);
    		}
    	});
    	System.out.println("Best Path: " + bestPath);
    	bestPath.forEach(pair -> maze.recolor(pair.getX(), pair.getY(), PATH));
    	return bestPath;
    }

    /*<exercise chapter="5" section="6" type="programming" number="2">*/
    public void resetTemp() {
        maze.recolor(TEMPORARY, BACKGROUND);
    }
    /*</exercise>*/

    /*<exercise chapter="5" section="6" type="programming" number="3">*/
    public void restore() {
        resetTemp();
        maze.recolor(PATH, BACKGROUND);
        maze.recolor(NON_BACKGROUND, BACKGROUND);
    }
    /*</exercise>*/
}
/*</listing>*/
