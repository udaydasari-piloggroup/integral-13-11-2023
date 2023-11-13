package com.pilog.mdm;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.security.web.header.writers.StaticHeadersWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable();
        http.cors().disable();
        http.headers().contentTypeOptions();
        http
        .cors()
            .and()
        .authorizeRequests()
            .antMatchers("/cdn**","/nominatim**","/integraldataanalytics**","/test**","/gstatic**").permitAll();
        http.headers().httpStrictTransportSecurity();
        http.headers().referrerPolicy(ReferrerPolicyHeaderWriter.ReferrerPolicy.SAME_ORIGIN);
       // http.headers().frameOptions().sameOrigin();
        http.headers().cacheControl();
        http.headers().xssProtection();
        http.headers().contentSecurityPolicy("default-src 'self' http://integraldataanalytics.com https://integraldataanalytics.com https://cdnjs.cloudflare.com https://nominatim.openstreetmap.org https://fastly.jsdelivr.net https://maps.googleapis.com").reportOnly();
        http.headers().contentSecurityPolicy("default-src 'self' script-src 'unsafe-inline' 'unsafe-eval' img-src 'self' data: https: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval'  https://www.gartner.com/ https://d3js.org/ https://www.gstatic.com/ https://polyfill.io/ https://www.gartner.com/ http://integraldataanalytics.com https://integraldataanalytics.com https://fastly.jsdelivr.net https://cdnjs.cloudflare.com https://nominatim.openstreetmap.org https://maps.googleapis.com https://www.piloggroup.com https://test.ccavenue.com/ https://www.google.com/ http://fonts.googleapis.com/ http://fonts.gstatic.com/ https://js.arcgis.com/").
        and().frameOptions().disable().addHeaderWriter((new StaticHeadersWriter("X-FRAME-OPTIONS", 
              "ALLOW-FROM http://integraldataanalytics.com https://integraldataanalytics.com https://fastly.jsdelivr.net https://cdnjs.cloudflare.com https://nominatim.openstreetmap.org https://maps.googleapis.com https://www.gartner.com/ https://d3js.org/ https://www.gstatic.com/ https://polyfill.io/ https://www.gartner.com https://www.piloggroup.com/ https://test.ccavenue.com/ https://www.google.com/ http://fonts.googleapis.com/ http://fonts.gstatic.com/ https://js.arcgis.com/"))).xssProtection();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        List allowedOrigins = new ArrayList();
        allowedOrigins.add("http://integraldataanalytics.com");
        allowedOrigins.add("https://integraldataanalytics.com");
        allowedOrigins.add("https://cdnjs.cloudflare.com");
        allowedOrigins.add("https://nominatim.openstreetmap.org");
        allowedOrigins.add("https://fastly.jsdelivr.net");
        allowedOrigins.add("https://maps.googleapis.com");
        allowedOrigins.add("https://test.ccavenue.com/");
        
        
        //configuration.setAllowedOrigins(allowedOrigins);
        configuration.setAllowedOrigins(Arrays.asList("*"));
		/*
		 * configuration.addAllowedOrigin("https://integraldataanalytics.com");
		 * configuration.addAllowedOrigin("https://cdnjs.cloudflare.com");
		 * configuration.addAllowedOrigin("https://nominatim.openstreetmap.org");
		 * configuration.addAllowedOrigin("https://fastly.jsdelivr.net");
		 * configuration.addAllowedOrigin("https://maps.googleapis.com");
		 */
        
        configuration.addAllowedMethod("*"); 
        configuration.addAllowedHeader("*"); 

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
    
//    
//    public void addCorsMappings(CorsRegistry registry) {
//		registry.addMapping("/**")
//			.allowedOrigins("https://integraldataanalytics.com")
//			.allowedMethods("*")
//			.allowedHeaders("*")
//			.exposedHeaders("*")
//			.allowCredentials(false).maxAge(3600);
//	}
    
//    @Bean
//    public WebMvcConfigurer corsConfigurer() {
//        return new WebMvcConfigurer() {
//            @Override
//            public void addCorsMappings(CorsRegistry registry) {
//                registry.addMapping("/**")
//                        .allowedOrigins("https://integraldataanalytics.com")
//                        .allowedMethods("GET", "POST", "PUT", "DELETE");
//            }
//        };
//    }
}