package gov.pasay.taxsystem.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PortalController {
    
    @GetMapping("/portal")
    public String showPortalLandingPage() {
        return "index";
    }

}
