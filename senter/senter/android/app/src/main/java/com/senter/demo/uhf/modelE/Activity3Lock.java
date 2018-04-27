package com.senter.demo.uhf.modelE;

import com.senter.demo.uhf.common.Activity4LockCommonAbstractABC;
import com.senter.demo.uhf.common.DestinationTagSpecifics.TargetTagType;

public class Activity3Lock extends Activity4LockCommonAbstractABC
{
	@Override
	protected TargetTagType[] getDestinationType()
	{
		return new TargetTagType[]{TargetTagType.SingleTag,TargetTagType.SpecifiedTag};
	}

	
	
	
	
	
	
}








