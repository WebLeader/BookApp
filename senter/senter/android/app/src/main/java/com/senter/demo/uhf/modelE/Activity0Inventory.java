package com.senter.demo.uhf.modelE;

import android.os.Bundle;

import com.senter.demo.uhf.App;
import com.senter.support.openapi.StUhf.InterrogatorModelE.UmeInventoryTagInfo;
import com.senter.support.openapi.StUhf.InterrogatorModelE.UmeOnContinousInventory;

public class Activity0Inventory extends com.senter.demo.uhf.common.Activity0InventoryCommonAbstract
{
	
	@Override
	protected void onCreate(Bundle savedInstanceState)
	{
		super.onCreate(savedInstanceState);
		getViews().setModes(InventoryMode.SingleStep,InventoryMode.SingleTag);
	}
	
	
	
	
	
	
	
	
	@Override
	protected void uiOnInverntryButton()
	{
		if (getViews().isStateInventoring())
		{
			App.uhfInterfaceAsModelE().stopContinuousInventory();
			getViews().setStateStoped();
			return ;
		}else {
			switch (getViews().getSpecifiedInventoryMode())
			{
				case SingleStep:
				{
					UmeInventoryTagInfo  rslt=App.uhfInterfaceAsModelE().inventorySingleStep(500);
					if (rslt!=null)
					{
						addNewUiiMassageToListview(rslt.getUii());
					}else {
						showToast("inventory failed");
					}
					break;
				}
				case SingleTag:
				{
					App.uhfInterfaceAsModelE().inventoryContinously(Long.MAX_VALUE, new UmeOnContinousInventory (){

						@Override
						public void onNewUiiReceived(	final UmeInventoryTagInfo singleTagInfo)
						{
							if (singleTagInfo!=null)
							{
								runOnUiThread(new Runnable()
								{
									@Override
									public void run()
									{
										addNewUiiMassageToListview(singleTagInfo.getUii());
									}
								});
							}else {
								showToast("inventory failed");
							}
						}}
					);
					getViews().setStateStarted();
					break;
				}
				default:
					break;
			}
		}
	}
}
