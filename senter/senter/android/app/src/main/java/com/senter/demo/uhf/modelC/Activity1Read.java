package com.senter.demo.uhf.modelC;

import android.widget.Toast;

import com.senter.demo.uhf.App;
import com.senter.R;
import com.senter.demo.uhf.common.DestinationTagSpecifics;
import com.senter.demo.uhf.common.DestinationTagSpecifics.TargetTagType;
import com.senter.demo.uhf.common.ExceptionForToast;
import com.senter.support.openapi.StUhf.AccessPassword;
import com.senter.support.openapi.StUhf.Bank;
import com.senter.support.openapi.StUhf.Result.ReadResult;

public final class Activity1Read extends com.senter.demo.uhf.common.Activity1ReadCommonAbstract
{
	protected DestinationTagSpecifics.TargetTagType[] getDestinationType()
	{
		return new DestinationTagSpecifics.TargetTagType[]{TargetTagType.SingleTag,TargetTagType.MatchTag};
	}

	protected ReadResult readDataFromSingleTag(	AccessPassword apwd,
												Bank bank,
												int offset,
												int length) throws ExceptionForToast
	{
		return App.uhfInterfaceAsModelC().readDataFromSingleTag(apwd, bank, offset, length);
	}
	
	
	
	@Override
	protected void onRead(final Bank bank, final int ptr, final int cnt)
	{
		enableBtnRead(false);
		new Thread()
		{// back ground work thread
			public void run()
			{
				try
				{
					ReadResult rr = null;

					switch (getDestinationTagSpecifics().getCurrentTargetTagType())
					{
						case SingleTag:
						case MatchTag:
							rr = readDataFromSingleTag(getDestinationTagSpecifics().getAccessPassword(), bank, ptr, (byte) cnt);
							break;
						default:
							break;
					}

					if (rr == null || rr.isSucceeded() == false)
					{
						showToast(getString(R.string.ReadDataFailure), Toast.LENGTH_SHORT);
					} else
					{
						addNewMassageToListview(rr.getUii(), rr.getData());
					}
				}
				catch (ExceptionForToast e)
				{
					showToast(e.getMessage());
				}
				enableBtnRead(true);
			};
		}.start();
	}
}
