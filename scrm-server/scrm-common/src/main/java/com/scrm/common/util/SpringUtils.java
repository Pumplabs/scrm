package com.scrm.common.util;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
public class SpringUtils implements ApplicationContextAware {

	private static ApplicationContext applicationContext = null;

	@Override
	public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
		SpringUtils.applicationContext = applicationContext;
	}
	public static ApplicationContext getApplicationContext(){
		return applicationContext;
	}
	public static Object getBean(Class s){
		return applicationContext.getBean(s);
	}

	public static <T> T getBeanNew(Class<T> clazz) {
		return getApplicationContext().getBean(clazz);
	}

	public static <T> Map<String, T> getBeanMap(Class<T> clazz) {
		return getApplicationContext().getBeansOfType(clazz);
	}

	public static Object getBean(String name) {
		return getApplicationContext().getBean(name);
	}
}
