package com.senter.demo.uhf.modelC;

import android.os.SystemClock;
import android.util.Log;

public class Tick {
    private final String tag;
    private final String prefix;
    private boolean isTicked=false;//这个状态可以通过其它变量得出，表意明确。
    private long gap=0;
	private long preTime=0;
    private long gapAll=0;
    private long gapTimes=0;;
    private long gapMax=Long.MIN_VALUE;
    private long gapMin=Long.MAX_VALUE;
    
    public boolean isTicked(){return isTicked;}
    public long min(){return gapMin;}
    public long max(){return gapMax;}
    public long times(){return gapTimes;}
    public long duration(){return gapAll;}
    public long preTickTimeByMs(){return preTime;}
    public long preTickGap(){return gap;}
    
    private Tick(String tag,String prefix) {
    	this.tag=tag;
    	this.prefix=prefix;
	}
    
    public static final Tick newInstance(String tag,String prefix){
    	return new Tick(tag,prefix);
    }

    public synchronized void tickE(){
    	tick();
    	if (gapAll==0) {
	    	Log.e(tag, ""+prefix+": tick first time");
		}else {
	    	Log.e(tag, ""+prefix+": gap :"+gap+" ave:"+(gapAll/gapTimes)+" max:"+gapMax+" min:"+gapMin+" times:"+gapTimes);
		}
    }
    public synchronized void tickW(){
    	tick();
    	if (gapAll==0) {
	    	Log.w(tag, ""+prefix+": tick first time");
		}else {
	    	Log.w(tag, ""+prefix+": gap :"+gap+" ave:"+(gapAll/gapTimes)+" max:"+gapMax+" min:"+gapMin+" times:"+gapTimes);
		}
    }
    public synchronized void tickI(){
    	tick();
    	if (gapAll==0) {
	    	Log.i(tag, ""+prefix+": tick first time");
		}else {
	    	Log.i(tag, ""+prefix+": gap :"+gap+" ave:"+(gapAll/gapTimes)+" max:"+gapMax+" min:"+gapMin+" times:"+gapTimes);
		}
    }
    public synchronized void tickD(){
    	tick();
    	if (gapAll==0) {
	    	Log.d(tag, ""+prefix+": tick first time");
		}else {
	    	Log.d(tag, ""+prefix+": gap :"+gap+" ave:"+(gapAll/gapTimes)+" max:"+gapMax+" min:"+gapMin+" times:"+gapTimes);
		}
    }
    public synchronized void tickV(){
    	tick();
    	if (gapAll==0) {
	    	Log.v(tag, ""+prefix+": tick first time");
		}else {
	    	Log.v(tag, ""+prefix+": gap :"+gap+" ave:"+(gapAll/gapTimes)+" max:"+gapMax+" min:"+gapMin+" times:"+gapTimes);
		}
    }
    
    
    public synchronized void tick(){
		if (isTicked==false) {
			preTime=SystemClock.elapsedRealtime();
			isTicked=true;
		}else {
			gap=(SystemClock.elapsedRealtime()-preTime);
	    	preTime=0;
	    	gapAll+=gap;
	    	gapTimes++;
	    	if (gap>gapMax) {
				gapMax=gap;
			}
	    	if (gap<gapMin) {
				gapMin=gap;
			}
		}
    }
    
}
