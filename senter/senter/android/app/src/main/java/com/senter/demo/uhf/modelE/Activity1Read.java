package com.senter.demo.uhf.modelE;

import android.os.Bundle;

import com.senter.demo.uhf.App;
import com.senter.demo.uhf.common.Activity1ReadCommonAbstract;
import com.senter.demo.uhf.common.DestinationTagSpecifics;
import com.senter.demo.uhf.common.DestinationTagSpecifics.TargetTagType;
import com.senter.support.openapi.StUhf.Bank;
import com.senter.support.openapi.StUhf.InterrogatorModelE.UmeMask;

public class Activity1Read extends Activity1ReadCommonAbstract
{
	@Override
	protected void onCreate(Bundle savedInstanceState)
	{
		super.onCreate(savedInstanceState);
	}

	protected DestinationTagSpecifics.TargetTagType[] getDestinationType()
	{
		return new TargetTagType[]{TargetTagType.SingleTag,TargetTagType.SpecifiedTag};
	}
	;
	

	@Override
	protected void onRead(	Bank bank, int ptr, int cnt)
	{
		UmeMask mask=null;
		if (getDestinationTagSpecifics().isOrderedUii())
		{
			mask= UmeMask.newMaskAsUii(getDestinationTagSpecifics().getDstTagUiiIfOrdered());
		}else {
			mask=UmeMask.newMaskAsAny();
		}
		
		byte[] data=App.uhfInterfaceAsModelE().read(getDestinationTagSpecifics().getAccessPassword(),mask, bank, ptr, cnt);
		if (data!=null)
		{
			addNewMassageToListview(getDestinationTagSpecifics().getDstTagUiiIfOrdered(), data);
		}else {
			showToast("failed");
		}
	}
}
