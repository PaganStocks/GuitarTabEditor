package com.paganstocks.musicapp.site;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping(value = "/site", produces = MediaType.TEXT_HTML_VALUE)
public class SiteController {

    @GetMapping
    public String index() {
        return "index";
    }

    @GetMapping("/profile")
    public String profile() {
        return "profile";
    }

    @GetMapping("/editor")
    public String editor() {
        return "editor";
    }
}
