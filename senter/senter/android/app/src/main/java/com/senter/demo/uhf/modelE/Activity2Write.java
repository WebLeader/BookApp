package com.senter.demo.uhf.modelE;

import android.os.Bundle;

import com.senter.demo.uhf.App;
import com.senter.demo.uhf.common.Activity2WriteCommonAbstract;
import com.senter.demo.uhf.common.DestinationTagSpecifics;
import com.senter.demo.uhf.common.DestinationTagSpecifics.TargetTagType;
import com.senter.support.openapi.StUhf.Bank;
import com.senter.support.openapi.StUhf.InterrogatorModelE.UmeMask;

public class Activity2Write extends Activity2WriteCommonAbstract
{
	@SuppressWarnings("unused")
	private static final String	Tag	= "Activity2Write";

	@Override
	protected void onCreate(Bundle savedInstanceState)
	{
		super.onCreate(savedInstanceState);
	}

	protected DestinationTagSpecifics.TargetTagType[] getDestinationType()
	{
		return new TargetTagType[]{TargetTagType.SpecifiedTag};
	}


	@Override
	protected void onWrite(	Bank bank, int offset, byte[] data)
	{
		UmeMask mask=null;
		if (getDestinationTagSpecifics().isOrderedUii())
		{
			mask= UmeMask.newMaskAsUii(getDestinationTagSpecifics().getDstTagUiiIfOrdered());
		}else {
			mask=UmeMask.newMaskAsAny();
		}
		
		Boolean b=App.uhfInterfaceAsModelE().write(getDestinationTagSpecifics().getAccessPassword(), mask, bank, offset, data);
		
		if (b==null||b==false)
		{
			showToast("error:");
		}else {
			addNewMassageToListview(getDestinationTagSpecifics().getDstTagUiiIfOrdered(), data.length/2);
		}
	}
}
