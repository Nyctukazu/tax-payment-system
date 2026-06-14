package gov.pasay.taxsystem.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PortalController {
    
    @GetMapping("/portal")
    public String showPortalLandingPage() {
        return "index";
    }

    @GetMapping("/admin-login")
    public String adminLogin() {
        return "admin/admin-login";
    }

    @GetMapping("/client-login")
    public String ClientLogin() {
        return "client/client-login";
    }

     @GetMapping("/client-register")
    public String Clientregister() {
        return "client/client-register";
    }

     @GetMapping("/client-dashboard")
    public String Clientdashboard() {
        return "client/client-dashboard";
    }
}
