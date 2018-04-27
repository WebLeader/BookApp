package com.senter.demo.uhf.modelC;

import java.util.Locale;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.view.Menu;
import android.view.MenuItem;
import com.senter.demo.uhf.App;
import com.senter.R;
import com.senter.support.openapi.StUhf.InterrogatorModelC.UmcErrorCode;
import com.senter.support.openapi.StUhf.InterrogatorModelC.UmcOnNewUiiInventoried;
import com.senter.support.openapi.StUhf.UII;

public final class Activity0Inventory extends com.senter.demo.uhf.common.Activity0InventoryCommonAbstract
{
	@Override
	protected void onCreate(Bundle savedInstanceState)
	{
		super.onCreate(savedInstanceState);

		getViews().setModes(InventoryMode.SingleStep,InventoryMode.AntiCollision);
	}

	protected UII startInventorySingleStep()
	{
		return App.uhfInterfaceAsModelC().inventorySingleStep();
	}
	

	protected boolean startInventoryAntiCollision()
	{
		return App.uhfInterfaceAsModelC().startInventorySingleTag(new UmcOnNewUiiInventoried() {

			@Override
			public void onNewTagInventoried(UII uii)
			{
				if (uii != null)
				{
					addNewUiiMassageToListview(uii);
				}
			}

			@Override
			public void onEnd(final int errorId)
			{
				runOnUiThread(new Runnable() {
					@Override
					public void run()
					{	
						switch (UmcErrorCode.ValueOf(errorId)) {
							case Success:
							{
								showToast(getString(R.string.idInventoryFinished));
								break;
							}
							case RftcErrRevPwrLevTooHigh:
							{
								showToast(getString(R.string.idInventoryStopped__PleaseMoveTheTagAndTryAgain));
								break;
							}
							default:
							{
								showToast(getString(R.string.idInventoryFinished_Colon) + String.format(Locale.ENGLISH,"0x%x",errorId));
								break;
							}
						}
					}
				});
				viewsSetAsStoped();
			}
			
			@Override
			public void onNewErrorReport(int errorCode, UmcErrorCode umcErrorCode) {
				if (umcErrorCode!=null) {
					showToast("event:"+umcErrorCode);
				}
			}
		});
	}

	protected boolean stopInventory()
	{
		if (App.stop())
		{
			return true;
		}
		return false;
	}

	protected void showSetQActivity()
	{
		startActivity(new Intent(Activity0Inventory.this, Activity7Settings.class));
	}
	
	protected void uiOnInverntryButton()
	{
		if (getViews().isStateInventoring())
		{
			if (stopInventory()==true)
			{
				getViews().setStateStoped();
			}
			return ;
		}else {
			if (startInventory())
			{
				getViews().setStateStarted();
			}
		}
	}
	
	protected final boolean startInventory()
	{
		boolean ret=false;
		switch (getViews().getSpecifiedInventoryMode())
		{
			case SingleStep:
			{
				enableBtnInventory(false);
				new Thread() {
					public void run()
					{
						UII uii = null;
			
						uii = startInventorySingleStep();
						Log.v(TAG, "startInventorySingleStep finished");
			
						if (uii != null)
						{
							addNewUiiMassageToListview(uii);
						}
						enableBtnInventory(true);
					};
				}.start();
				ret=false;
				return ret;
			}
			case AntiCollision:
			{
				ret=startInventoryAntiCollision();
				if (ret==false)
				{
					App.stop();
				}
				return ret;
			}
			default:
				break;
		}
		return ret;
	}
	
	@Override
	public boolean onKeyDown(	int keyCode, KeyEvent event)
	{
		switch (keyCode)
		{
			case KeyEvent.KEYCODE_BACK:
				if (getViews().isStateInventoring())//uhf is inventoring
				{
					App.stop();
				}
				break;
			case 222:
				if (getViews().isStateInventoring()==false)
				{
					uiOnInverntryButton();
				}
				break;
			default:
				break;
		}

		return super.onKeyDown(keyCode, event);
	}

	@Override
	public boolean onKeyUp(	int keyCode, KeyEvent event)
	{
		switch (keyCode)
		{
			case 222:
				if (getViews().isStateInventoring())
				{
					uiOnInverntryButton();
				}
				break;
			default:
				break;
		}
		return super.onKeyUp(keyCode, event);
	}

	@Override
	public boolean onPrepareOptionsMenu(Menu menu)
	{
		super.onPrepareOptionsMenu(menu);

		menu.add(0, 3, 0, R.string.idSetQ);
		return true;
	}

	@Override
	public boolean onOptionsItemSelected(	MenuItem item)
	{
		if (item.getItemId()==3)
		{
			if (getViews().isStateInventoring())
			{
				showToast(getString(R.string.unPleaseStopInventoryFirst));
			}else {
				showSetQActivity();
			}
			return true;
		}
		return super.onOptionsItemSelected(item);
	}
	
}
