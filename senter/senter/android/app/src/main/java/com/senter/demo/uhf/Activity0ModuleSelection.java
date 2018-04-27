package com.senter.demo.uhf;

import com.senter.demo.common.misc.ActivityHelper;
import com.senter.support.openapi.StUhf.InterrogatorModel;

import com.senter.R;
import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.CheckBox;

public class Activity0ModuleSelection extends Activity {
	ActivityHelper<Activity0ModuleSelection> ah=new ActivityHelper<Activity0ModuleSelection>(this);
	private Views views;
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		
		if (App.uhf()!=null) {
			startFunctionSelectionActivity(App.uhf().getInterrogatorModel());
			finish();
			return;
		}else if (App.appCfgSavedModel()!=null) {
			App.getUhf(App.appCfgSavedModel());
			startFunctionSelectionActivity(App.appCfgSavedModel());
			finish();
			return;
		}else {
			setContentView(R.layout.activity0_model_selection);
			views=new Views();
		}
	}
	
	protected void uhfModelChoiced(InterrogatorModel interrogatorModel){
		if (interrogatorModel==null) {
			if (App.getUhfWithDetectionAutomaticallyIfNeed()!=null) {
				if (views.cbRememberChoice.isChecked()) {
					App.appCfgSaveModel(App.uhfInterfaceAsModel());
				}else {
					App.appCfgSaveModelClear();
				}
				startFunctionSelectionActivity(App.uhf().getInterrogatorModel());
				finish();
			}else {
				ah.showToastShort("no uhf module detected");
			}
		}else {
			if (App.getUhf(interrogatorModel)!=null) {
				if (views.cbRememberChoice.isChecked()) {
					App.appCfgSaveModel(interrogatorModel);
				}else {
					App.appCfgSaveModelClear();
				}
				startFunctionSelectionActivity(interrogatorModel);
				finish();
			}else {
				ah.showToastShort("no uhf module detected");
			}
		}
	}
	
	private final void startFunctionSelectionActivity(InterrogatorModel interrogatorModel){
		switch (interrogatorModel) {
			case InterrogatorModelA:
			{
				ah.startActivity(com.senter.demo.uhf.modelA.Activity_FunctionSelection.class);
				break;
			}
			case InterrogatorModelB:
			{
				ah.startActivity(com.senter.demo.uhf.modelB.Activity_FunctionSelection.class);
				break;
			}
			case InterrogatorModelC:
			{
				ah.startActivity(com.senter.demo.uhf.modelC.Activity_FunctionSelection.class);
				break;
			}
			case InterrogatorModelD2:
			{
				ah.startActivity(com.senter.demo.uhf.modelD2.Activity_FunctionSelection.class);
				break;
			}
			case InterrogatorModelE:
			{
				ah.startActivity(com.senter.demo.uhf.modelE.Activity_FunctionSelection.class);
				break;
			}
			case InterrogatorModelF:
			{
				ah.startActivity(com.senter.demo.uhf.modelF.Activity_FunctionSelection.class);
				break;
			}
			case InterrogatorModelD1://down through
			default:
				throw new IllegalArgumentException();
		}
	}
	

	@SuppressWarnings("unused")
	private class Views{
		CheckBox cbRememberChoice=(CheckBox) findViewById(R.id.idActivity0ModelSelection_cbRememberChoice);
		Button   btnModuleA=ah.buttonWithClickListener(R.id.idActivity0ModelSelection_btnModuleA, new OnClickListener(){
			@Override
			public void onClick(View v) {
				uhfModelChoiced(InterrogatorModel.InterrogatorModelA);
			}
		});
		Button   btnModuleB=ah.buttonWithClickListener(R.id.idActivity0ModelSelection_btnModuleB, new OnClickListener(){
			@Override
			public void onClick(View v) {
				uhfModelChoiced(InterrogatorModel.InterrogatorModelB);
			}
		});
		Button   btnModuleC=ah.buttonWithClickListener(R.id.idActivity0ModelSelection_btnModuleC, new OnClickListener(){
			@Override
			public void onClick(View v) {
				uhfModelChoiced(InterrogatorModel.InterrogatorModelC);
			}
		});
		Button   btnModuleD2=ah.buttonWithClickListener(R.id.idActivity0ModelSelection_btnModuleD2, new OnClickListener(){
			@Override
			public void onClick(View v) {
				uhfModelChoiced(InterrogatorModel.InterrogatorModelD2);
			}
		});
		Button   btnModuleE=ah.buttonWithClickListener(R.id.idActivity0ModelSelection_btnModuleE, new OnClickListener(){
			@Override
			public void onClick(View v) {
				uhfModelChoiced(InterrogatorModel.InterrogatorModelE);
			}
		});
		Button   btnModuleF=ah.buttonWithClickListener(R.id.idActivity0ModelSelection_btnModuleF, new OnClickListener(){
			@Override
			public void onClick(View v) {
				uhfModelChoiced(InterrogatorModel.InterrogatorModelF);
			}
		});
		Button   btnModuleAutoDetect=ah.buttonWithClickListener(R.id.idActivity0ModelSelection_btnModuleAutoDetect, new OnClickListener(){
			@Override
			public void onClick(View v) {
				uhfModelChoiced(null);
			}
		});
		
		
		
		
		
		
		
		
	}
	
	
	
	
	
}
