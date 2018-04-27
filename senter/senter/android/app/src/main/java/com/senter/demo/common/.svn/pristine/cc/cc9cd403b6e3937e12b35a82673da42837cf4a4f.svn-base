package com.senter.demo.common.misc;

import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

import org.apache.http.client.utils.CloneUtils;

@SuppressWarnings("unchecked")
public class SubjectIndexor <TypeOfSubject extends Cloneable,NameOfProperty extends Enum<NameOfProperty>>
{
	public static final <TypeOfSubject extends Cloneable,NameOfProperty extends Enum<NameOfProperty>>  
	SubjectIndexor<TypeOfSubject,NameOfProperty> newInstance(
			Class<TypeOfSubject> columLabClass
            ,PropertyExtractor<TypeOfSubject,?,NameOfProperty>... extractors
            )
            {
				return new SubjectIndexor(columLabClass,extractors);
            }
	
	private SubjectIndexor(Class<TypeOfSubject> columLabClass
	                       ,PropertyExtractor<TypeOfSubject,?,NameOfProperty>... extractors
	                       )
	{
		this.columLabClass=columLabClass;
		for (PropertyExtractor<TypeOfSubject,?,NameOfProperty> e:extractors)
		{
			this.nameExtractorsMap.put(e.nameOfProperty(), e);
		}
	}
	
	
	
	private final Class<TypeOfSubject> columLabClass;
	private final HashMap<NameOfProperty, PropertyExtractor<TypeOfSubject,?,NameOfProperty>> nameExtractorsMap=new HashMap<NameOfProperty, SubjectIndexor.PropertyExtractor<TypeOfSubject,?,NameOfProperty>>();
	
	private final HashMap<TypeOfSubject,HashSet<HashSet<TypeOfSubject>>> datum=new HashMap<TypeOfSubject, HashSet<HashSet<TypeOfSubject>>>();
	private final HashMap<NameOfProperty, HashMap<Object, HashSet<TypeOfSubject>>> index=new HashMap<NameOfProperty, HashMap<Object,HashSet<TypeOfSubject>>>();
	
	
	@SuppressWarnings("unchecked")
	public void add(TypeOfSubject subject)
	{
		try
		{
			if (datum.containsKey(subject))
			{
				return;
			}
			
			HashSet<HashSet<TypeOfSubject>> associatedSets=new HashSet<HashSet<TypeOfSubject>>();
			datum.put((TypeOfSubject)CloneUtils.clone(subject),associatedSets);
			for (NameOfProperty name:nameExtractorsMap.keySet())
			{
				PropertyExtractor<TypeOfSubject, Object, NameOfProperty> extractor=(PropertyExtractor<TypeOfSubject, Object, NameOfProperty>) nameExtractorsMap.get(name);
				
				Object property=extractor.getProperty(subject);
				
				HashMap<Object, HashSet<TypeOfSubject>> vs=(HashMap<Object, HashSet<TypeOfSubject>>) index.get(name);
				if (vs==null)
				{
					vs=new HashMap<Object, HashSet<TypeOfSubject>>();
					index.put(name, vs);
				}
				HashSet<TypeOfSubject> subjects=vs.get(property);
				if (subjects==null)
				{
					subjects=new HashSet<TypeOfSubject>();
					vs.put(property, subjects);
				}
				subjects.add(subject);
				associatedSets.add(subjects);
			}
		}
		catch (CloneNotSupportedException e)
		{
			e.printStackTrace();
			throw new RuntimeException(e);
		}
	}
	public void addAdll(Collection<? extends TypeOfSubject> collection)
	{
		for (TypeOfSubject s:collection)
		{
			add(s);
		}
	}
	
	public void remove(TypeOfSubject subject)
	{
		datum.remove(subject);
		for (NameOfProperty name:nameExtractorsMap.keySet())
		{
			PropertyExtractor<TypeOfSubject, Object, NameOfProperty> extractor=(PropertyExtractor<TypeOfSubject, Object, NameOfProperty>) nameExtractorsMap.get(name);
			
			Object property=extractor.getProperty(subject);
			
			HashMap<Object, HashSet<TypeOfSubject>> vs=(HashMap<Object, HashSet<TypeOfSubject>>) index.get(name);
			if (vs==null)
			{
				return;
			}
			HashSet<TypeOfSubject> subjects=vs.get(property);
			if (subjects==null)
			{
				return;
			}
			subjects.remove(subject);
			if (subjects.isEmpty())
			{
				vs.remove(property);
			}
		}
	}

	@SuppressWarnings("unchecked")
	public Set<TypeOfSubject> select(NameOfProperty name,Object property)
	{
		HashSet<TypeOfSubject> ret=new HashSet<TypeOfSubject>();
		
		HashMap<Object, HashSet<TypeOfSubject>> vs=(HashMap<Object, HashSet<TypeOfSubject>>) index.get(name);
		if (vs==null)
		{
			return ret;
		}
		HashSet<TypeOfSubject> subjects=vs.get(property);
		if (subjects==null)
		{
			return ret;
		}
		
		for (TypeOfSubject s:subjects)
		{
			try
			{
				ret.add((TypeOfSubject)CloneUtils.clone(s));
			}
			catch (CloneNotSupportedException e)
			{
				e.printStackTrace();
				throw new RuntimeException(e);
			}
		}
		
		return ret;
	}
	
	
	
	
	public static abstract class PropertyExtractor<TypeOfSubject,TypeOfProperty,NameOfProperty extends Enum<NameOfProperty>>
	{
		private final Class<TypeOfProperty> typeOfProperty;
		private final NameOfProperty nameOfProperty;
		public PropertyExtractor(Class<TypeOfProperty> clazz,NameOfProperty nameOfProperty) {
			this.typeOfProperty=clazz;
			this.nameOfProperty=nameOfProperty;
		}
		public final Class<TypeOfProperty> typeOfProperty(){return typeOfProperty;}
		public final NameOfProperty nameOfProperty(){return nameOfProperty;}
		public abstract TypeOfProperty getProperty(TypeOfSubject instance);
	}
	
	public static abstract class PropertySelector<TypeOfSubject,TypeOfProperty,NameOfProperty extends Enum<NameOfProperty>>
	{
		private final Class<TypeOfProperty> typeOfProperty;
		private final NameOfProperty nameOfProperty;
		public PropertySelector(Class<TypeOfProperty> clazz,NameOfProperty nameOfProperty) {
			this.typeOfProperty=clazz;
			this.nameOfProperty=nameOfProperty;
		}
		public final Class<TypeOfProperty> typeOfProperty(){return typeOfProperty;}
		public final NameOfProperty nameOfProperty(){return nameOfProperty;}
		public abstract boolean selector(TypeOfSubject instance);
	}
	
//	public interface KeyIndex{}
}
