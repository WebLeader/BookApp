package com.senter;

import android.os.Handler;
import android.widget.Toast;
import android.content.Context;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import android.app.Application;
import android.util.Log;

import com.senter.support.openapi.StUhf;

import org.json.JSONArray;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

public class BookRfidModule extends ReactContextBaseJavaModule {
    //private Context mContext;
    public static final String TAG="MainApp";
    private boolean	goOnInventoring	= true;
    private boolean	isInventoring	= false;
    private String buff = null;
    private ArrayList<String> bufList = new ArrayList<>();
    private List<String> listNewBuff;
    private String buffStr = null;


    public BookRfidModule(ReactApplicationContext reactContext) {
        super(reactContext);
        //mContext = reactContext;
        //initUII();
    }

    @Override
    public String getName() {
        //返回的这个名字是必须的，在rn代码中需要这个名字来
        // 调用该类的方法。
        return "BookRfidModule";
    }


    public void initUII(){
        goOnInventoring = true;
        isInventoring=true;
        StUhf stUhf = StUhf.getUhfInstance(StUhf.InterrogatorModel.InterrogatorModelD2);
        boolean isSuccess = stUhf.init();
        Log.d("isSuccess", "isSuccess = : " + isSuccess);
        if (isSuccess==false) {
    //                初始化失败
            return;
        }

    //            操作类
        StUhf.InterrogatorModelDs.InterrogatorModelD2 interrogatorModelD2 = stUhf.getInterrogatorAs(StUhf.InterrogatorModelDs.InterrogatorModelD2.class);
    //          操作rfid,使用interrogatorModelD2
        interrogatorModelD2.iso18k6cRealTimeInventory(1, new StUhf.InterrogatorModelDs.UmdOnIso18k6cRealTimeInventory(){

            @Override
            public void onFinishedWithError(StUhf.InterrogatorModelDs.UmdErrorCode error)
            {
                onFinishedOnce();
            }

            @Override
            public void onFinishedSuccessfully(	Integer antennaId, int readRate, int totalRead)
            {
                onFinishedOnce();
            }

            private void onFinishedOnce()
            {
    //                    if (goOnInventoring)
    //                    {
    //                        startInventory();
    //                    } else
    //                    {
    //                        isInventoring=false;
    //
    //                    }
            }
            @Override
            public void onTagInventory(StUhf.UII uii, StUhf.InterrogatorModelDs.UmdFrequencyPoint frequencyPoint, Integer antennaId, StUhf.InterrogatorModelDs.UmdRssi rssi)
            {
                byte[] Uii = uii.getBytes();
                StringBuilder buf = new StringBuilder();
                for(byte b : Uii) { // 使用String的format方法进行转换
                    buf.append(String.format("%02x", new Integer(b & 0xff)));
                    //list.add(buf.toString());
                }
                buff = buf.toString();
                //截取
                String substring = buff.substring(4);
                bufList.add(substring);
                Log.d("bufList", "bufList = " + bufList.toString());
                // 去重
                listNewBuff=new ArrayList<>(new HashSet(bufList));
                Log.d("listNewBuff", "listNewBuff = : " + listNewBuff);
                StringBuilder buffStrBuder = new StringBuilder();
                for(int i = 0; i < listNewBuff.size(); i++) {
                    if (buffStrBuder.length() > 0) {
                        //该步即不会第一位有逗号，也防止最后一位拼接逗号！
                        buffStrBuder.append(",");
                    }
                    buffStrBuder.append(listNewBuff.get(i));
                }
                buffStr = buffStrBuder.toString();
                //Log.d("buffStr", "buffStr = : " + buffStr);

            }

        });
    }

    @ReactMethod
    public void getUii(final Callback success, final Callback failure) {
        initUII();
        new Handler().postDelayed(new Runnable(){
            @Override
            public void run() {
                try{
                    //Log.d("buffStrs", "buffStrs = : " + buffStr);
//                    模拟网络请求数据的操作
                    Log.e(TAG,"请求数据完成");
                    success.invoke(buffStr.toString());
                }catch (Exception e){
                    Log.e(TAG,"对不起，网络不给力");
                }
            }
        }, 800);

    }

    //    参考案例，数组转16进制字符串
    public static String bytesToHexFun3(byte[] bytes) {
        StringBuilder buf = new StringBuilder(bytes.length * 2);
        for(byte b : bytes) { // 使用String的format方法进行转换
            buf.append(String.format("%02x", new Integer(b & 0xff)));
        }

        return buf.toString();
    }

//    退出，去初始化
    @ReactMethod
    public void uninit() {
        StUhf stUhf = StUhf.getUhfInstance(StUhf.InterrogatorModel.InterrogatorModelD2);
        stUhf.uninit();
    }

    //函数不能有返回值，因为被调用的原生代码是异步的，原生代码执行结束之后只能通过回调函数或者发送信息给rn那边。
//    @ReactMethod
//    public void rnCallNative(String msg){
//        Toast.makeText(mContext,msg,Toast.LENGTH_SHORT).show();
//    }


}
