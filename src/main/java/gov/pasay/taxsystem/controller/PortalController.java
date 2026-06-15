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
    public String ClientRegister() {
        return "client/client-register";
    }

    @GetMapping("/admin-dashboard")
    public String AdminDashboard() {
        return "admin/dashboard";
    }

    @GetMapping("/evaluate-inbox")
    public String EvaluateInbox() {
        return "admin/evaluate-inbox";
    }

    @GetMapping("/evaluate-review")
    public String EvaluateReview() {
        return "admin/evaluate-review";
    }

    @GetMapping("/user-control")
    public String UserControl() {
        return "admin/user-control";
    }
}
