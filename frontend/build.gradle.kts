import org.openrepose.gradle.plugins.jaxb.extension.JaxbExtension

plugins {
    java
    id("org.springframework.boot") version "3.0.6"
    id("io.spring.dependency-management") version "1.1.0"
    id("com.github.seanrl.jaxb") version "2.5.4"
    id("com.github.node-gradle.node") version "5.0.0"
}

java.sourceCompatibility = JavaVersion.VERSION_19

configurations {
    compileOnly {
        extendsFrom(configurations.annotationProcessor.get())
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("org.springframework.boot:spring-boot-starter-thymeleaf")
    implementation("org.thymeleaf.extras:thymeleaf-extras-springsecurity6")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-oauth2-client")
    implementation("org.springframework.boot:spring-boot-starter-oauth2-resource-server")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("jakarta.xml.bind:jakarta.xml.bind-api:4.0.0")
    implementation("org.glassfish.jaxb:jaxb-core:4.0.2")
    compileOnly("org.projectlombok:lombok")

    jaxb("org.glassfish.jaxb:jaxb-xjc:4.0.2")
    jaxb("com.sun.xml.bind:jaxb-impl:4.0.2")

    runtimeOnly("com.h2database:h2")

    annotationProcessor("org.springframework.boot:spring-boot-configuration-processor")
    annotationProcessor("org.projectlombok:lombok")

    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.security:spring-security-test")
}

val generatedSourcesPath = file("build/generated-sources/xjc")

java.sourceSets["main"].java.srcDir(generatedSourcesPath)

configure<JaxbExtension> {
    xsdDir = "src/main/resources/schema"
    xjc {
        taskClassname = "com.sun.tools.xjc.XJC2Task"
        generatePackage = "com.paganstocks.musicapp.musicxml"
        bindingsDir = "src/main/resources/schema/bindings"
        accessExternalSchema = "all"
        args = listOf("-XautoNameResolution")
    }
}

tasks.named("xsd-dependency-tree").configure {
    outputs.upToDateWhen { false }
}

tasks.withType<Test> {
    useJUnitPlatform()
}

sourceSets {
    java {
        main {
            resources {
            }
        }
    }
}

tasks.withType<JavaCompile> {
    dependsOn(tasks.xjc)
}
