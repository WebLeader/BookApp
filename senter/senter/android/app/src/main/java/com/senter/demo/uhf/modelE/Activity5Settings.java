package com.senter.demo.uhf.modelE;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.senter.demo.uhf.App;
import com.senter.R;
import com.senter.demo.uhf.common.Activity_Abstract;
import com.senter.support.openapi.StUhf.InterrogatorModel;
import com.senter.support.openapi.StUhf.InterrogatorModelE.UmeOutputPower;
import com.senter.support.openapi.StUhf.InterrogatorModelE.UmeOutputPower.AntennaPower;
import com.senter.support.openapi.StUhf.InterrogatorModelE.UmeOutputPower.Loop;

public class Activity5Settings extends Activity_Abstract
{
	private EditText powerEditText;
	private Button   powerGetButton;
	private Button   powerSetButton;

	private TextView temporaryTextView;
	private Button   temporaryGetButton;
	
	@Override
	protected void onCreate(Bundle savedInstanceState)
	{
		super.onCreate(savedInstanceState);
		
		setContentView(R.layout.activity27settingsactivityd);
		
		powerEditText=(EditText) findViewById(R.id.idE27SettingsActivityD_Power_etShow);
		powerGetButton=(Button) findViewById(R.id.idE27SettingsActivityD_Power_btnRead);
		powerSetButton=(Button) findViewById(R.id.idE27SettingsActivityD_Power_btnSet);
		
		powerGetButton.setOnClickListener(new View.OnClickListener()
		{
			@Override
			public void onClick(View v)
			{
				onBtnPowerGet();
			}
		});

		powerSetButton.setOnClickListener(new View.OnClickListener()
		{
			@Override
			public void onClick(View v)
			{
				onBtnPowerSet();
			}
		});
		onBtnPowerGet();
		
		
		

		if (App.uhfInterfaceAsModel()==InterrogatorModel.InterrogatorModelD2)
		{
			LinearLayout ll=(LinearLayout) findViewById(R.id.idE27SettingsActivityD_Temporary_ll);
			ll.setVisibility(View.VISIBLE);
			temporaryTextView=(TextView) findViewById(R.id.idE27SettingsActivityD_Temporary_tvShow);
			temporaryGetButton=(Button) findViewById(R.id.idE27SettingsActivityD_Temporary_btnRead);
			temporaryGetButton.setOnClickListener(new View.OnClickListener()
			{
				@Override
				public void onClick(View v)
				{
					onBtnTemporaryGet();
				}
			});
			
			onBtnTemporaryGet();
		}
	}
	
	
	
	
	protected void onBtnPowerGet()
	{
		UmeOutputPower power=App.uhfInterfaceAsModelE().getOutputPower();
		if (power==null)
		{
			showToast("power get failed");
			return;
		}
		powerEditText.setText(""+power.getDefaultAntennasPower().getReadPower());
	}
	
	
	protected void onBtnPowerSet()
	{
		float power = -1;
		try
		{
			power=Float.valueOf(powerEditText.getText().toString());
		}
		catch (Exception e)
		{
			e.printStackTrace();
			showToast("power format error");
			return ;
		}

		if (power<0||power>32)
		{
			showToast("power must be in [0,32]");
			return ;
		}
		

		Boolean ret=App.uhfInterfaceAsModelE().setOutputPower(Loop.Open, AntennaPower.newDefaultAntennaPower(power), true);
		if (ret==null||ret==false)
		{
			showToast("set power failed");
		}else {
			showToast("power set successfully");
		}
	}
	

	protected void onBtnTemporaryGet()
	{
		Integer t = App.uhfInterfaceAsModelD2().getReadersTemperature();
		
		if (t==null)
		{
			temporaryTextView.setText("");
		}else {
			temporaryTextView.setText(""+t+" ℃");
		}
	}
	
	
	
	
	
}
