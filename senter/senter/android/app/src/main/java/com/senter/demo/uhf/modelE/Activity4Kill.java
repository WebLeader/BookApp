package com.senter.demo.uhf.modelE;

import com.senter.demo.uhf.App;
import com.senter.demo.uhf.common.DestinationTagSpecifics;
import com.senter.demo.uhf.common.DestinationTagSpecifics.TargetTagType;
import com.senter.demo.uhf.util.DataTransfer;
import com.senter.support.openapi.StUhf.InterrogatorModelE.UmeMask;

public class Activity4Kill extends com.senter.demo.uhf.common.Activity6KillCommonAbstract
{
	protected DestinationTagSpecifics.TargetTagType[] getDestinationType()
	{
		return new DestinationTagSpecifics.TargetTagType[]{TargetTagType.SingleTag,TargetTagType.SpecifiedTag};
	}
	
	@Override
	protected void onKill()
	{
		UmeMask mask=null;
		if (getDestinationTagSpecifics().isOrderedUii())
		{
			mask= UmeMask.newMaskAsUii(getDestinationTagSpecifics().getDstTagUiiIfOrdered());
		}else {
			mask=UmeMask.newMaskAsAny();
		}
		
		Boolean b=App.uhfInterfaceAsModelE().kill(getDestinationTagSpecifics().getKillPassword(), mask);
		
		if (b==null||b==false)
		{
			showToast("failed");
		}else {
			addNewMassageToListview("Killed:"+DataTransfer.xGetString(getDestinationTagSpecifics().getDstTagUiiIfOrdered().getBytes()));
		}
	}
}
